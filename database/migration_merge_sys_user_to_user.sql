USE ruobing_codebook;

-- 单表收口：将历史 sys_user 数据并入 user，并保留 user 为唯一业务用户表

-- 1) 补齐 user 关键列（兼容低版本 MySQL，不使用 ADD COLUMN IF NOT EXISTS）
SET @has_username := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME='user' AND COLUMN_NAME='username'
);
SET @sql_username := IF(@has_username=0,
  'ALTER TABLE `user` ADD COLUMN `username` VARCHAR(64) DEFAULT NULL COMMENT ''后台登录用户名''',
  'SELECT 1'
);
PREPARE s_user FROM @sql_username; EXECUTE s_user; DEALLOCATE PREPARE s_user;

SET @has_password := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME='user' AND COLUMN_NAME='password'
);
SET @sql_password := IF(@has_password=0,
  'ALTER TABLE `user` ADD COLUMN `password` VARCHAR(128) DEFAULT NULL COMMENT ''后台登录密码''',
  'SELECT 1'
);
PREPARE s_pwd FROM @sql_password; EXECUTE s_pwd; DEALLOCATE PREPARE s_pwd;

SET @has_web_openid := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME='user' AND COLUMN_NAME='web_openid'
);
SET @sql_web_openid := IF(@has_web_openid=0,
  'ALTER TABLE `user` ADD COLUMN `web_openid` VARCHAR(64) DEFAULT NULL COMMENT ''微信网页授权openid''',
  'SELECT 1'
);
PREPARE s_web_openid FROM @sql_web_openid; EXECUTE s_web_openid; DEALLOCATE PREPARE s_web_openid;

SET @has_role := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME='user' AND COLUMN_NAME='role'
);
SET @sql_role := IF(@has_role=0,
  'ALTER TABLE `user` ADD COLUMN `role` VARCHAR(20) NOT NULL DEFAULT ''app_user'' COMMENT ''角色：admin/editor/app_user''',
  'SELECT 1'
);
PREPARE s_role FROM @sql_role; EXECUTE s_role; DEALLOCATE PREPARE s_role;

SET @has_status := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME='user' AND COLUMN_NAME='status'
);
SET @sql_status := IF(@has_status=0,
  'ALTER TABLE `user` ADD COLUMN `status` INT(1) NOT NULL DEFAULT 1 COMMENT ''状态：0禁用 1启用 2删除''',
  'SELECT 1'
);
PREPARE s_status FROM @sql_status; EXECUTE s_status; DEALLOCATE PREPARE s_status;

-- 2) 补齐关键唯一索引
SET @idx_username := (
  SELECT COUNT(*) FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME='user' AND INDEX_NAME='uk_user_username'
);
SET @sql_idx_username := IF(@idx_username=0,
  'ALTER TABLE `user` ADD UNIQUE INDEX `uk_user_username` (`username`)',
  'SELECT 1'
);
PREPARE s_idx_user FROM @sql_idx_username; EXECUTE s_idx_user; DEALLOCATE PREPARE s_idx_user;

SET @idx_web_openid := (
  SELECT COUNT(*) FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME='user' AND INDEX_NAME='uk_user_web_openid'
);
SET @sql_idx_web_openid := IF(@idx_web_openid=0,
  'ALTER TABLE `user` ADD UNIQUE INDEX `uk_user_web_openid` (`web_openid`)',
  'SELECT 1'
);
PREPARE s_idx_web_openid FROM @sql_idx_web_openid; EXECUTE s_idx_web_openid; DEALLOCATE PREPARE s_idx_web_openid;

-- 3) 插入：user 中不存在同用户名时，从 sys_user 新增
INSERT INTO `user` (`id`,`username`,`password`,`nickname`,`email`,`avatar`,`role`,`status`,`gender`,`openid`,`create_time`,`update_time`)
SELECT su.id, su.username, su.password, su.nickname, su.email, su.avatar,
       IFNULL(NULLIF(su.role,''), 'editor'), IFNULL(su.status,1), 0,
       CONCAT('sysu_', su.id), IFNULL(su.create_time, NOW()), IFNULL(su.update_time, NOW())
FROM `sys_user` su
LEFT JOIN `user` u ON u.username = su.username
WHERE u.id IS NULL;

-- 4) 更新：按用户名覆盖关键信息
UPDATE `user` u
JOIN `sys_user` su ON su.username = u.username
SET u.password = su.password,
    u.nickname = COALESCE(NULLIF(su.nickname,''), u.nickname),
    u.email = COALESCE(NULLIF(su.email,''), u.email),
    u.avatar = COALESCE(NULLIF(su.avatar,''), u.avatar),
    u.role = COALESCE(NULLIF(su.role,''), u.role),
    u.status = COALESCE(su.status, u.status),
    u.update_time = NOW();

-- 5) 清理历史 sys_user 数据（保留表结构，方便灰度回滚）
DELETE FROM `sys_user`;

-- 6) 输出校验信息
SELECT id,username,nickname,role,status FROM `user` ORDER BY id;
SELECT COUNT(*) AS sys_user_remaining FROM `sys_user`;