package com.ruobing.codebook.controller;

import com.ruobing.codebook.common.Result;
import com.ruobing.codebook.entity.Changelog;
import com.ruobing.codebook.service.ChangelogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@Tag(name = "更新日志", description = "版本更新日志接口")
@RestController
@RequestMapping("/changelog")
public class ChangelogController {

    @Autowired
    private ChangelogService changelogService;

    @Operation(summary = "获取更新日志列表", description = "获取所有版本更新日志")
    @GetMapping("/list")
    public Result<?> getList() {
        return Result.success(changelogService.getList());
    }
}
