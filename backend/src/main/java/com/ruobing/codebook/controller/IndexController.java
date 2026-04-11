package com.ruobing.codebook.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "系统状态", description = "系统状态检查接口")
@RestController
public class IndexController {

    @Operation(summary = "服务状态检查", description = "检查API服务是否正常运行")
    @RequestMapping("/")
    public String index() {
        return "若冰代码手册 API 服务正在运行";
    }
}
