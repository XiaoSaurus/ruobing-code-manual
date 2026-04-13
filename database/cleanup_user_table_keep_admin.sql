-- ⚠️ 慎用：会删除 user 表中除 admin 之外的所有用户数据
-- 仅在你确认需要重置数据时执行

USE ruobing_codebook;

SET @has_role := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'user' AND COLUMN_NAME = 'role'
);
SET @sql_role := IF(@has_role = 0,
  'ALTER TABLE `user` ADD COLUMN `role` VARCHAR(20) NOT NULL DEFAULT ''app_user'' COMMENT ''角色: app_user/admin''',
  'SELECT 1'
);
PREPARE stmt_role FROM @sql_role;
EXECUTE stmt_role;
DEALLOCATE PREPARE stmt_role;

SET @has_status := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'user' AND COLUMN_NAME = 'status'
);
SET @sql_status := IF(@has_status = 0,
  'ALTER TABLE `user` ADD COLUMN `status` TINYINT NOT NULL DEFAULT 1 COMMENT ''状态: 1启用 0禁用''',
  'SELECT 1'
);
PREPARE stmt_status FROM @sql_status;
EXECUTE stmt_status;
DEALLOCATE PREPARE stmt_status;

-- 将指定账号提升为 admin（按实际条件修改）
-- 示例1：按手机号
-- UPDATE `user` SET `role`='admin' WHERE `phone`='13800138000';

-- 示例2：按昵称
-- UPDATE `user` SET `role`='admin' WHERE `nickname`='admin';

-- 删除非 admin 用户
DELETE FROM `user` WHERE `role` <> 'admin';

-- 可选：只保留一个 admin（按最小 id 保留）
DELETE u1 FROM `user` u1
JOIN `user` u2 ON u1.role='admin' AND u2.role='admin' AND u1.id > u2.id;
