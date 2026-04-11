package com.ruobing.codebook.controller;

import com.ruobing.codebook.common.Result;
import com.ruobing.codebook.entity.User;
import com.ruobing.codebook.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

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

    @GetMapping("/{id}")
    public Result<?> getUser(@PathVariable Long id) {
        return Result.success(userService.getById(id));
    }

    @PutMapping
    public Result<?> update(@RequestBody User user) {
        userService.updateInfo(user);
        return Result.success();
    }
}
