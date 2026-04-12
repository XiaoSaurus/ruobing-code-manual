package com.ruobing.codebook.controller;

import com.ruobing.codebook.common.Result;
import com.ruobing.codebook.entity.User;
import com.ruobing.codebook.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Tag(name = "小程序用户", description = "小程序用户管理接口")
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Operation(summary = "微信登录", description = "前端传 code，后端换 openid，新用户自动注册")
    @PostMapping("/login")
    public Result<?> login(@RequestBody Map<String, String> params) {
        String code = params.get("code");
        String nickname = params.get("nickname");
        String avatar = params.get("avatar");
        if (code == null || code.isEmpty()) {
            return Result.error("缺少 code 参数");
        }
        User user = userService.loginByWechat(code, nickname, avatar);
        Map<String, Object> data = new HashMap<>();
        data.put("user", user);
        return Result.success(data);
    }

    @Operation(summary = "获取用户信息", description = "根据ID获取用户信息")
    @GetMapping("/{id}")
    public Result<?> getUser(
            @Parameter(description = "用户ID") @PathVariable Long id) {
        return Result.success(userService.getById(id));
    }

    @Operation(summary = "更新用户信息", description = "更新用户资料")
    @PutMapping
    public Result<?> update(@RequestBody User user) {
        userService.updateInfo(user);
        return Result.success();
    }

    @Operation(summary = "通过 openid 获取用户信息", description = "小程序同步用户数据")
    @GetMapping("/info")
    public Result<?> getByOpenid(
            @Parameter(description = "用户 openid") @RequestParam String openid) {
        User user = userService.getByOpenid(openid);
        if (user == null) {
            return Result.error(404, "用户不存在");
        }
        return Result.success(user);
    }

    @Operation(summary = "通过 openid 更新用户资料", description = "小程序保存个人资料")
    @PutMapping("/info")
    public Result<?> updateByOpenid(@RequestBody Map<String, String> params) {
        String openid = params.get("openid");
        if (openid == null || openid.isEmpty()) {
            return Result.error("缺少 openid");
        }
        String nickname = params.get("nickname");
        String avatar = params.get("avatar");
        Integer gender = params.get("gender") != null ? Integer.parseInt(params.get("gender")) : null;
        String phone = params.get("phone");
        String email = params.get("email");
        userService.updateProfile(openid, nickname, avatar, gender, phone, email);
        return Result.success();
    }
}
