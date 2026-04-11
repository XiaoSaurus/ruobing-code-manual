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

    @Operation(summary = "微信登录", description = "小程序微信授权登录")
    @PostMapping("/login")
    public Result<?> login(@RequestBody Map<String, String> params) {
        String openid = params.get("openid");
        String nickname = params.get("nickname");
        String avatar = params.get("avatar");
        User user = userService.createOrUpdate(openid, nickname, avatar);
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
}
