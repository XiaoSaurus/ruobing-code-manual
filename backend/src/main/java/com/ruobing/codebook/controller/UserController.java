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

    @Operation(summary = "发送登录验证码", description = "向手机号发送短信验证码（开发环境见服务端日志）")
    @PostMapping("/sms/send")
    public Result<?> sendSms(@RequestBody Map<String, String> params) {
        String phone = params != null ? params.get("phone") : null;
        userService.sendLoginSms(phone);
        return Result.success();
    }

    @Operation(summary = "手机号验证码登录", description = "与微信登录返回结构一致，含 user")
    @PostMapping("/sms/login")
    public Result<?> loginBySms(@RequestBody Map<String, String> params) {
        String phone = params != null ? params.get("phone") : null;
        String code = params != null ? params.get("code") : null;
        User user = userService.loginByPhone(phone, code);
        Map<String, Object> data = new HashMap<>();
        data.put("user", user);
        return Result.success(data);
    }

    @Operation(summary = "获取用户信息", description = "根据数字ID获取用户（路径不可与 /info 冲突）")
    @GetMapping("/by-id/{id}")
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
    public Result<?> updateByOpenid(@RequestBody Map<String, Object> params) {
        String openid = toStr(params.get("openid"));
        if (openid == null || openid.isEmpty()) {
            return Result.error("缺少 openid");
        }
        String nickname = toStr(params.get("nickname"));
        String avatar = toStr(params.get("avatar"));
        Integer gender = toInt(params.get("gender"));
        String phone = toStr(params.get("phone"));
        String email = toStr(params.get("email"));
        String province = toStr(params.get("province"));
        String city = toStr(params.get("city"));
        String district = toStr(params.get("district"));
        if (!userService.updateProfile(openid, nickname, avatar, gender, phone, email, province, city, district)) {
            return Result.error(404, "用户不存在或 openid 无效，请重新登录");
        }
        return Result.success();
    }

    /** 与 Jackson 数字/字符串兼容；避免把 null 序列化成字面量 "null" */
    private static String toStr(Object o) {
        if (o == null) {
            return null;
        }
        if (o instanceof String) {
            return (String) o;
        }
        String s = String.valueOf(o);
        return "null".equals(s) ? null : s;
    }

    /** 兼容 JSON 里 gender 为数字或字符串 */
    private static Integer toInt(Object o) {
        if (o == null) {
            return null;
        }
        if (o instanceof Number) {
            return ((Number) o).intValue();
        }
        try {
            String s = String.valueOf(o).trim();
            if (s.isEmpty()) {
                return null;
            }
            return Integer.parseInt(s);
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
