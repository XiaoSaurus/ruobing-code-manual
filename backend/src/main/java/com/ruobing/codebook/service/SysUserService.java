package com.ruobing.codebook.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.ruobing.codebook.entity.SysUser;
import com.ruobing.codebook.repository.SysUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SysUserService {

    @Autowired
    private SysUserRepository sysUserRepository;

    public Page<SysUser> getPage(int page, int pageSize, String keyword) {
        Page<SysUser> p = new Page<>(page, pageSize);
        QueryWrapper<SysUser> q = new QueryWrapper<>();
        q.lambda()
            .like(keyword != null && !keyword.isBlank(), SysUser::getNickname, keyword)
            .or()
            .like(keyword != null && !keyword.isBlank(), SysUser::getUsername, keyword)
            .orderByDesc(SysUser::getCreateTime);
        return sysUserRepository.selectPage(p, q);
    }

    public List<SysUser> getAll() {
        return sysUserRepository.selectList(
            new QueryWrapper<SysUser>().orderByDesc("create_time")
        );
    }

    public SysUser getById(Long id) {
        return sysUserRepository.selectById(id);
    }

    public SysUser getByUsername(String username) {
        return sysUserRepository.selectOne(
            new QueryWrapper<SysUser>().eq("username", username)
        );
    }

    public void save(SysUser user) {
        if (user.getId() != null) {
            sysUserRepository.updateById(user);
        } else {
            sysUserRepository.insert(user);
        }
    }

    public void delete(Long id) {
        sysUserRepository.deleteById(id);
    }

    public void updateStatus(Long id, Integer status) {
        SysUser u = new SysUser();
        u.setId(id);
        u.setStatus(status);
        sysUserRepository.updateById(u);
    }

    public Long getTotalCount() {
        return sysUserRepository.selectCount(null);
    }

    public Long getActiveCount() {
        return sysUserRepository.selectCount(
            new QueryWrapper<SysUser>().eq("status", 1)
        );
    }
}
