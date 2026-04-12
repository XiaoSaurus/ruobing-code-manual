package com.ruobing.codebook.controller;

import com.ruobing.codebook.common.Result;
import com.ruobing.codebook.content.LegalDefaults;
import com.ruobing.codebook.service.SysDictService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@Tag(name = "系统字典", description = "字典文本（公开项）")
@RestController
@RequestMapping("/dict")
public class SysDictController {

    private static final Set<String> PUBLIC_KEYS = Set.of(
            LegalDefaults.KEY_USER_AGREEMENT,
            LegalDefaults.KEY_PRIVACY_POLICY
    );

    private final SysDictService sysDictService;

    public SysDictController(SysDictService sysDictService) {
        this.sysDictService = sysDictService;
    }

    @Operation(summary = "按 key 获取字典文本（HTML）")
    @GetMapping("/{key}")
    public Result<String> getByKey(@PathVariable("key") String key) {
        if (key == null || key.isBlank() || !PUBLIC_KEYS.contains(key)) {
            return Result.error("无效或未公开的字典项");
        }
        return Result.success(sysDictService.getTextByKey(key));
    }
}
