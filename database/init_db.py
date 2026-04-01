import pymysql

conn = pymysql.connect(host='localhost', user='root', password='123456', charset='utf8mb4')
cursor = conn.cursor()
cursor.execute('CREATE DATABASE IF NOT EXISTS ruobing_codebook DEFAULT CHARACTER SET utf8mb4')
cursor.execute('USE ruobing_codebook')

# Create tables
sqls = [
    """CREATE TABLE IF NOT EXISTS `user` (`id` BIGINT PRIMARY KEY AUTO_INCREMENT, `openid` VARCHAR(64), `nickname` VARCHAR(50), `avatar` VARCHAR(255), `phone` VARCHAR(20), `email` VARCHAR(100), `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP, `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4""",
    """CREATE TABLE IF NOT EXISTS `web_design` (`id` BIGINT PRIMARY KEY AUTO_INCREMENT, `title` VARCHAR(200) NOT NULL, `description` TEXT, `content` LONGTEXT, `cover_image` VARCHAR(500), `tags` VARCHAR(500), `views` INT DEFAULT 0, `likes` INT DEFAULT 0, `sort_order` INT DEFAULT 0, `is_hot` TINYINT(1) DEFAULT 0, `is_latest` TINYINT(1) DEFAULT 0, `status` TINYINT(1) DEFAULT 1, `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP, `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4""",
    """CREATE TABLE IF NOT EXISTS `graduation_project` (`id` BIGINT PRIMARY KEY AUTO_INCREMENT, `title` VARCHAR(200) NOT NULL, `description` TEXT, `content` LONGTEXT, `cover_image` VARCHAR(500), `tags` VARCHAR(500), `views` INT DEFAULT 0, `likes` INT DEFAULT 0, `sort_order` INT DEFAULT 0, `is_hot` TINYINT(1) DEFAULT 0, `is_latest` TINYINT(1) DEFAULT 0, `status` TINYINT(1) DEFAULT 1, `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP, `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4""",
    """CREATE TABLE IF NOT EXISTS `feedback` (`id` BIGINT PRIMARY KEY AUTO_INCREMENT, `user_id` BIGINT, `content` TEXT NOT NULL, `contact` VARCHAR(100), `images` VARCHAR(1000), `status` TINYINT(1) DEFAULT 0, `reply` TEXT, `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP, `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4""",
    """CREATE TABLE IF NOT EXISTS `changelog` (`id` BIGINT PRIMARY KEY AUTO_INCREMENT, `version` VARCHAR(20) NOT NULL, `title` VARCHAR(200) NOT NULL, `content` TEXT, `type` VARCHAR(20) DEFAULT 'update', `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4""",
    """CREATE TABLE IF NOT EXISTS `about_us` (`id` BIGINT PRIMARY KEY AUTO_INCREMENT, `content` LONGTEXT, `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"""
]

for sql in sqls:
    cursor.execute(sql)

# Insert initial data
cursor.execute("""INSERT INTO `about_us` (`content`) VALUES ('<h2>RuoBing Codebook</h2><p>A professional code sharing platform.</p><h3>Contact</h3><p>Email: contact@ruobingcode.com</p>')""")
cursor.execute("""INSERT INTO `changelog` (`version`, `title`, `content`, `type`) VALUES ('1.0.0', 'Official Release', 'RuoBing Codebook officially launched', 'feature')""")

conn.commit()
cursor.execute('SHOW TABLES')
tables = [t[0] for t in cursor.fetchall()]
print('Tables created:', tables)
conn.close()
