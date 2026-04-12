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
# content 为 NULL 时小程序展示本地默认关于页；需要后台文案时改为 HTML
cursor.execute("""INSERT INTO `about_us` (`content`) VALUES (NULL)""")
_changelog_rows = [
    (
        '1.0.0',
        '首发上线',
        '## 若冰代码手册正式发布\n\n- 小程序基础框架与「首页 / 网页设计 / 毕业设计 / 我的」导航\n- **微信登录**与本地用户信息缓存\n- 关于我们、更新日志入口',
        'feature',
        '2025-08-01 10:00:00',
    ),
    (
        '1.1.0',
        '资源与反馈',
        '## 新增\n\n- 首页 Banner 与热门、最新内容聚合展示\n- 网页设计 / 毕业设计 **列表与详情**页\n- 「意见反馈」收集使用问题与建议',
        'feature',
        '2026-01-18 15:30:00',
    ),
    (
        '1.2.0',
        '主题与合规',
        '## 更新内容\n\n- **多主题色**：个人中心支持切换主题预览\n- **用户协议 / 隐私政策**：登录前勾选，协议内容可后台配置\n- **个人资料**：头像与昵称编辑、与后端同步\n- 关于我们页展示优化',
        'feature',
        '2026-04-12 12:00:00',
    ),
]
for row in _changelog_rows:
    cursor.execute(
        'INSERT INTO `changelog` (`version`, `title`, `content`, `type`, `create_time`) VALUES (%s,%s,%s,%s,%s)',
        row,
    )

conn.commit()
cursor.execute('SHOW TABLES')
tables = [t[0] for t in cursor.fetchall()]
print('Tables created:', tables)
conn.close()
