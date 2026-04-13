-- =========================================
-- Ruobing Codebook Database Baseline (v2)
-- 规范：
-- 1) 主键ID使用 BIGINT，应用侧使用雪花ID（MyBatis-Plus ASSIGN_ID）
-- 2) 状态/枚举字段优先使用 INT(1)
-- 3) varchar 长度按业务字段收敛并保留合理冗余
-- =========================================

CREATE DATABASE IF NOT EXISTS ruobing_codebook DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ruobing_codebook;

-- -----------------------------------------
-- 1. 统一用户表（小程序 + Web后台 + Web访客）
-- -----------------------------------------
CREATE TABLE IF NOT EXISTS `user` (
  `id` BIGINT NOT NULL COMMENT '主键ID（雪花ID）',
  `username` VARCHAR(64) DEFAULT NULL COMMENT '后台登录用户名',
  `password` VARCHAR(128) DEFAULT NULL COMMENT '后台登录密码',
  `openid` VARCHAR(64) DEFAULT NULL COMMENT '小程序openid',
  `web_openid` VARCHAR(64) DEFAULT NULL COMMENT '微信网页授权openid',
  `nickname` VARCHAR(64) DEFAULT NULL COMMENT '昵称',
  `avatar` VARCHAR(255) DEFAULT NULL COMMENT '头像URL',
  `gender` INT(1) DEFAULT 0 COMMENT '性别：0未知 1男 2女',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT '手机号',
  `email` VARCHAR(64) DEFAULT NULL COMMENT '邮箱',
  `role` VARCHAR(20) NOT NULL DEFAULT 'app_user' COMMENT '角色：admin/editor/app_user',
  `status` INT(1) NOT NULL DEFAULT 1 COMMENT '状态：0禁用 1启用 2删除',
  `province` VARCHAR(64) DEFAULT NULL COMMENT '省',
  `city` VARCHAR(64) DEFAULT NULL COMMENT '市',
  `district` VARCHAR(64) DEFAULT NULL COMMENT '区/县',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_username` (`username`),
  UNIQUE KEY `uk_user_web_openid` (`web_openid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='统一用户表（小程序 + Web后台 + Web访客）';

-- -----------------------------------------
-- 2. 网页设计内容表
-- -----------------------------------------
CREATE TABLE IF NOT EXISTS `web_design` (
  `id` BIGINT NOT NULL COMMENT '主键ID（雪花ID）',
  `title` VARCHAR(200) NOT NULL COMMENT '标题',
  `description` TEXT COMMENT '摘要描述',
  `content` LONGTEXT COMMENT '正文内容',
  `cover_image` VARCHAR(500) DEFAULT NULL COMMENT '封面图URL',
  `tags` VARCHAR(500) DEFAULT NULL COMMENT '标签（逗号分隔）',
  `views` INT DEFAULT 0 COMMENT '浏览次数',
  `likes` INT DEFAULT 0 COMMENT '点赞数',
  `favorites` INT DEFAULT 0 COMMENT '收藏数',
  `sort_order` INT DEFAULT 0 COMMENT '排序值',
  `is_hot` INT(1) DEFAULT 0 COMMENT '是否热门：0否 1是',
  `is_latest` INT(1) DEFAULT 0 COMMENT '是否最新：0否 1是',
  `status` INT(1) DEFAULT 1 COMMENT '状态：0禁用 1启用 2删除',
  `article_url` VARCHAR(500) DEFAULT NULL COMMENT '原文链接',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='网页设计内容表';

-- -----------------------------------------
-- 3. 毕业设计内容表
-- -----------------------------------------
CREATE TABLE IF NOT EXISTS `graduation_project` (
  `id` BIGINT NOT NULL COMMENT '主键ID（雪花ID）',
  `title` VARCHAR(200) NOT NULL COMMENT '标题',
  `description` TEXT COMMENT '摘要描述',
  `content` LONGTEXT COMMENT '正文内容',
  `cover_image` VARCHAR(500) DEFAULT NULL COMMENT '封面图URL',
  `tags` VARCHAR(500) DEFAULT NULL COMMENT '标签（逗号分隔）',
  `views` INT DEFAULT 0 COMMENT '浏览次数',
  `likes` INT DEFAULT 0 COMMENT '点赞数',
  `favorites` INT DEFAULT 0 COMMENT '收藏数',
  `sort_order` INT DEFAULT 0 COMMENT '排序值',
  `is_hot` INT(1) DEFAULT 0 COMMENT '是否热门：0否 1是',
  `is_latest` INT(1) DEFAULT 0 COMMENT '是否最新：0否 1是',
  `status` INT(1) DEFAULT 1 COMMENT '状态：0禁用 1启用 2删除',
  `article_url` VARCHAR(500) DEFAULT NULL COMMENT '原文链接',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='毕业设计内容表';

-- -----------------------------------------
-- 4. 用户反馈表
-- -----------------------------------------
CREATE TABLE IF NOT EXISTS `feedback` (
  `id` BIGINT NOT NULL COMMENT '主键ID（雪花ID）',
  `user_id` BIGINT DEFAULT NULL COMMENT '关联用户ID',
  `content` TEXT NOT NULL COMMENT '反馈内容',
  `contact` VARCHAR(64) DEFAULT NULL COMMENT '联系方式',
  `images` VARCHAR(1000) DEFAULT NULL COMMENT '图片URL列表（逗号分隔）',
  `status` INT(1) DEFAULT 0 COMMENT '状态：0待处理 1已处理 2关闭',
  `reply` TEXT DEFAULT NULL COMMENT '管理员回复',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_feedback_user_id` (`user_id`),
  CONSTRAINT `fk_feedback_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户反馈表';

-- -----------------------------------------
-- 5. 更新日志表
-- -----------------------------------------
CREATE TABLE IF NOT EXISTS `changelog` (
  `id` BIGINT NOT NULL COMMENT '主键ID（雪花ID）',
  `version` VARCHAR(32) NOT NULL COMMENT '版本号',
  `title` VARCHAR(200) NOT NULL COMMENT '更新标题',
  `content` TEXT DEFAULT NULL COMMENT '更新内容',
  `type` VARCHAR(32) DEFAULT NULL COMMENT '更新类型',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='更新日志表';

-- -----------------------------------------
-- 6. 系统字典表
-- -----------------------------------------
CREATE TABLE IF NOT EXISTS `sys_dict` (
  `id` BIGINT NOT NULL COMMENT '主键ID（雪花ID）',
  `dict_key` VARCHAR(64) NOT NULL COMMENT '字典键',
  `dict_value` LONGTEXT COMMENT '字典值',
  `remark` VARCHAR(200) DEFAULT NULL COMMENT '备注',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_dict_key` (`dict_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统字典表';

-- -----------------------------------------
-- 7. 关于我们内容表
-- -----------------------------------------
CREATE TABLE IF NOT EXISTS `about_us` (
  `id` BIGINT NOT NULL COMMENT '主键ID（雪花ID）',
  `content` LONGTEXT COMMENT '关于我们页面内容（HTML）',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='关于我们内容表';

-- -----------------------------------------
-- 8. 首页轮播图表
-- -----------------------------------------
CREATE TABLE IF NOT EXISTS `banner` (
  `id` BIGINT NOT NULL COMMENT '主键ID（雪花ID）',
  `title` VARCHAR(200) NOT NULL COMMENT '轮播标题',
  `subtitle` VARCHAR(500) DEFAULT NULL COMMENT '轮播副标题',
  `image_url` VARCHAR(500) NOT NULL COMMENT '图片地址',
  `link_type` INT(1) DEFAULT 1 COMMENT '跳转类型：1站内 2外链',
  `link_id` BIGINT DEFAULT NULL COMMENT '站内关联ID',
  `link_url` VARCHAR(500) DEFAULT NULL COMMENT '外链URL',
  `sort_order` INT DEFAULT 0 COMMENT '排序值，越小越靠前',
  `status` INT(1) DEFAULT 1 COMMENT '状态：0禁用 1启用 2删除',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='首页轮播图表';

-- -----------------------------------------
-- 9. RBAC
-- -----------------------------------------
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

-- -----------------------------------------
-- 10. 历史兼容表（已废弃）
-- -----------------------------------------
CREATE TABLE IF NOT EXISTS `sys_user` (
  `id` BIGINT NOT NULL COMMENT '主键ID（历史）',
  `username` VARCHAR(50) NOT NULL COMMENT '登录用户名（历史）',
  `password` VARCHAR(100) NOT NULL COMMENT '登录密码（历史）',
  `nickname` VARCHAR(50) DEFAULT NULL COMMENT '昵称（历史）',
  `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱（历史）',
  `avatar` VARCHAR(500) DEFAULT NULL COMMENT '头像URL（历史）',
  `role` VARCHAR(20) DEFAULT NULL COMMENT '角色（历史）',
  `status` TINYINT DEFAULT NULL COMMENT '状态（历史）',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间（历史）',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间（历史）',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_sys_user_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='历史兼容表（已废弃，不再作为业务数据源）';

-- -----------------------------------------
-- Initial Seed (可按需执行)
-- -----------------------------------------
INSERT INTO `about_us` (`id`, `content`) VALUES
(1, NULL)
ON DUPLICATE KEY UPDATE `content`=VALUES(`content`);

INSERT INTO `changelog` (`id`, `version`, `title`, `content`, `type`, `create_time`) VALUES
(202604120001, '1.0.0', '首发上线', '## 若冰代码手册正式发布\n\n- 小程序基础框架与「首页 / 网页设计 / 毕业设计 / 我的」导航\n- **微信登录**与本地用户信息缓存\n- 关于我们、更新日志入口', 'feature', '2025-08-01 10:00:00'),
(202604120002, '1.1.0', '资源与反馈', '## 新增\n\n- 首页 Banner 与热门、最新内容聚合展示\n- 网页设计 / 毕业设计 **列表与详情**页\n- 「意见反馈」收集使用问题与建议', 'feature', '2026-01-18 15:30:00'),
(202604120003, '1.2.0', '主题与合规', '## 更新内容\n\n- **多主题色**：个人中心支持切换主题预览\n- **用户协议 / 隐私政策**：登录前勾选，协议内容可后台配置\n- **个人资料**：头像与昵称编辑、与后端同步\n- 关于我们页展示优化', 'feature', '2026-04-12 12:00:00')
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`), `content`=VALUES(`content`), `type`=VALUES(`type`), `create_time`=VALUES(`create_time`);