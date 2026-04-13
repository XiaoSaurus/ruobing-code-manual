-- 二期权限模块：角色/菜单/角色菜单
-- 说明：该脚本用于手动迁移；应用启动时 RbacSchemaPatcher 也会做兜底创建
USE ruobing_codebook;

CREATE TABLE IF NOT EXISTS `sys_role` (
  `id` BIGINT NOT NULL COMMENT '主键ID（雪花ID）',
  `role_code` VARCHAR(32) NOT NULL COMMENT '角色编码',
  `role_name` VARCHAR(64) NOT NULL COMMENT '角色名称',
  `status` INT(1) NOT NULL DEFAULT 1 COMMENT '状态：0禁用 1启用 2删除',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_sys_role_code` (`role_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色表';

CREATE TABLE IF NOT EXISTS `sys_menu` (
  `id` BIGINT NOT NULL COMMENT '主键ID（雪花ID）',
  `path` VARCHAR(128) NOT NULL COMMENT '前端路由路径',
  `title` VARCHAR(64) NOT NULL COMMENT '菜单名称',
  `icon` VARCHAR(64) DEFAULT NULL COMMENT '图标名称',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序值',
  `status` INT(1) NOT NULL DEFAULT 1 COMMENT '状态：0禁用 1启用 2删除',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_sys_menu_path` (`path`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='权限菜单表';

CREATE TABLE IF NOT EXISTS `sys_role_menu` (
  `id` BIGINT NOT NULL COMMENT '主键ID（雪花ID）',
  `role_code` VARCHAR(32) NOT NULL COMMENT '角色编码',
  `menu_id` BIGINT NOT NULL COMMENT '菜单ID',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_sys_role_menu` (`role_code`,`menu_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色菜单关联表';