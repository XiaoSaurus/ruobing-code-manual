package com.ruobing.codebook.config;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.ruobing.codebook.content.LegalDefaults;
import com.ruobing.codebook.entity.SysDict;
import com.ruobing.codebook.repository.SysDictRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;

/**
 * 创建 sys_dict 表并写入协议/隐私默认内容（已存在则跳过插入）。
 */
@Component
@Order(100)
public class SysDictInitializer implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(SysDictInitializer.class);

    private final DataSource dataSource;
    private final SysDictRepository sysDictRepository;

    public SysDictInitializer(DataSource dataSource, SysDictRepository sysDictRepository) {
        this.dataSource = dataSource;
        this.sysDictRepository = sysDictRepository;
    }

    @Override
    public void run(ApplicationArguments args) {
        try {
            createTableIfNeeded();
            seedIfEmpty(LegalDefaults.KEY_USER_AGREEMENT, LegalDefaults.USER_AGREEMENT_HTML, "用户协议");
            seedIfEmpty(LegalDefaults.KEY_PRIVACY_POLICY, LegalDefaults.PRIVACY_POLICY_HTML, "隐私政策");
        } catch (Exception e) {
            log.warn("sys_dict 初始化失败，可手动执行 database/migration_sys_dict.sql: {}", e.getMessage());
        }
    }

    private void createTableIfNeeded() throws Exception {
        String ddl = """
                CREATE TABLE IF NOT EXISTS `sys_dict` (
                  `id` BIGINT NOT NULL AUTO_INCREMENT,
                  `dict_key` VARCHAR(64) NOT NULL COMMENT '唯一键',
                  `dict_value` LONGTEXT COMMENT '内容',
                  `remark` VARCHAR(200) DEFAULT NULL,
                  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                  PRIMARY KEY (`id`),
                  UNIQUE KEY `uk_dict_key` (`dict_key`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                """;
        try (Connection conn = dataSource.getConnection(); Statement st = conn.createStatement()) {
            st.execute(ddl);
        }
    }

    private void seedIfEmpty(String key, String value, String remark) {
        Long n = sysDictRepository.selectCount(Wrappers.<SysDict>lambdaQuery().eq(SysDict::getDictKey, key));
        if (n != null && n > 0) {
            return;
        }
        SysDict row = new SysDict();
        row.setDictKey(key);
        row.setDictValue(value);
        row.setRemark(remark);
        sysDictRepository.insert(row);
        log.info("已写入默认字典: {}", key);
    }
}
