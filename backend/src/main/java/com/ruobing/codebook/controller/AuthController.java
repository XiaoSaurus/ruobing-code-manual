package com.ruobing.codebook.controller;

import com.ruobing.codebook.common.Result;
import com.ruobing.codebook.dto.AuthForgotPasswordRequest;
import com.ruobing.codebook.dto.AuthLoginRequest;
import com.ruobing.codebook.dto.AuthRegisterRequest;
import com.ruobing.codebook.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@Tag(name = "认证", description = "管理后台登录 / 注册 / 找回密码")
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Operation(summary = "登录", description = "用户名密码登录，返回 JWT")
    @PostMapping("/login")
    public Result<?> login(@RequestBody AuthLoginRequest req) {
        try {
            return Result.success(authService.login(req));
        } catch (IllegalArgumentException e) {
            return Result.error(400, e.getMessage());
        }
    }

    @Operation(summary = "注册", description = "注册为编辑角色账号")
    @PostMapping("/register")
    public Result<?> register(@RequestBody AuthRegisterRequest req) {
        try {
            return Result.success(authService.register(req));
        } catch (IllegalArgumentException e) {
            return Result.error(400, e.getMessage());
        }
    }

    @Operation(summary = "忘记密码", description = "凭用户名 + 已绑定邮箱重置密码")
    @PostMapping("/forgot-password")
    public Result<?> forgotPassword(@RequestBody AuthForgotPasswordRequest req) {
        try {
            authService.forgotPassword(req);
            return Result.success();
        } catch (IllegalArgumentException e) {
            return Result.error(400, e.getMessage());
        }
    }

    @Operation(summary = "当前登录用户信息")
    @GetMapping("/me")
    public Result<?> me(HttpServletRequest request) {
        Long uid = (Long) request.getAttribute("auth_uid");
        return Result.success(authService.me(uid));
    }

    @Operation(summary = "更新当前登录用户资料")
    @PutMapping("/me/profile")
    public Result<?> updateMyProfile(@RequestBody Map<String, String> body, HttpServletRequest request) {
        Long uid = (Long) request.getAttribute("auth_uid");
        return Result.success(authService.updateMyProfile(
                uid,
                body == null ? null : body.get("nickname"),
                body == null ? null : body.get("avatar"),
                body == null ? null : body.get("email")
        ));
    }

    @Operation(summary = "按角色获取菜单")
    @GetMapping("/menus")
    public Result<?> menus(HttpServletRequest request) {
        String role = (String) request.getAttribute("auth_role");
        return Result.success(authService.menusByRole(role == null ? "editor" : role));
    }
}
