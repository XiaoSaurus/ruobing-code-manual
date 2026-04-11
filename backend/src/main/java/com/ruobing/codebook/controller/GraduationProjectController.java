package com.ruobing.codebook.controller;

import com.ruobing.codebook.common.Result;
import com.ruobing.codebook.entity.GraduationProject;
import com.ruobing.codebook.service.GraduationProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@Tag(name = "毕业设计", description = "毕业设计项目管理接口")
@RestController
@RequestMapping("/graduation")
public class GraduationProjectController {

    @Autowired
    private GraduationProjectService graduationProjectService;

    @Operation(summary = "获取毕业设计列表", description = "支持关键词搜索、排序和分页")
    @GetMapping("/list")
    public Result<?> getList(
            @Parameter(description = "搜索关键词") @RequestParam(required = false) String keyword,
            @Parameter(description = "排序字段: create_time/views/favorites") @RequestParam(defaultValue = "create_time") String sortBy,
            @Parameter(description = "页码") @RequestParam(defaultValue = "1") Integer page,
            @Parameter(description = "每页数量") @RequestParam(defaultValue = "10") Integer pageSize) {
        return Result.success(graduationProjectService.getList(keyword, sortBy, page, pageSize));
    }

    @Operation(summary = "获取热门毕业设计", description = "按浏览量排序的热门项目")
    @GetMapping("/hot")
    public Result<?> getHotList() {
        return Result.success(graduationProjectService.getHotList());
    }

    @Operation(summary = "获取最新毕业设计", description = "按创建时间排序的最新项目")
    @GetMapping("/latest")
    public Result<?> getLatestList() {
        return Result.success(graduationProjectService.getLatestList());
    }

    @Operation(summary = "获取毕业设计详情", description = "根据ID获取详细信息")
    @GetMapping("/{id}")
    public Result<?> getDetail(
            @Parameter(description = "毕业设计ID") @PathVariable Long id) {
        return Result.success(graduationProjectService.getDetail(id));
    }

    @Operation(summary = "新增毕业设计", description = "创建新的毕业设计项目")
    @PostMapping
    public Result<?> save(@RequestBody GraduationProject project) {
        graduationProjectService.save(project);
        return Result.success();
    }

    @Operation(summary = "删除毕业设计", description = "根据ID删除毕业设计项目")
    @DeleteMapping("/{id}")
    public Result<?> delete(
            @Parameter(description = "毕业设计ID") @PathVariable Long id) {
        graduationProjectService.delete(id);
        return Result.success();
    }
}
