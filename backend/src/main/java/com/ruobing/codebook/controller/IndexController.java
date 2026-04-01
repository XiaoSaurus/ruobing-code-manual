package com.ruobing.codebook.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class IndexController {
    @RequestMapping("/")
    public String index() {
        return "若冰代码手册 API 服务正在运行";
    }
}
