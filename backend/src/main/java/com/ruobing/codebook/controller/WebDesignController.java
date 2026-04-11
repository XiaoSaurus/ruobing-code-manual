package com.ruobing.codebook.controller;

import com.ruobing.codebook.common.Result;
import com.ruobing.codebook.entity.WebDesign;
import com.ruobing.codebook.service.WebDesignService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Tag(name = "网页设计", description = "网页设计作品管理接口")
@RestController
@RequestMapping("/web-design")
public class WebDesignController {

    @Autowired
    private WebDesignService webDesignService;

    @Operation(summary = "获取网页设计列表", description = "支持关键词搜索、排序和分页")
    @GetMapping("/list")
    public Result<?> getList(
            @Parameter(description = "搜索关键词") @RequestParam(required = false) String keyword,
            @Parameter(description = "排序字段: create_time/views/favorites") @RequestParam(defaultValue = "create_time") String sortBy,
            @Parameter(description = "页码") @RequestParam(defaultValue = "1") Integer page,
            @Parameter(description = "每页数量") @RequestParam(defaultValue = "10") Integer pageSize) {
        return Result.success(webDesignService.getList(keyword, sortBy, page, pageSize));
    }

    @Operation(summary = "获取热门网页设计", description = "按浏览量排序的热门作品")
    @GetMapping("/hot")
    public Result<?> getHotList() {
        return Result.success(webDesignService.getHotList());
    }

    @Operation(summary = "获取最新网页设计", description = "按创建时间排序的最新作品")
    @GetMapping("/latest")
    public Result<?> getLatestList() {
        return Result.success(webDesignService.getLatestList());
    }

    @Operation(summary = "获取网页设计详情", description = "根据ID获取详细信息")
    @GetMapping("/{id}")
    public Result<?> getDetail(
            @Parameter(description = "网页设计ID") @PathVariable Long id) {
        return Result.success(webDesignService.getDetail(id));
    }

    @Operation(summary = "新增网页设计", description = "创建新的网页设计作品")
    @PostMapping
    public Result<?> save(@RequestBody WebDesign webDesign) {
        webDesignService.save(webDesign);
        return Result.success();
    }

    @Operation(summary = "删除网页设计", description = "根据ID删除网页设计作品")
    @DeleteMapping("/{id}")
    public Result<?> delete(
            @Parameter(description = "网页设计ID") @PathVariable Long id) {
        webDesignService.delete(id);
        return Result.success();
    }
}
