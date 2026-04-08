package com.ruobing.codebook.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ruobing.codebook.entity.SysUser;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface SysUserRepository extends BaseMapper<SysUser> {
}
