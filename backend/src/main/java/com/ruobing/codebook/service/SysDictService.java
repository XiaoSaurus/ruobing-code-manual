package com.ruobing.codebook.service;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.ruobing.codebook.content.LegalDefaults;
import com.ruobing.codebook.entity.SysDict;
import com.ruobing.codebook.repository.SysDictRepository;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class SysDictService {

    private final SysDictRepository sysDictRepository;

    public SysDictService(SysDictRepository sysDictRepository) {
        this.sysDictRepository = sysDictRepository;
    }

    /** 按 key 取字典文本；库中无则回退到 LegalDefaults */
    public String getTextByKey(String key) {
        SysDict row = sysDictRepository.selectOne(
                Wrappers.<SysDict>lambdaQuery().eq(SysDict::getDictKey, key).last("LIMIT 1"));
        if (row != null && StringUtils.hasText(row.getDictValue())) {
            return row.getDictValue();
        }
        return LegalDefaults.fallback(key);
    }
}
