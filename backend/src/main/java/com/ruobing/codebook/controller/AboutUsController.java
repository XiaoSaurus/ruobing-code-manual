package com.ruobing.codebook.controller;

import com.ruobing.codebook.common.Result;
import com.ruobing.codebook.entity.AboutUs;
import com.ruobing.codebook.service.AboutUsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@Tag(name = "关于我们", description = "关于我们页面管理接口")
@RestController
@RequestMapping("/about")
public class AboutUsController {

    @Autowired
    private AboutUsService aboutUsService;

    @Operation(summary = "获取关于我们信息", description = "获取关于我们页面内容")
    @GetMapping
    public Result<?> get() {
        return Result.success(aboutUsService.get());
    }

    @Operation(summary = "更新关于我们信息", description = "更新关于我们页面内容")
    @PutMapping
    public Result<?> update(@RequestBody AboutUs aboutUs) {
        aboutUsService.update(aboutUs);
        return Result.success();
    }
}
