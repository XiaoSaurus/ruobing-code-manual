package com.ruobing.codebook.controller;

import com.ruobing.codebook.common.Result;
import com.ruobing.codebook.entity.SysMenu;
import com.ruobing.codebook.entity.SysRole;
import com.ruobing.codebook.service.RbacService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Tag(name = "角色权限", description = "角色、菜单、角色菜单绑定")
@RestController
@RequestMapping("/rbac")
public class RbacController {

    private final RbacService rbacService;

    public RbacController(RbacService rbacService) {
        this.rbacService = rbacService;
    }

    @Operation(summary = "角色列表")
    @GetMapping("/roles")
    public Result<?> roles() {
        return Result.success(rbacService.listRoles());
    }

    @Operation(summary = "保存角色")
    @PostMapping("/roles")
    public Result<?> saveRole(@RequestBody SysRole role) {
        return Result.success(rbacService.saveRole(role));
    }

    @Operation(summary = "删除角色")
    @DeleteMapping("/roles/{roleCode}")
    public Result<?> deleteRole(@PathVariable String roleCode) {
        rbacService.deleteRole(roleCode);
        return Result.success();
    }

    @Operation(summary = "菜单列表")
    @GetMapping("/menus")
    public Result<?> menus() {
        return Result.success(rbacService.listMenus());
    }

    @Operation(summary = "菜单列表（含禁用）")
    @GetMapping("/menus/all")
    public Result<?> menusAll() {
        return Result.success(rbacService.listMenusAll());
    }

    @Operation(summary = "保存菜单")
    @PostMapping("/menus")
    public Result<?> saveMenu(@RequestBody SysMenu menu) {
        return Result.success(rbacService.saveMenu(menu));
    }

    @Operation(summary = "删除菜单")
    @DeleteMapping("/menus/{id}")
    public Result<?> deleteMenu(@PathVariable Long id) {
        rbacService.deleteMenu(id);
        return Result.success();
    }

    @Operation(summary = "获取角色绑定菜单")
    @GetMapping("/roles/{roleCode}/menus")
    public Result<?> roleMenus(@PathVariable String roleCode) {
        Map<String, Object> data = new HashMap<>();
        data.put("roleCode", roleCode);
        data.put("menuIds", rbacService.getRoleMenuIds(roleCode));
        return Result.success(data);
    }

    @Operation(summary = "绑定角色菜单")
    @PostMapping("/roles/{roleCode}/menus")
    public Result<?> bindRoleMenus(@PathVariable String roleCode, @RequestBody Map<String, List<Long>> body) {
        List<Long> menuIds = body == null ? null : body.get("menuIds");
        rbacService.bindRoleMenus(roleCode, menuIds);
        return Result.success();
    }
}
