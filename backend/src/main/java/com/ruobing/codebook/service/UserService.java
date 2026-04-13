package com.ruobing.codebook.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ruobing.codebook.entity.User;
import com.ruobing.codebook.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SmsCodeService smsCodeService;

    @Value("${wxapp.appid:}")
    private String appid;

    @Value("${wxapp.secret:}")
    private String secret;

    /** 微信开放平台「网站应用」扫码登录（与小程序 appid 不同） */
    @Value("${wxweb.appid:}")
    private String wxWebAppId;

    @Value("${wxweb.secret:}")
    private String wxWebSecret;

    /**
     * 微信登录：拿 code 换 openid，再查库/注册
     * 新用户自动入库，已登录用户直接返回
     */
    public User loginByWechat(String code, String nickname, String avatar) {
        String openid = getOpenidFromCode(code);
        if (openid == null) {
            throw new RuntimeException("微信授权失败，无效的 code");
        }
        return createOrUpdate(openid, nickname, avatar);
    }

    /**
     * 发送登录短信验证码（中国大陆 11 位手机号）。
     */
    public void sendLoginSms(String phone) {
        smsCodeService.sendCode(normalizeCnPhone(phone));
    }

    /**
     * 手机号 + 验证码登录：已存在该手机号则直接登录；否则以 pl_ 前缀 openid 注册。
     * 若用户先微信登录后在资料中绑定手机，则此处会命中同一账号。
     */
    public User loginByPhone(String phone, String code) {
        String p = normalizeCnPhone(phone);
        smsCodeService.verify(p, code);
        User user = getByPhone(p);
        if (user != null) {
            return user;
        }
        user = new User();
        user.setOpenid("pl_" + p);
        user.setPhone(p);
        user.setNickname("用户" + p.substring(7));
        user.setGender(0);
        user.setRole("app_user");
        user.setStatus(1);
        userRepository.insert(user);
        return user;
    }

    public User getByPhone(String phone) {
        String p = normalizeCnPhone(phone);
        return userRepository.selectOne(
            new QueryWrapper<User>().eq("phone", p).last("LIMIT 1")
        );
    }

    public User getByUsername(String username) {
        if (!StringUtils.hasText(username)) return null;
        return userRepository.selectOne(new QueryWrapper<User>().eq("username", username.trim()).last("LIMIT 1"));
    }

    public Page<User> getPageForAdmin(int page, int pageSize, String keyword) {
        Page<User> p = new Page<>(page, pageSize);
        QueryWrapper<User> q = new QueryWrapper<>();
        if (StringUtils.hasText(keyword)) {
            String kw = keyword.trim();
            q.lambda()
                    .like(User::getNickname, kw)
                    .or().like(User::getUsername, kw)
                    .or().like(User::getEmail, kw)
                    .or().like(User::getPhone, kw);
        }
        q.orderByDesc("create_time");
        return userRepository.selectPage(p, q);
    }

    public List<User> getAllForAdmin() {
        return userRepository.selectList(new QueryWrapper<User>().orderByDesc("create_time"));
    }

    public void saveForAdmin(User user) {
        if (user.getRole() == null || user.getRole().isBlank()) user.setRole("app_user");
        if (user.getStatus() == null) user.setStatus(1);
        if (user.getId() != null) {
            userRepository.updateById(user);
        } else {
            userRepository.insert(user);
        }
    }

    public void deleteForAdmin(Long id) {
        userRepository.deleteById(id);
    }

    public void updateStatusForAdmin(Long id, Integer status) {
        User u = new User();
        u.setId(id);
        u.setStatus(status);
        userRepository.updateById(u);
    }

    public Long countAllUsers() {
        return userRepository.selectCount(null);
    }

    public Long countActiveUsers() {
        return userRepository.selectCount(new QueryWrapper<User>().eq("status", 1));
    }

    private static String normalizeCnPhone(String phone) {
        if (!StringUtils.hasText(phone)) {
            throw new IllegalArgumentException("请输入手机号");
        }
        String p = phone.trim();
        if (!p.matches("^1[3-9]\\d{9}$")) {
            throw new IllegalArgumentException("请输入正确的中国大陆手机号");
        }
        return p;
    }

    /**
     * 调用微信接口，用 code 换 openid
     */
    private String getOpenidFromCode(String code) {
        // 未配置 appid/secret 时：wx.login 每次返回的 code 都不同，
        // 若用「debug_openid_ + code」会每次登录都是新 openid，资料永远对不上。
        if (!StringUtils.hasText(appid) || !StringUtils.hasText(secret)) {
            return "debug_openid_stable";
        }
        String url = "https://api.weixin.qq.com/sns/jscode2session"
                + "?appid=" + appid
                + "&secret=" + secret
                + "&js_code=" + code
                + "&grant_type=authorization_code";
        try {
            RestTemplate restTemplate = new RestTemplate();
            String resp = restTemplate.getForObject(url, String.class);
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(resp);
            if (node.has("openid")) {
                return node.get("openid").asText();
            }
            return null;
        } catch (Exception e) {
            return null;
        }
    }

    public User getByOpenid(String openid) {
        return userRepository.selectOne(
            new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<User>()
                .eq("openid", openid)
        );
    }

    public User getByWebOpenid(String webOpenid) {
        if (!StringUtils.hasText(webOpenid)) {
            return null;
        }
        return userRepository.selectOne(
            new QueryWrapper<User>().eq("web_openid", webOpenid).last("LIMIT 1")
        );
    }

    /**
     * 微信网站应用 OAuth2：用 code 换 access_token，按 web_openid 查库；无则拉取 sns/userinfo 注册新用户。
     * @see <a href="https://developers.weixin.qq.com/doc/oplatform/Website_App/WeChat_Login/Wechat_Login.html">微信登录</a>
     */
    public User loginOrRegisterByWechatWeb(String code) {
        if (!StringUtils.hasText(wxWebAppId) || !StringUtils.hasText(wxWebSecret)) {
            throw new IllegalStateException("未配置微信网站应用 wxweb.appid / wxweb.secret，无法使用微信登录");
        }
        if (!StringUtils.hasText(code)) {
            throw new IllegalArgumentException("缺少微信授权 code");
        }
        RestTemplate rt = new RestTemplate();
        String tokenUrl = String.format(
                "https://api.weixin.qq.com/sns/oauth2/access_token?appid=%s&secret=%s&code=%s&grant_type=authorization_code",
                wxWebAppId, wxWebSecret, code);
        String tokenResp;
        try {
            tokenResp = rt.getForObject(tokenUrl, String.class);
        } catch (Exception e) {
            throw new IllegalArgumentException("微信授权请求失败");
        }
        ObjectMapper mapper = new ObjectMapper();
        JsonNode root;
        try {
            root = mapper.readTree(tokenResp != null ? tokenResp : "{}");
        } catch (Exception e) {
            throw new IllegalArgumentException("微信授权响应无效");
        }
        if (root.has("errcode") && root.get("errcode").asInt() != 0) {
            String msg = root.has("errmsg") ? root.get("errmsg").asText() : "错误";
            throw new IllegalArgumentException("微信授权失败: " + msg);
        }
        if (!root.has("openid") || !root.has("access_token")) {
            throw new IllegalArgumentException("微信授权未返回 openid");
        }
        String openid = root.get("openid").asText();
        String accessToken = root.get("access_token").asText();

        User existing = getByWebOpenid(openid);
        if (existing != null) {
            return existing;
        }

        String nickname = "微信用户";
        String avatar = "";
        String infoUrl = String.format(
                "https://api.weixin.qq.com/sns/userinfo?access_token=%s&openid=%s&lang=zh_CN",
                accessToken, openid);
        try {
            String infoResp = rt.getForObject(infoUrl, String.class);
            JsonNode info = mapper.readTree(infoResp != null ? infoResp : "{}");
            if (!info.has("errcode") || info.get("errcode").asInt() == 0) {
                if (info.has("nickname")) {
                    nickname = info.get("nickname").asText();
                }
                if (info.has("headimgurl")) {
                    avatar = info.get("headimgurl").asText();
                }
            }
        } catch (Exception ignored) {
            // 无 snsapi_login 用户资料权限时可能失败，仍用占位昵称注册
        }

        User user = new User();
        user.setWebOpenid(openid);
        user.setNickname(nickname);
        user.setAvatar(avatar);
        user.setGender(0);
        user.setRole("app_user");
        user.setStatus(1);
        userRepository.insert(user);
        return user;
    }

    /**
     * 新用户写入微信昵称/头像；已存在用户登录时不再用本次授权覆盖库里的资料，
     * 否则会把用户在「个人资料」里保存的昵称/头像冲掉。
     * 若库里昵称为空，则用本次微信昵称补一次（首次完善资料）。
     */
    public User createOrUpdate(String openid, String nickname, String avatar) {
        User user = getByOpenid(openid);
        if (user == null) {
            user = new User();
            user.setOpenid(openid);
            user.setNickname(nickname);
            user.setAvatar(avatar);
            if (user.getGender() == null) {
                user.setGender(0);
            }
            user.setRole("app_user");
            user.setStatus(1);
            userRepository.insert(user);
            return user;
        }
        boolean needUpdate = false;
        if ((user.getNickname() == null || user.getNickname().isEmpty())
                && nickname != null && !nickname.isEmpty()) {
            user.setNickname(nickname);
            needUpdate = true;
        }
        if ((user.getAvatar() == null || user.getAvatar().isEmpty())
                && avatar != null && !avatar.isEmpty()) {
            user.setAvatar(avatar);
            needUpdate = true;
        }
        if (needUpdate) {
            userRepository.updateById(user);
        }
        return user;
    }

    public User getById(Long id) {
        return userRepository.selectById(id);
    }

    public void updateInfo(User user) {
        userRepository.updateById(user);
    }

    /**
     * 通过 openid 更新用户资料
     * @return false 表示 openid 在库中不存在（openid 与登录不一致时）
     */
    public boolean updateProfile(String openid, String nickname, String avatar,
                               Integer gender, String phone, String email,
                               String province, String city, String district) {
        User user = getByOpenid(openid);
        if (user == null) {
            return false;
        }
        if (nickname != null) user.setNickname(nickname);
        if (avatar != null) user.setAvatar(avatar);
        if (gender != null) user.setGender(gender);
        if (phone != null) user.setPhone(phone);
        if (email != null) user.setEmail(email);
        if (province != null) user.setProvince(province);
        if (city != null) user.setCity(city);
        if (district != null) user.setDistrict(district);
        userRepository.updateById(user);
        return true;
    }
}
