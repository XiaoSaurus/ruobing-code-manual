package com.ruobing.codebook.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ruobing.codebook.entity.Changelog;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ChangelogRepository extends BaseMapper<Changelog> {
}
