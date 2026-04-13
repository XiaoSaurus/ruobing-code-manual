-- 数据库字段规范（v2）
-- 1) ID: bigint + 雪花算法（应用层 ASSIGN_ID）；数据库保留 bigint 主键
-- 2) 状态/枚举: int(1)
-- 3) varchar 长度按业务收敛（邮箱 64 等）

USE ruobing_codebook;

-- ===== 状态/枚举字段统一 int(1) =====
ALTER TABLE `user`
  MODIFY COLUMN `status` INT(1) NOT NULL DEFAULT 1 COMMENT '状态:0禁用 1启用 2删除',
  MODIFY COLUMN `gender` INT(1) DEFAULT 0 COMMENT '0未设置 1男 2女';

ALTER TABLE `sys_role`
  MODIFY COLUMN `status` INT(1) NOT NULL DEFAULT 1 COMMENT '状态:0禁用 1启用 2删除';

ALTER TABLE `sys_menu`
  MODIFY COLUMN `status` INT(1) NOT NULL DEFAULT 1 COMMENT '状态:0禁用 1启用 2删除';

ALTER TABLE `banner`
  MODIFY COLUMN `status` INT(1) DEFAULT 1 COMMENT '状态:0禁用 1启用 2删除',
  MODIFY COLUMN `link_type` INT(1) DEFAULT 1 COMMENT '链接类型';

ALTER TABLE `feedback`
  MODIFY COLUMN `status` INT(1) DEFAULT 0 COMMENT '状态:0待处理 1已处理 2关闭';

ALTER TABLE `web_design`
  MODIFY COLUMN `status` INT(1) DEFAULT 1,
  MODIFY COLUMN `is_hot` INT(1) DEFAULT 0,
  MODIFY COLUMN `is_latest` INT(1) DEFAULT 0;

ALTER TABLE `graduation_project`
  MODIFY COLUMN `status` INT(1) DEFAULT 1,
  MODIFY COLUMN `is_hot` INT(1) DEFAULT 0,
  MODIFY COLUMN `is_latest` INT(1) DEFAULT 0;

-- ===== varchar 长度优化（按常见业务长度放宽但不夸张） =====
ALTER TABLE `user`
  MODIFY COLUMN `email` VARCHAR(64) DEFAULT NULL,
  MODIFY COLUMN `username` VARCHAR(64) DEFAULT NULL,
  MODIFY COLUMN `phone` VARCHAR(20) DEFAULT NULL,
  MODIFY COLUMN `nickname` VARCHAR(64) DEFAULT NULL,
  MODIFY COLUMN `password` VARCHAR(128) DEFAULT NULL;

ALTER TABLE `sys_role`
  MODIFY COLUMN `role_code` VARCHAR(32) NOT NULL,
  MODIFY COLUMN `role_name` VARCHAR(64) NOT NULL;

ALTER TABLE `sys_menu`
  MODIFY COLUMN `path` VARCHAR(128) NOT NULL,
  MODIFY COLUMN `title` VARCHAR(64) NOT NULL,
  MODIFY COLUMN `icon` VARCHAR(64) DEFAULT NULL;

ALTER TABLE `feedback`
  MODIFY COLUMN `contact` VARCHAR(64) DEFAULT NULL;

ALTER TABLE `changelog`
  MODIFY COLUMN `version` VARCHAR(32) NOT NULL,
  MODIFY COLUMN `type` VARCHAR(32) DEFAULT NULL;

-- 说明：BIGINT 在 MySQL 无“20位存储长度”语义，实际按 8 字节存储。
-- 雪花 ID 的“位数”由应用生成（已在 MyBatis-Plus 使用 ASSIGN_ID）。
