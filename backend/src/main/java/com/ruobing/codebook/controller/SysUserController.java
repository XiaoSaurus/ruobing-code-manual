package com.ruobing.codebook.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
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

@Tag(name = "系统用户管理", description = "后台管理系统用户接口")
@RestController
@RequestMapping("/user/admin")
public class SysUserController {

    @Autowired
    private UserService userService;

    @Operation(summary = "获取用户列表", description = "分页查询系统用户")
    @GetMapping("/list")
    public Result<?> getList(
            @Parameter(description = "页码") @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "每页数量") @RequestParam(defaultValue = "10") int pageSize,
            @Parameter(description = "搜索关键词") @RequestParam(required = false) String keyword
    ) {
        Page<User> p = userService.getPageForAdmin(page, pageSize, keyword);
        Map<String, Object> result = new HashMap<>();
        result.put("records", p.getRecords());
        result.put("total", p.getTotal());
        result.put("pages", p.getPages());
        result.put("current", p.getCurrent());
        result.put("size", p.getSize());
        return Result.success(result);
    }

    @Operation(summary = "获取所有用户", description = "获取全部系统用户（不分页）")
    @GetMapping("/all")
    public Result<?> getAll() {
        return Result.success(userService.getAllForAdmin());
    }

    @Operation(summary = "获取用户详情", description = "根据ID获取用户信息")
    @GetMapping("/{id}")
    public Result<?> getById(
            @Parameter(description = "用户ID") @PathVariable Long id) {
        return Result.success(userService.getById(id));
    }

    @Operation(summary = "新增用户", description = "创建新的系统用户")
    @PostMapping
    public Result<?> save(@RequestBody User user) {
        userService.saveForAdmin(user);
        return Result.success();
    }

    @Operation(summary = "更新用户", description = "更新用户信息")
    @PutMapping("/{id}")
    public Result<?> update(
            @Parameter(description = "用户ID") @PathVariable Long id,
            @RequestBody User user) {
        user.setId(id);
        userService.saveForAdmin(user);
        return Result.success();
    }

    @Operation(summary = "删除用户", description = "根据ID删除用户")
    @DeleteMapping("/{id}")
    public Result<?> delete(
            @Parameter(description = "用户ID") @PathVariable Long id) {
        userService.deleteForAdmin(id);
        return Result.success();
    }

    @Operation(summary = "更新用户状态", description = "启用/禁用用户")
    @PutMapping("/{id}/status")
    public Result<?> updateStatus(
            @Parameter(description = "用户ID") @PathVariable Long id,
            @Parameter(description = "状态: 0-禁用, 1-启用") @RequestParam Integer status) {
        userService.updateStatusForAdmin(id, status);
        return Result.success();
    }

    @Operation(summary = "获取用户统计", description = "获取用户总数和活跃用户数")
    @GetMapping("/stats")
    public Result<?> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", userService.countAllUsers());
        stats.put("active", userService.countActiveUsers());
        return Result.success(stats);
    }
}
