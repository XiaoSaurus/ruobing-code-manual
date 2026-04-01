-- =========================================
-- 若冰代码手册 数据库脚本
-- =========================================

CREATE DATABASE IF NOT EXISTS ruobing_codebook DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE ruobing_codebook;

-- -----------------------------------------
-- 1. 用户表
-- -----------------------------------------
CREATE TABLE `user` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
    `openid` VARCHAR(64) DEFAULT NULL COMMENT '微信openid',
    `nickname` VARCHAR(50) DEFAULT NULL COMMENT '昵称',
    `avatar` VARCHAR(255) DEFAULT NULL COMMENT '头像URL',
    `phone` VARCHAR(20) DEFAULT NULL COMMENT '手机号',
    `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- -----------------------------------------
-- 2. 网页设计表
-- -----------------------------------------
CREATE TABLE `web_design` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `title` VARCHAR(200) NOT NULL COMMENT '标题',
    `description` TEXT COMMENT '简介描述',
    `content` LONGTEXT COMMENT '详细内容/代码',
    `cover_image` VARCHAR(500) COMMENT '封面图片',
    `tags` VARCHAR(500) COMMENT '标签，逗号分隔',
    `views` INT DEFAULT 0 COMMENT '浏览量',
    `likes` INT DEFAULT 0 COMMENT '点赞数',
    `sort_order` INT DEFAULT 0 COMMENT '排序',
    `is_hot` TINYINT(1) DEFAULT 0 COMMENT '是否热门推荐',
    `is_latest` TINYINT(1) DEFAULT 0 COMMENT '是否最新',
    `status` TINYINT(1) DEFAULT 1 COMMENT '状态：0下架 1上架',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='网页设计表';

-- -----------------------------------------
-- 3. 毕业设计表
-- -----------------------------------------
CREATE TABLE `graduation_project` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `title` VARCHAR(200) NOT NULL COMMENT '标题',
    `description` TEXT COMMENT '简介描述',
    `content` LONGTEXT COMMENT '详细内容/代码',
    `cover_image` VARCHAR(500) COMMENT '封面图片',
    `tags` VARCHAR(500) COMMENT '标签，逗号分隔',
    `views` INT DEFAULT 0 COMMENT '浏览量',
    `likes` INT DEFAULT 0 COMMENT '点赞数',
    `sort_order` INT DEFAULT 0 COMMENT '排序',
    `is_hot` TINYINT(1) DEFAULT 0 COMMENT '是否热门推荐',
    `is_latest` TINYINT(1) DEFAULT 0 COMMENT '是否最新',
    `status` TINYINT(1) DEFAULT 1 COMMENT '状态：0下架 1上架',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='毕业设计表';

-- -----------------------------------------
-- 4. 反馈表
-- -----------------------------------------
CREATE TABLE `feedback` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `user_id` BIGINT DEFAULT NULL COMMENT '用户ID',
    `content` TEXT NOT NULL COMMENT '反馈内容',
    `contact` VARCHAR(100) COMMENT '联系方式',
    `images` VARCHAR(1000) COMMENT '截图图片',
    `status` TINYINT(1) DEFAULT 0 COMMENT '状态：0待处理 1已处理',
    `reply` TEXT COMMENT '回复内容',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='反馈表';

-- -----------------------------------------
-- 5. 更新日志表
-- -----------------------------------------
CREATE TABLE `changelog` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `version` VARCHAR(20) NOT NULL COMMENT '版本号',
    `title` VARCHAR(200) NOT NULL COMMENT '更新标题',
    `content` TEXT COMMENT '更新内容',
    `type` VARCHAR(20) DEFAULT 'update' COMMENT '类型：feature新功能 fix修复优化',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='更新日志表';

-- -----------------------------------------
-- 6. 关于我们表
-- -----------------------------------------
CREATE TABLE `about_us` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `content` LONGTEXT COMMENT '关于我们内容',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='关于我们表';

-- -----------------------------------------
-- 初始数据
-- -----------------------------------------

-- 插入默认关于我们
INSERT INTO `about_us` (`content`) VALUES 
('<h2>关于若冰代码手册</h2><p>若冰代码手册是一个专业的代码分享平台，致力于为开发者提供优质的网页设计和毕业设计资源。</p><h3>联系我们</h3><p>邮箱：contact@ruobingcode.com</p>');

-- 插入更新日志
INSERT INTO `changelog` (`version`, `title`, `content`, `type`) VALUES 
('1.0.0', '正式上线', '若冰代码手册正式发布，提供网页设计和毕业设计资源', 'feature'),
('1.1.0', '新增搜索功能', '支持关键词搜索，快速找到需要的代码资源', 'feature'),
('1.1.1', '优化体验', '修复已知问题，提升加载速度', 'fix');
