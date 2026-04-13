-- 修复：Unknown column 'province' in 'field list'
-- 在 MySQL 中执行（库名按你环境修改）。若某列已存在会报 Duplicate column，跳过该句即可。

USE ruobing_codebook;

ALTER TABLE `user` ADD COLUMN `province` VARCHAR(64) DEFAULT NULL COMMENT '省';
ALTER TABLE `user` ADD COLUMN `city` VARCHAR(64) DEFAULT NULL COMMENT '市';
ALTER TABLE `user` ADD COLUMN `district` VARCHAR(64) DEFAULT NULL COMMENT '区/县';
