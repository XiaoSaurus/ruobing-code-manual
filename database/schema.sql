-- =========================================
-- Ruobing Codebook Database Script
-- =========================================

CREATE DATABASE IF NOT EXISTS ruobing_codebook DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE ruobing_codebook;

-- -----------------------------------------
-- 1. User Table
-- -----------------------------------------
CREATE TABLE IF NOT EXISTS `user` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `openid` VARCHAR(64) DEFAULT NULL,
    `nickname` VARCHAR(50) DEFAULT NULL,
    `avatar` VARCHAR(500) DEFAULT NULL,
    `gender` TINYINT NOT NULL DEFAULT 0 COMMENT '0未设置 1男 2女',
    `phone` VARCHAR(20) DEFAULT NULL,
    `email` VARCHAR(100) DEFAULT NULL,
    `province` VARCHAR(64) DEFAULT NULL COMMENT '省',
    `city` VARCHAR(64) DEFAULT NULL COMMENT '市',
    `district` VARCHAR(64) DEFAULT NULL COMMENT '区/县',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------
-- 2. Web Design Table
-- -----------------------------------------
CREATE TABLE IF NOT EXISTS `web_design` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `title` VARCHAR(200) NOT NULL,
    `description` TEXT,
    `content` LONGTEXT,
    `cover_image` VARCHAR(500),
    `tags` VARCHAR(500),
    `views` INT DEFAULT 0,
    `likes` INT DEFAULT 0,
    `sort_order` INT DEFAULT 0,
    `is_hot` TINYINT(1) DEFAULT 0,
    `is_latest` TINYINT(1) DEFAULT 0,
    `status` TINYINT(1) DEFAULT 1,
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------
-- 3. Graduation Project Table
-- -----------------------------------------
CREATE TABLE IF NOT EXISTS `graduation_project` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `title` VARCHAR(200) NOT NULL,
    `description` TEXT,
    `content` LONGTEXT,
    `cover_image` VARCHAR(500),
    `tags` VARCHAR(500),
    `views` INT DEFAULT 0,
    `likes` INT DEFAULT 0,
    `sort_order` INT DEFAULT 0,
    `is_hot` TINYINT(1) DEFAULT 0,
    `is_latest` TINYINT(1) DEFAULT 0,
    `status` TINYINT(1) DEFAULT 1,
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------
-- 4. Feedback Table
-- -----------------------------------------
CREATE TABLE IF NOT EXISTS `feedback` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `user_id` BIGINT DEFAULT NULL,
    `content` TEXT NOT NULL,
    `contact` VARCHAR(100),
    `images` VARCHAR(1000),
    `status` TINYINT(1) DEFAULT 0,
    `reply` TEXT,
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------
-- 5. Changelog Table
-- -----------------------------------------
CREATE TABLE IF NOT EXISTS `changelog` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `version` VARCHAR(20) NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `content` TEXT,
    `type` VARCHAR(20) DEFAULT 'update',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------
-- 6. System Dictionary (用户协议 / 隐私政策等)
-- -----------------------------------------
CREATE TABLE IF NOT EXISTS `sys_dict` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `dict_key` VARCHAR(64) NOT NULL COMMENT '唯一键',
    `dict_value` LONGTEXT COMMENT '内容（可 HTML）',
    `remark` VARCHAR(200) DEFAULT NULL,
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_dict_key` (`dict_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------
-- 7. About Us Table
-- -----------------------------------------
CREATE TABLE IF NOT EXISTS `about_us` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `content` LONGTEXT,
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------
-- Initial Data
-- -----------------------------------------

-- content 为空时小程序走本地默认「关于我们」模板；若需后台富文本可写入 HTML
INSERT INTO `about_us` (`content`) VALUES (NULL);

-- content 为 Markdown，小程序端 simpleMarkdown 解析后 rich-text 展示
INSERT INTO `changelog` (`version`, `title`, `content`, `type`, `create_time`) VALUES
('1.0.0', '首发上线', '## 若冰代码手册正式发布\n\n- 小程序基础框架与「首页 / 网页设计 / 毕业设计 / 我的」导航\n- **微信登录**与本地用户信息缓存\n- 关于我们、更新日志入口', 'feature', '2025-08-01 10:00:00'),
('1.1.0', '资源与反馈', '## 新增\n\n- 首页 Banner 与热门、最新内容聚合展示\n- 网页设计 / 毕业设计 **列表与详情**页\n- 「意见反馈」收集使用问题与建议', 'feature', '2026-01-18 15:30:00'),
('1.2.0', '主题与合规', '## 更新内容\n\n- **多主题色**：个人中心支持切换主题预览\n- **用户协议 / 隐私政策**：登录前勾选，协议内容可后台配置\n- **个人资料**：头像与昵称编辑、与后端同步\n- 关于我们页展示优化', 'feature', '2026-04-12 12:00:00');
