package com.ruobing.codebook.controller;

import com.ruobing.codebook.common.Result;
import com.ruobing.codebook.entity.AboutUs;
import com.ruobing.codebook.service.AboutUsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/about")
public class AboutUsController {

    @Autowired
    private AboutUsService aboutUsService;

    @GetMapping
    public Result<?> get() {
        return Result.success(aboutUsService.get());
    }

    @PutMapping
    public Result<?> update(@RequestBody AboutUs aboutUs) {
        aboutUsService.update(aboutUs);
        return Result.success();
    }
}
