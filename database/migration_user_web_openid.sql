-- Web 端微信开放平台「网站应用」扫码登录：按 web_openid 识别用户
-- 启动时 UserTableSchemaPatcher 也会自动补齐列与唯一索引

USE ruobing_codebook;

-- ALTER TABLE `user` ADD COLUMN `web_openid` VARCHAR(64) DEFAULT NULL COMMENT '微信网站应用openid' AFTER `openid`;
-- CREATE UNIQUE INDEX `uk_user_web_openid` ON `user` (`web_openid`);
