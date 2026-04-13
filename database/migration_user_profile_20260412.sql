-- 已有库升级：为 user 表补充资料字段（与小程序个人资料、登录回源一致）
-- 在 MySQL 中执行；若某列已存在会报错，跳过该条即可。
--
-- 未配置微信 AppSecret 时，旧版曾用「debug_openid_ + 每次登录的 code」作为 openid，
-- 每次登录都是新用户。现后端改为固定 debug_openid_stable；旧数据若在别的 openid 行上，需重新保存资料。

USE ruobing_codebook;

ALTER TABLE `user` ADD COLUMN `gender` TINYINT NOT NULL DEFAULT 0 COMMENT '0未设置 1男 2女' AFTER `avatar`;
ALTER TABLE `user` MODIFY COLUMN `avatar` VARCHAR(500) DEFAULT NULL;
ALTER TABLE `user` ADD COLUMN `province` VARCHAR(64) DEFAULT NULL COMMENT '省' AFTER `email`;
ALTER TABLE `user` ADD COLUMN `city` VARCHAR(64) DEFAULT NULL COMMENT '市' AFTER `province`;
ALTER TABLE `user` ADD COLUMN `district` VARCHAR(64) DEFAULT NULL COMMENT '区/县' AFTER `city`;
