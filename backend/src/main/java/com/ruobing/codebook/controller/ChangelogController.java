package com.ruobing.codebook.controller;

import com.ruobing.codebook.common.Result;
import com.ruobing.codebook.entity.Changelog;
import com.ruobing.codebook.service.ChangelogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/changelog")
public class ChangelogController {

    @Autowired
    private ChangelogService changelogService;

    @GetMapping("/list")
    public Result<?> getList() {
        return Result.success(changelogService.getList());
    }
}
