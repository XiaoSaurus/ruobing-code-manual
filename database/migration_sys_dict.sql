-- 系统字典表：存放用户协议、隐私政策等可配置文本（亦可由 SysDictInitializer 自动创建）
USE ruobing_codebook;

CREATE TABLE IF NOT EXISTS `sys_dict` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `dict_key` VARCHAR(64) NOT NULL COMMENT '唯一键',
  `dict_value` LONGTEXT COMMENT '内容（可 HTML）',
  `remark` VARCHAR(200) DEFAULT NULL,
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_dict_key` (`dict_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 默认正文由后端 LegalDefaults 在首次启动时写入；也可手工 UPDATE dict_value 覆盖
