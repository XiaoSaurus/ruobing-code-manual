package com.ruobing.codebook.service;

import com.ruobing.codebook.dto.AuthForgotPasswordRequest;
import com.ruobing.codebook.dto.AuthLoginRequest;
import com.ruobing.codebook.dto.AuthRegisterRequest;
import com.ruobing.codebook.entity.User;
import com.ruobing.codebook.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private RbacService rbacService;

    public Map<String, Object> login(AuthLoginRequest req) {
        if (!StringUtils.hasText(req.getUsername()) || !StringUtils.hasText(req.getPassword())) {
            throw new IllegalArgumentException("请输入用户名和密码");
        }
        User u = userService.getByUsername(req.getUsername().trim());
        if (u == null) {
            throw new IllegalArgumentException("用户名或密码错误");
        }
        if (!req.getPassword().equals(u.getPassword())) {
            throw new IllegalArgumentException("用户名或密码错误");
        }
        if (u.getStatus() == null || u.getStatus() != 1) {
            throw new IllegalArgumentException("账号已禁用，请联系管理员");
        }
        String token = jwtUtil.createToken(u.getId(), u.getUsername(), u.getRole());
        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("user", toSafeUser(u));
        return data;
    }

    public Map<String, Object> register(AuthRegisterRequest req) {
        String username = req.getUsername() == null ? "" : req.getUsername().trim();
        String password = req.getPassword() == null ? "" : req.getPassword();
        if (username.length() < 3 || username.length() > 32) {
            throw new IllegalArgumentException("用户名为 3～32 个字符");
        }
        if (password.length() < 6 || password.length() > 64) {
            throw new IllegalArgumentException("密码长度为 6～64 位");
        }
        if (userService.getByUsername(username) != null) {
            throw new IllegalArgumentException("用户名已存在");
        }
        User u = new User();
        u.setUsername(username);
        u.setPassword(password);
        u.setNickname(StringUtils.hasText(req.getNickname()) ? req.getNickname().trim() : username);
        u.setEmail(StringUtils.hasText(req.getEmail()) ? req.getEmail().trim() : null);
        u.setRole("editor");
        u.setStatus(1);
        u.setAvatar("");
        userService.saveForAdmin(u);
        String token = jwtUtil.createToken(u.getId(), u.getUsername(), u.getRole());
        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("user", toSafeUser(u));
        return data;
    }

    public void forgotPassword(AuthForgotPasswordRequest req) {
        if (!StringUtils.hasText(req.getUsername()) || !StringUtils.hasText(req.getEmail())
                || !StringUtils.hasText(req.getNewPassword())) {
            throw new IllegalArgumentException("请填写用户名、邮箱和新密码");
        }
        if (req.getNewPassword().length() < 6 || req.getNewPassword().length() > 64) {
            throw new IllegalArgumentException("新密码长度为 6～64 位");
        }
        User u = userService.getByUsername(req.getUsername().trim());
        if (u == null) {
            throw new IllegalArgumentException("用户不存在");
        }
        if (!StringUtils.hasText(u.getEmail())) {
            throw new IllegalArgumentException("该账号未绑定邮箱，无法自助找回，请联系管理员");
        }
        if (!u.getEmail().equalsIgnoreCase(req.getEmail().trim())) {
            throw new IllegalArgumentException("邮箱与账号绑定信息不一致");
        }
        u.setPassword(req.getNewPassword());
        userService.saveForAdmin(u);
    }

    public Map<String, Object> me(Long uid) {
        if (uid == null) {
            throw new IllegalArgumentException("未登录或登录已过期");
        }
        User u = userService.getById(uid);
        if (u == null) {
            throw new IllegalArgumentException("用户不存在");
        }
        return toSafeUser(u);
    }

    public Map<String, Object> updateMyProfile(Long uid, String nickname, String avatar, String email) {
        if (uid == null) {
            throw new IllegalArgumentException("未登录或登录已过期");
        }
        User u = userService.getById(uid);
        if (u == null) {
            throw new IllegalArgumentException("用户不存在");
        }
        if (StringUtils.hasText(nickname)) {
            u.setNickname(nickname.trim());
        }
        if (avatar != null) {
            u.setAvatar(avatar.trim());
        }
        if (email != null) {
            String e = email.trim();
            u.setEmail(e.isEmpty() ? null : e);
        }
        userService.saveForAdmin(u);
        Map<String, Object> data = new HashMap<>();
        data.put("user", toSafeUser(u));
        return data;
    }

    public List<Map<String, Object>> menusByRole(String role) {
        return rbacService.resolveMenusByRole(role);
    }

    private Map<String, Object> toSafeUser(User u) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", u.getId());
        m.put("username", u.getUsername());
        m.put("nickname", u.getNickname());
        m.put("avatar", u.getAvatar());
        m.put("role", u.getRole());
        m.put("status", u.getStatus());
        m.put("email", u.getEmail());
        return m;
    }
}
