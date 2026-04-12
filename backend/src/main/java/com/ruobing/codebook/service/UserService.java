package com.ruobing.codebook.service;

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
import java.util.Map;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Value("${wxapp.appid:}")
    private String appid;

    @Value("${wxapp.secret:}")
    private String secret;

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
