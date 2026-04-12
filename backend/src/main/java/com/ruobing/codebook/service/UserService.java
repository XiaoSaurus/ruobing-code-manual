package com.ruobing.codebook.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ruobing.codebook.entity.User;
import com.ruobing.codebook.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
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
        if (appid == null || appid.isEmpty() || secret == null || secret.isEmpty()) {
            // 未配置微信参数，调试模式下直接用 code 充当 openid（仅开发测试用）
            return "debug_openid_" + code;
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

    public User createOrUpdate(String openid, String nickname, String avatar) {
        User user = getByOpenid(openid);
        if (user == null) {
            user = new User();
            user.setOpenid(openid);
            user.setNickname(nickname);
            user.setAvatar(avatar);
            userRepository.insert(user);
        } else {
            if (nickname != null) user.setNickname(nickname);
            if (avatar != null) user.setAvatar(avatar);
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
}
