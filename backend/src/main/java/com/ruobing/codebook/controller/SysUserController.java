package com.ruobing.codebook.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.ruobing.codebook.common.Result;
import com.ruobing.codebook.entity.SysUser;
import com.ruobing.codebook.service.SysUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/sys-user")
public class SysUserController {

    @Autowired
    private SysUserService sysUserService;

    @GetMapping("/list")
    public Result<?> getList(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String keyword
    ) {
        Page<SysUser> p = sysUserService.getPage(page, pageSize, keyword);
        Map<String, Object> result = new HashMap<>();
        result.put("records", p.getRecords());
        result.put("total", p.getTotal());
        result.put("pages", p.getPages());
        result.put("current", p.getCurrent());
        result.put("size", p.getSize());
        return Result.success(result);
    }

    @GetMapping("/all")
    public Result<?> getAll() {
        return Result.success(sysUserService.getAll());
    }

    @GetMapping("/{id}")
    public Result<?> getById(@PathVariable Long id) {
        return Result.success(sysUserService.getById(id));
    }

    @PostMapping
    public Result<?> save(@RequestBody SysUser user) {
        sysUserService.save(user);
        return Result.success();
    }

    @PutMapping("/{id}")
    public Result<?> update(@PathVariable Long id, @RequestBody SysUser user) {
        user.setId(id);
        sysUserService.save(user);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<?> delete(@PathVariable Long id) {
        sysUserService.delete(id);
        return Result.success();
    }

    @PutMapping("/{id}/status")
    public Result<?> updateStatus(@PathVariable Long id, @RequestParam Integer status) {
        sysUserService.updateStatus(id, status);
        return Result.success();
    }

    @GetMapping("/stats")
    public Result<?> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", sysUserService.getTotalCount());
        stats.put("active", sysUserService.getActiveCount());
        return Result.success(stats);
    }
}
