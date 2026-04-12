package com.ruobing.codebook.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * 用于确认当前运行的 jar 是否已包含最新修复（改代码后需重新编译并重启进程）。
 * 浏览器或 curl 访问：GET /api/meta/revision
 */
@RestController
@RequestMapping("/meta")
public class ApiMetaController {

    /** 修改用户资料相关逻辑时递增，便于与旧进程区分 */
    private static final String REVISION = "2026-04-13-user-profile-routing";

    @GetMapping("/revision")
    public Map<String, Object> revision() {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("revision", REVISION);
        m.put("ok", true);
        m.put("hint", "若 revision 与文档不一致，说明后端未用新 jar 启动，请重新编译并重启");
        m.put("userInfoGet", "GET /api/user/info?openid=...");
        m.put("userByIdGet", "GET /api/user/by-id/{id}");
        return m;
    }
}
