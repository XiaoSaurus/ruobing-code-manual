package com.ruobing.codebook.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.ruobing.codebook.entity.SysMenu;
import com.ruobing.codebook.entity.SysRole;
import com.ruobing.codebook.entity.SysRoleMenu;
import com.ruobing.codebook.repository.SysMenuRepository;
import com.ruobing.codebook.repository.SysRoleMenuRepository;
import com.ruobing.codebook.repository.SysRoleRepository;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RbacService {

    private final SysRoleRepository roleRepository;
    private final SysMenuRepository menuRepository;
    private final SysRoleMenuRepository roleMenuRepository;

    public RbacService(SysRoleRepository roleRepository, SysMenuRepository menuRepository, SysRoleMenuRepository roleMenuRepository) {
        this.roleRepository = roleRepository;
        this.menuRepository = menuRepository;
        this.roleMenuRepository = roleMenuRepository;
    }

    public List<SysRole> listRoles() {
        return roleRepository.selectList(new QueryWrapper<SysRole>().orderByAsc("id"));
    }

    public List<SysMenu> listMenus() {
        return menuRepository.selectList(new QueryWrapper<SysMenu>().eq("status", 1).orderByAsc("sort_order").orderByAsc("id"));
    }

    public SysRole saveRole(SysRole role) {
        if (!StringUtils.hasText(role.getRoleCode()) || !StringUtils.hasText(role.getRoleName())) {
            throw new IllegalArgumentException("roleCode 和 roleName 不能为空");
        }
        role.setRoleCode(role.getRoleCode().trim());
        role.setRoleName(role.getRoleName().trim());
        if (role.getStatus() == null) role.setStatus(1);
        if (role.getId() == null) {
            if (roleRepository.selectOne(new QueryWrapper<SysRole>().eq("role_code", role.getRoleCode())) != null) {
                throw new IllegalArgumentException("角色编码已存在");
            }
            roleRepository.insert(role);
        } else {
            roleRepository.updateById(role);
        }
        return roleRepository.selectById(role.getId());
    }

    public void deleteRole(String roleCode) {
        if (!StringUtils.hasText(roleCode)) throw new IllegalArgumentException("roleCode 不能为空");
        String code = roleCode.trim();
        if ("admin".equalsIgnoreCase(code) || "app_user".equalsIgnoreCase(code)) {
            throw new IllegalArgumentException("内置角色不允许删除");
        }
        roleRepository.delete(new QueryWrapper<SysRole>().eq("role_code", code));
        roleMenuRepository.delete(new QueryWrapper<SysRoleMenu>().eq("role_code", code));
    }

    public List<Long> getRoleMenuIds(String roleCode) {
        if (!StringUtils.hasText(roleCode)) return Collections.emptyList();
        return roleMenuRepository.selectList(new QueryWrapper<SysRoleMenu>().eq("role_code", roleCode.trim()))
                .stream().map(SysRoleMenu::getMenuId).collect(Collectors.toList());
    }

    public void bindRoleMenus(String roleCode, List<Long> menuIds) {
        if (!StringUtils.hasText(roleCode)) throw new IllegalArgumentException("roleCode 不能为空");
        String code = roleCode.trim();
        if (roleRepository.selectOne(new QueryWrapper<SysRole>().eq("role_code", code)) == null) {
            throw new IllegalArgumentException("角色不存在: " + code);
        }
        roleMenuRepository.delete(new QueryWrapper<SysRoleMenu>().eq("role_code", code));
        if (menuIds == null || menuIds.isEmpty()) return;
        LinkedHashSet<Long> ids = new LinkedHashSet<>(menuIds);
        for (Long id : ids) {
            if (id == null) continue;
            SysRoleMenu rm = new SysRoleMenu();
            rm.setRoleCode(code);
            rm.setMenuId(id);
            roleMenuRepository.insert(rm);
        }
    }

    public List<Map<String, Object>> resolveMenusByRole(String roleCode) {
        String code = StringUtils.hasText(roleCode) ? roleCode.trim() : "app_user";
        List<Long> menuIds = getRoleMenuIds(code);
        List<SysMenu> menus;
        if (menuIds.isEmpty()) {
            menus = listMenus();
        } else {
            menus = menuRepository.selectBatchIds(menuIds).stream()
                    .filter(Objects::nonNull)
                    .filter(m -> m.getStatus() == null || m.getStatus() == 1)
                    .sorted(Comparator.comparing((SysMenu m) -> m.getSortOrder() == null ? 0 : m.getSortOrder())
                            .thenComparing(m -> m.getId() == null ? 0L : m.getId()))
                    .collect(Collectors.toList());
        }

        List<Map<String, Object>> out = new ArrayList<>();
        for (SysMenu m : menus) {
            Map<String, Object> x = new LinkedHashMap<>();
            x.put("id", m.getId());
            x.put("path", m.getPath());
            x.put("title", m.getTitle());
            x.put("icon", m.getIcon());
            out.add(x);
        }
        return out;
    }
}
