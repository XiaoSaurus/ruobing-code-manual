# 若冰代码手册 - 项目汇总文档

> 项目全称：RuoBing Codebook
> 文档更新：2026-04-09
> 作者：XiaoSaurus
> GitHub：https://github.com/XiaoSaurus/ruobing-code-manual

---

## 📌 项目概述

若冰代码手册是一个**技术资源分享与管理平台**，旨在为开发者提供网页设计作品与毕业设计项目的展示与学习交流空间。项目采用 **B/S + 小程序** 双端架构：Web 管理后台用于内容管理，微信小程序面向普通用户浏览。

---

## 🏗 技术架构

```
┌─────────────────────────────────────────────────────┐
│                    用户层                            │
│  ┌──────────────┐          ┌───────────────────┐   │
│  │  微信小程序   │          │  Web 管理后台      │   │
│  │  (客户端)     │          │  (运营管理)        │   │
│  └──────┬───────┘          └────────┬──────────┘   │
└─────────┼───────────────────────────┼──────────────┘
          │                           │
          ▼                           ▼
┌─────────────────────────────────────────────────────┐
│                   API 层 (REST)                     │
│                   后端 SpringBoot                    │
│              http://localhost:8080                   │
└─────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────┐
│                  数据层 MySQL 8.0                   │
│              数据库名：ruobing_codebook              │
└─────────────────────────────────────────────────────┘
```

### 技术栈详情

| 层级 | 技术选型 | 版本 |
|------|---------|------|
| Web 前端框架 | Vue 3 | 3.3.4 |
| 前端构建工具 | Vite | 4.4.9 |
| UI 组件库 | Element Plus | 2.3.14 |
| 图表库 | ECharts | 6.0.0 |
| HTTP 客户端 | Axios | 1.5.0 |
| 路由管理 | Vue Router | 4.2.4 |
| 后端框架 | Spring Boot | 2.7.18 |
| Java 版本 | JDK | 17 |
| ORM 框架 | MyBatis-Plus | 3.5.3.1 |
| 数据库 | MySQL | 8.0 |
| 小程序 | 原生微信小程序 | - |

---

## 📂 项目结构

```
ruobing-code-manual/
│
├── backend/                          # SpringBoot 后端服务
│   ├── src/main/java/com/ruobing/codebook/
│   │   ├── CodebookApplication.java  # 启动类
│   │   ├── common/                   # 通用响应类
│   │   │   ├── PageResult.java       # 分页结果封装
│   │   │   └── Result.java           # 统一返回结果
│   │   ├── config/                   # 配置类
│   │   │   ├── CorsConfig.java       # CORS 跨域配置
│   │   │   └── MybatisPlusConfig.java # MyBatis-Plus 分页插件
│   │   ├── controller/              # 控制器层（7个）
│   │   │   ├── SysUserController.java  # 👤 用户管理
│   │   │   ├── WebDesignController.java # 网页设计
│   │   │   ├── GraduationProjectController.java # 毕业设计
│   │   │   ├── FeedbackController.java  # 用户反馈
│   │   │   ├── ChangelogController.java # 更新日志
│   │   │   ├── AboutUsController.java   # 关于我们
│   │   │   └── IndexController.java    # 索引/统计
│   │   ├── entity/                   # 实体类（7个）
│   │   ├── repository/               # 数据访问层（7个）
│   │   └── service/                  # 业务逻辑层（7个）
│   ├── src/main/resources/
│   │   └── application.yml           # 应用配置
│   └── pom.xml                       # Maven 依赖配置
│
├── web/                              # Vue 3 管理后台
│   ├── src/
│   │   ├── api/
│   │   │   └── index.js             # API 接口统一导出
│   │   ├── router/
│   │   │   └── index.js             # 路由配置（9个页面）
│   │   ├── utils/
│   │   │   └── request.js           # Axios 封装（请求拦截/响应处理）
│   │   ├── views/
│   │   │   ├── Home.vue             # 📊 首页数据看板（ECharts 可视化）
│   │   │   ├── SysUser.vue          # 👤 用户管理（CRUD + 分页）
│   │   │   ├── WebDesign.vue        # 🖥 网页设计列表
│   │   │   ├── WebDesignEdit.vue    # 📝 网页设计编辑
│   │   │   ├── Graduation.vue       # 🎓 毕业设计列表
│   │   │   ├── GraduationEdit.vue   # 📝 毕业设计编辑
│   │   │   ├── Feedback.vue         # 💬 用户反馈管理
│   │   │   ├── Changelog.vue        # 📋 更新日志管理
│   │   │   ├── About.vue            # ℹ️ 关于我们管理
│   │   │   ├── Login.vue            # 🔐 登录页
│   │   │   └── Layout.vue           # 🏠 管理后台框架（侧边栏 + 头部）
│   │   ├── App.vue                  # 根组件
│   │   └── main.js                 # 入口文件
│   ├── index.html
│   ├── vite.config.js               # Vite 配置
│   └── package.json
│
├── mini-program/                    # 微信小程序
│   ├── app.js                       # 全局应用配置
│   ├── app.json                    # 页面路由 + TabBar 配置
│   ├── app.wxss                    # 全局样式
│   ├── pages/
│   │   ├── index/                  # 🏠 首页（热门推荐 + 最新更新）
│   │   ├── web-design/
│   │   │   ├── list.js             # 网页设计列表
│   │   │   └── detail.js          # 网页设计详情
│   │   ├── graduation/
│   │   │   ├── list.js             # 毕业设计列表
│   │   │   └── detail.js          # 毕业设计详情
│   │   └── mine/                   # 我的页面
│   │       ├── about.js            # 关于我们
│   │       ├── changelog.js        # 更新日志
│   │       └── feedback.js         # 意见反馈
│   ├── static/tabbar/              # TabBar 图标（8个）
│   └── utils/
│       └── request.js              # 小程序请求封装
│
├── database/                        # 数据库脚本
│   ├── schema.sql                  # 表结构创建脚本
│   └── init_db.py                  # Python 初始化脚本
│
└── docs/                           # 文档目录
    └── releases/
        └── v1.0.0-initial.md       # v1.0.0 版本发布记录
```

---

## 🗄 数据库设计

### 数据表概览

| 表名 | 用途 | 主要字段 |
|------|------|---------|
| `web_design` | 网页设计作品 | id, title, description, tech_stack, cover_image, views, likes, url |
| `graduation_project` | 毕业设计项目 | id, title, description, tech_stack, cover_image, views, likes, url |
| `user` | 小程序登录用户 | id, openid, nickname, avatar |
| `sys_user` | 管理系统用户 | id, username, nickname, password, role, status, create_time |
| `feedback` | 用户反馈 | id, user_id, content, contact, status |
| `changelog` | 更新日志 | id, version, title, content, date |
| `about_us` | 关于我们 | id, title, content, contact |

### sys_user 表结构（用户管理模块）

```sql
CREATE TABLE sys_user (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  username    VARCHAR(50)  NOT NULL UNIQUE,
  nickname    VARCHAR(100),
  password    VARCHAR(255) NOT NULL,
  avatar      VARCHAR(500),
  role        VARCHAR(20)  DEFAULT 'editor',   -- admin / editor
  status      TINYINT      DEFAULT 1,          -- 1=启用 0=禁用
  create_time DATETIME     DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 🌐 API 接口文档

### 后端 API 基础路径：`/api`

| 方法 | 接口路径 | 说明 |
|------|---------|------|
| GET | `/sys-user/list` | 分页查询用户列表（支持 keyword 搜索） |
| GET | `/sys-user/all` | 查询所有用户 |
| GET | `/sys-user/{id}` | 按 ID 查询用户 |
| GET | `/sys-user/stats` | 获取用户统计（total / active） |
| POST | `/sys-user` | 新增用户 |
| PUT | `/sys-user/{id}` | 更新用户 |
| DELETE | `/sys-user/{id}` | 删除用户 |
| PUT | `/sys-user/{id}/status` | 修改用户状态（启用/禁用） |
| GET | `/web-design/list` | 分页查询网页设计列表 |
| GET | `/web-design/{id}` | 查询网页设计详情 |
| POST | `/web-design` | 新增网页设计 |
| PUT | `/web-design/{id}` | 更新网页设计 |
| DELETE | `/web-design/{id}` | 删除网页设计 |
| GET | `/graduation/list` | 分页查询毕业设计列表 |
| GET | `/graduation/{id}` | 查询毕业设计详情 |
| POST | `/graduation` | 新增毕业设计 |
| PUT | `/graduation/{id}` | 更新毕业设计 |
| DELETE | `/graduation/{id}` | 删除毕业设计 |
| GET | `/feedback/list` | 查询所有反馈 |
| POST | `/feedback` | 提交反馈 |
| PUT | `/feedback/{id}/status` | 处理反馈 |
| DELETE | `/feedback/{id}` | 删除反馈 |
| GET | `/changelog/list` | 查询更新日志列表 |
| GET | `/about-us` | 获取关于我们内容 |
| PUT | `/about-us` | 更新关于我们 |
| GET | `/index/stats` | 获取首页统计数据 |

---

## 📊 功能模块说明

### 1. 首页数据看板（Home.vue）

集成 ECharts 实现多维度数据可视化：

- **统计卡片**：网页设计数量、毕业设计数量、反馈数量、日志数量
- **内容增长趋势**：柱状图展示近7天内容发布趋势
- **内容分布饼图**：网页设计与毕业设计占比
- **热度排行**：按浏览量排序的内容列表
- **互动统计**：总浏览量、总点赞数
- **用户角色分布**：管理员/编辑占比饼图
- **用户注册趋势**：近7天用户注册柱状图

### 2. 用户管理模块（SysUser.vue）

- **表格展示**：头像、用户名、昵称、角色、状态、创建时间
- **搜索过滤**：按用户名/昵称关键词搜索
- **分页**：每页10条，支持跳转
- **新增用户**：用户名、昵称、角色、初始密码
- **编辑用户**：修改昵称、角色
- **重置密码**：一键重置为 `123456`
- **启用/禁用**：Switch 开关实时切换状态
- **删除用户**：二次确认后删除

### 3. 内容管理模块

| 模块 | 功能 |
|------|------|
| 网页设计 | 列表、筛选、分页、编辑（标题/描述/技术栈/封面/链接）、删除 |
| 毕业设计 | 列表、筛选、分页、编辑（同上）、删除 |
| 用户反馈 | 查看反馈列表、处理状态标记、删除 |
| 更新日志 | 版本号、标题、内容、时间线展示 |
| 关于我们 | 富文本内容编辑 |

### 4. 微信小程序

- **首页**：热门推荐（浏览量Top）+ 最新更新（时间倒序）
- **分类浏览**：网页设计 / 毕业设计两个 Tab
- **详情页**：封面图、标题、描述、技术栈、查看原文链接
- **我的**：关于、版本日志、意见反馈

---

## 🚀 本地启动指南

### 环境要求

| 环境 | 版本要求 |
|------|---------|
| Java | JDK 17+ |
| Node.js | v18+ |
| Maven | 3.8+ |
| MySQL | 8.0+ |
| 微信开发者工具 | 最新版 |

### 启动步骤

```bash
# 1. 初始化数据库
mysql -uroot -p123456 < database/schema.sql
python database/init_db.py

# 2. 启动后端（需配置 JAVA_HOME = E:\Java\JDK\jdk-17）
cd backend
mvn spring-boot:run

# 3. 启动前端（另开终端）
cd web
npm install
npm run dev

# 4. 小程序
# 使用微信开发者工具打开 mini-program/ 目录
# 确保开发者工具已勾选"不校验合法域名"
```

### 访问地址

| 服务 | 地址 |
|------|------|
| 管理后台 | http://localhost:3000 |
| 后端 API | http://localhost:8080 |
| 默认管理员账号 | admin / admin123 |

---

## 📋 版本历史

| 版本 | 日期 | 更新内容 |
|------|------|---------|
| v1.0.0 | 2026-04-09 | 初始版本发布，包含三端基础架构 |

---

## 🐞 问题修复记录

| 问题 | 描述 | 修复状态 |
|------|------|---------|
| api/index.js 导入路径错误 | `./request` → `../utils/request` | ✅ 已修复 |
| 小程序 tabbar 图标缺失 | static/tabbar/ 目录不存在 | ✅ 已修复 |
| 数据库占位图不可用 | via.placeholder.com 访问失败 | ✅ 已换用 Unsplash |
| MyBatis-Plus 分页 total 为0 | 缺少分页插件配置 | ✅ 已添加 MybatisPlusConfig |
| 首页柱状图无数据 | trendData 硬编码 + setOption 目标错误 | ✅ 已修复 |
| 小程序无法请求 API | localhost 在小程序中无法访问 | ✅ 已改为局域网 IP |

---

## 📌 待优化功能

- [ ] 图片上传功能（目前封面图使用外链）
- [ ] 小程序搜索功能
- [ ] 用户评论/点赞功能
- [ ] 数据导出功能（Excel/PDF）
- [ ] 操作日志审计
- [ ] 移动端适配优化
- [ ] 小程序登录与 Web 管理后台联动
- [ ] Redis 缓存优化

---

*本文档由 OpenClaw AI 自动生成，最后更新于 2026-04-09*
