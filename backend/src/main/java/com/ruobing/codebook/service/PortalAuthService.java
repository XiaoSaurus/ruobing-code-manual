package com.ruobing.codebook.service;

import com.ruobing.codebook.entity.User;
import com.ruobing.codebook.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.HashMap;
import java.util.Map;

@Service
public class PortalAuthService {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private OAuthLoginTicketService oAuthLoginTicketService;

    public Map<String, Object> loginBySms(String phone, String code) {
        User u = userService.loginByPhone(phone, code);
        return wrapAppUser(u);
    }

    public Map<String, Object> exchangeOAuthTicket(String ticket) {
        if (!StringUtils.hasText(ticket)) {
            throw new IllegalArgumentException("缺少 ticket");
        }
        Long uid = oAuthLoginTicketService.redeem(ticket.trim());
        if (uid == null) {
            throw new IllegalArgumentException("登录凭证无效或已过期，请重新扫码");
        }
        User u = userService.getById(uid);
        if (u == null) {
            throw new IllegalStateException("用户不存在");
        }
        return wrapAppUser(u);
    }

    public String issueTicketAfterWechat(User u) {
        return oAuthLoginTicketService.issue(u.getId());
    }

    public Map<String, Object> me(Long uid) {
        if (uid == null) {
            throw new IllegalArgumentException("未登录或登录已过期");
        }
        User u = userService.getById(uid);
        if (u == null) {
            throw new IllegalArgumentException("用户不存在");
        }
        return toSafeAppUser(u);
    }

    public Map<String, Object> updateMyProfile(Long uid, String nickname, String avatar, String email) {
        if (uid == null) {
            throw new IllegalArgumentException("未登录或登录已过期");
        }
        User u = userService.getById(uid);
        if (u == null) {
            throw new IllegalArgumentException("用户不存在");
        }
        if (nickname != null) u.setNickname(nickname.trim());
        if (avatar != null) u.setAvatar(avatar.trim());
        if (email != null) {
            String e = email.trim();
            u.setEmail(e.isEmpty() ? null : e);
        }
        userService.updateInfo(u);
        Map<String, Object> data = new HashMap<>();
        data.put("user", toSafeAppUser(u));
        return data;
    }

    private Map<String, Object> wrapAppUser(User u) {
        String token = jwtUtil.createAppUserToken(u.getId(), subjectFor(u));
        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("user", toSafeAppUser(u));
        return data;
    }

    private static String subjectFor(User u) {
        if (StringUtils.hasText(u.getNickname())) {
            return u.getNickname().trim();
        }
        if (StringUtils.hasText(u.getPhone())) {
            return u.getPhone().trim();
        }
        return "user" + u.getId();
    }

    private static Map<String, Object> toSafeAppUser(User u) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", u.getId());
        m.put("nickname", u.getNickname());
        m.put("avatar", u.getAvatar());
        m.put("phone", u.getPhone());
        m.put("email", u.getEmail());
        m.put("openid", u.getOpenid());
        m.put("gender", u.getGender());
        m.put("role", "app_user");
        return m;
    }
}
