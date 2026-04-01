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
    `avatar` VARCHAR(255) DEFAULT NULL,
    `phone` VARCHAR(20) DEFAULT NULL,
    `email` VARCHAR(100) DEFAULT NULL,
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
-- 6. About Us Table
-- -----------------------------------------
CREATE TABLE IF NOT EXISTS `about_us` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `content` LONGTEXT,
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------
-- Initial Data
-- -----------------------------------------

INSERT INTO `about_us` (`content`) VALUES 
('<h2>RuoBing Codebook</h2><p>A professional code sharing platform for developers.</p><h3>Contact Us</h3><p>Email: contact@ruobingcode.com</p>');

INSERT INTO `changelog` (`version`, `title`, `content`, `type`) VALUES 
('1.0.0', 'Official Release', 'RuoBing Codebook officially launched', 'feature'),
('1.1.0', 'Added Search', 'Support keyword search for quick resource lookup', 'feature'),
('1.1.1', 'Bug Fix', 'Fixed known issues and improved loading speed', 'fix');
