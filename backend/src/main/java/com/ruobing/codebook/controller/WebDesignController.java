package com.ruobing.codebook.controller;

import com.ruobing.codebook.common.Result;
import com.ruobing.codebook.entity.WebDesign;
import com.ruobing.codebook.service.WebDesignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/web-design")
public class WebDesignController {

    @Autowired
    private WebDesignService webDesignService;

    @GetMapping("/list")
    public Result<?> getList(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "create_time") String sortBy,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        return Result.success(webDesignService.getList(keyword, sortBy, page, pageSize));
    }

    @GetMapping("/hot")
    public Result<?> getHotList() {
        return Result.success(webDesignService.getHotList());
    }

    @GetMapping("/latest")
    public Result<?> getLatestList() {
        return Result.success(webDesignService.getLatestList());
    }

    @GetMapping("/{id}")
    public Result<?> getDetail(@PathVariable Long id) {
        return Result.success(webDesignService.getDetail(id));
    }

    @PostMapping
    public Result<?> save(@RequestBody WebDesign webDesign) {
        webDesignService.save(webDesign);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<?> delete(@PathVariable Long id) {
        webDesignService.delete(id);
        return Result.success();
    }
}
