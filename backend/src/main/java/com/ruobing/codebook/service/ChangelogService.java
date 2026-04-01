package com.ruobing.codebook.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.ruobing.codebook.entity.Changelog;
import com.ruobing.codebook.repository.ChangelogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChangelogService {

    @Autowired
    private ChangelogRepository changelogRepository;

    public List<Changelog> getList() {
        return changelogRepository.selectList(
            new QueryWrapper<Changelog>().orderByDesc("create_time")
        );
    }
}
