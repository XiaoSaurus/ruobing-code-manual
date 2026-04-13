-- sys_user 绑定邮箱（找回密码用，可空）
USE ruobing_codebook;

ALTER TABLE `sys_user`
  ADD COLUMN `email` VARCHAR(100) NULL COMMENT '绑定邮箱' AFTER `nickname`;
