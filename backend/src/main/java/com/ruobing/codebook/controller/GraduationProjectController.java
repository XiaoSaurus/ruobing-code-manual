package com.ruobing.codebook.controller;

import com.ruobing.codebook.common.Result;
import com.ruobing.codebook.entity.GraduationProject;
import com.ruobing.codebook.service.GraduationProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/graduation")
public class GraduationProjectController {

    @Autowired
    private GraduationProjectService graduationProjectService;

    @GetMapping("/list")
    public Result<?> getList(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "create_time") String sortBy,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        return Result.success(graduationProjectService.getList(keyword, sortBy, page, pageSize));
    }

    @GetMapping("/hot")
    public Result<?> getHotList() {
        return Result.success(graduationProjectService.getHotList());
    }

    @GetMapping("/latest")
    public Result<?> getLatestList() {
        return Result.success(graduationProjectService.getLatestList());
    }

    @GetMapping("/{id}")
    public Result<?> getDetail(@PathVariable Long id) {
        return Result.success(graduationProjectService.getDetail(id));
    }

    @PostMapping
    public Result<?> save(@RequestBody GraduationProject project) {
        graduationProjectService.save(project);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<?> delete(@PathVariable Long id) {
        graduationProjectService.delete(id);
        return Result.success();
    }
}
