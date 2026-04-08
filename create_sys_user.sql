USE ruobing_codebook;

CREATE TABLE IF NOT EXISTS sys_user (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
  password VARCHAR(100) NOT NULL COMMENT '密码',
  nickname VARCHAR(50) COMMENT '昵称',
  avatar VARCHAR(500) DEFAULT '' COMMENT '头像URL',
  role VARCHAR(20) DEFAULT 'admin' COMMENT '角色 admin/editor',
  status TINYINT DEFAULT 1 COMMENT '状态 1启用 0禁用',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO sys_user (username, password, nickname, role, status) VALUES
  ('admin', 'admin123', '管理员', 'admin', 1);

-- 插入测试用户数据
INSERT INTO sys_user (username, password, nickname, avatar, role, status) VALUES
  ('editor01', 'pass123', '内容编辑小王', 'https://api.dicebear.com/7.x/avataaars/svg?seed=wang', 'editor', 1),
  ('editor02', 'pass456', '内容编辑小李', 'https://api.dicebear.com/7.x/avataaars/svg?seed=li', 'editor', 1),
  ('test01', 'test999', '测试账号', 'https://api.dicebear.com/7.x/avataaars/svg?seed=test', 'editor', 0);

