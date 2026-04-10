# 若丙代码手册 - 项目总结文档

> 本文档汇总若丙代码手册（ruobing-code-manual）项目的所有开发记录，
> 包含项目架构、技术栈、数据库结构、API接口、开发历程等。
> 生成时间：2026-04-10

---

## 一、项目概述

**项目名称**：若丙代码手册（ruobing-code-manual）
**GitHub 仓库**：`https://github.com/XiaoSaurus/ruobing-code-manual`
**Git 用户**：`XiaoSaurus` / `XiaoSaurus@aliyun.com`
**定位**：资源导航平台，包含网页设计模板和毕业设计项目两大模块，支持微信小程序端和 Web 管理后台。

---

## 二、技术栈

### 小程序端
| 技术 | 说明 |
|------|------|
| 微信小程序 | 宿主框架 |
| 原生 WXML/WXSS/JS | 无框架，原生开发 |
| CSS 变量主题系统 | 支持紫/蓝/绿/粉/暗黑 五种主题 |
| Unsplash 图库 | Banner 和封面图来源 |

### 后端
| 技术 | 说明 |
|------|------|
| Spring Boot 2.7.18 | Java Web 框架 |
| MyBatis-Plus 3.5.3.1 | ORM（除 Banner 模块使用 JPA） |
| Spring Data JPA | 仅 Banner 模块使用 |
| MySQL 8.0 | 数据库 |
| Maven | 构建工具 |

### 前端管理后台
| 技术 | 说明 |
|------|------|
| Vue 3 | 框架 |
| Vite | 构建工具 |
| Element Plus | UI 组件库 |
| ECharts | 可视化图表 |

### 开发环境
| 环境 | 路径/版本 |
|------|----------|
| JDK | `E:\Java\JDK\jdk-17` |
| Maven | `E:\Java\Maven\apache-maven-3.9.6\bin\mvn.cmd` |
| Node.js | `E:\Web\NodeJS\node.exe` (v18) |
| MySQL | `C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe` |
| MySQL 数据库 | `ruobing_codebook`，用户 `root`，密码 `123456` |

> ⚠️ **Maven 路径说明**：`mvn.cmd` 第 1 行硬编码了 `JAVA_HOME=E:\Java\JDK\jdk-17`，
> 用于解决 JDK 版本冲突问题。如遇 Maven 报错"无效的目标发行版:17"，检查此路径。

---

## 三、数据库结构

### 表总览

| 表名 | 说明 | 记录数 |
|------|------|--------|
| `web_design` | 网页设计模板 | 21 条 |
| `graduation_project` | 毕业设计项目 | 21 条 |
| `banner` | 首页轮播图 | 4 条 |
| `changelog` | 更新日志 | 1 条 |
| `feedback` | 用户反馈 | 0 条 |
| `sys_user` | 系统用户 | 4 条 |

### web_design 表结构

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint PK | 主键 |
| title | varchar(200) | 标题 |
| description | text | 描述 |
| content | longtext | 内容详情 |
| cover_image | varchar(500) | 封面图 URL |
| tags | varchar(500) | 标签（逗号分隔） |
| views | int | 浏览量 |
| likes | int | 点赞量 |
| favorites | int | 收藏量 |
| sort_order | int | 排序 |
| is_hot | tinyint(1) | 是否热门 |
| is_latest | tinyint(1) | 是否最新 |
| status | tinyint(1) | 状态（1=正常） |
| create_time | datetime | 创建时间 |
| update_time | datetime | 更新时间 |

### graduation_project 表结构

（字段与 `web_design` 基本一致，无 student_name/school/major 字段）

### banner 表结构

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint PK | 主键 |
| title | varchar(200) | 标题 |
| image_url | varchar(500) | 图片 URL |
| sort_order | int | 排序（升序） |
| status | tinyint(1) | 状态（1=启用） |
| create_time | datetime | 创建时间 |
| update_time | datetime | 更新时间 |

### sys_user 表结构

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint PK | 主键 |
| username | varchar(50) | 用户名 |
| nickname | varchar(100) | 昵称 |
| password | varchar(200) | 密码（加密存储） |
| role | varchar(20) | 角色（admin/normal） |
| status | tinyint(1) | 状态 |
| create_time | datetime | 创建时间 |

---

## 四、API 接口文档

### 基础响应格式

所有接口统一包装在 `Result` 对象中：

```json
{
  "code": 200,
  "message": "success",
  "data": { ... }
}
```

> ⚠️ **注意**：`web_design` 和 `graduation` 接口返回格式不一致！
> - `/web-design/list` 返回 **数组**：`data` 是数组
> - `/graduation/list` 返回 **分页对象**：`data = { records: [...], total: N }`
> - 小程序端已通过 `normalize()` 函数统一处理这两种格式

### 公开接口（无需认证）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/web-design/list` | 网页设计列表（支持 `keyword`、`sortBy` 参数） |
| GET | `/api/web-design/hot` | 热门网页设计（最多 6 条） |
| GET | `/api/web-design/latest` | 最新网页设计（最多 6 条） |
| GET | `/api/web-design/{id}` | 网页设计详情 |
| GET | `/api/graduation/list` | 毕业设计列表（支持 `keyword`、`sortBy` 参数） |
| GET | `/api/graduation/hot` | 热门毕业设计（最多 6 条） |
| GET | `/api/graduation/latest` | 最新毕业设计（最多 6 条） |
| GET | `/api/graduation/{id}` | 毕业设计详情 |
| GET | `/api/banner/list` | 首页轮播图列表（按 sortOrder 排序） |

### 管理后台接口（需认证）

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/auth/login` | 登录 |
| GET | `/api/web-design/stats` | 网页设计统计（总计/今日新增/本周新增） |
| GET | `/api/graduation/stats` | 毕业设计统计 |
| POST | `/api/feedback` | 提交反馈 |
| GET | `/api/feedback/list` | 反馈列表 |

### 登录凭证

- 账号：`admin`
- 密码：`admin123`

---

## 五、项目结构

```
ruobing-code-manual/
├── mini-program/               # 微信小程序端
│   ├── app.js                  # 全局配置，apiBase、主题系统
│   ├── app.json                # 页面注册
│   ├── app.wxss                # 全局样式，CSS 主题变量
│   ├── pages/
│   │   ├── index/              # 首页（轮播图 + 热门/最新）
│   │   ├── web-design/
│   │   │   ├── list.wxml/js    # 列表页（搜索+排序+卡片）
│   │   │   └── detail/         # 详情页
│   │   ├── graduation/
│   │   │   ├── list.wxml/js    # 列表页
│   │   │   └── detail/         # 详情页
│   │   └── mine/               # 我的模块
│   │       ├── mine.wxml       # 个人中心
│   │       ├── theme.wxml      # 主题切换页
│   │       ├── about.wxml      # 关于页
│   │       ├── feedback.wxml   # 反馈页
│   │       └── changelog.wxml  # 更新日志页
│   └── static/
│       ├── tabbar/             # TabBar 图标（8个）
│       ├── icons/              # 页面图标（14个PNG）
│       └── banners/            # Banner 图片（4张）+ 生成脚本
│
├── backend/                    # Spring Boot 后端
│   ├── src/main/java/com/ruobing/codebook/
│   │   ├── controller/         # Controller 层
│   │   ├── service/           # Service 层
│   │   ├── repository/         # MyBatis-Plus Mapper / JPA Repository
│   │   ├── entity/            # 实体类
│   │   └── config/            # 配置类（MybatisPlusConfig 等）
│   ├── src/main/resources/
│   │   └── application.yml    # 数据库连接等配置
│   ├── pom.xml
│   ├── restart_backend.bat     # 后端启动脚本
│   ├── _start.ps1             # PowerShell 启动脚本
│   ├── mock_web_design.sql    # 网页设计 Mock 数据
│   └── mock_graduation.sql    # 毕业设计 Mock 数据
│
├── frontend/                   # Vue 3 管理后台
│   ├── src/
│   │   ├── views/            # 页面（Home、SysUser、WebDesign 等）
│   │   ├── router/           # 路由配置
│   │   └── api/             # API 调用封装
│   ├── vite.config.js
│   └── package.json
│
├── docs/
│   ├── README.md              # 项目介绍文档
│   └── releases/
│       └── v1.0.0-initial.md # 初始版本说明
│
├── DEV.md                     # 详细开发手册
├── SUMMARY.md                 # 本文档（项目总览）
└── git-push-retry.ps1        # GitHub 推送重试脚本
```

---

## 六、启动方式

### 1. 启动后端

```bash
cd backend
# 方式一：使用 bat 脚本（推荐）
restart_backend.bat
# 方式二：直接 Maven 启动
mvn spring-boot:run
```

> 后端地址：`http://localhost:8080`
> 首次启动会自动创建数据库表（MyBatis-Plus 配置了 autoDdl）

### 2. 启动前端管理后台

```bash
cd frontend
npm install   # 首次需要安装依赖
npm run dev
```

> 前端地址：`http://localhost:3000`

### 3. 启动小程序

在微信开发者工具中导入 `mini-program` 目录，填写 AppID 即可。

> 小程序接口地址在 `mini-program/app.js` 中配置 `apiBase` 变量。
> 本地调试时改为本机局域网 IP（如 `http://192.168.x.x:8080/api`）。

---

## 七、主题系统

小程序支持 5 种主题颜色，通过 CSS 变量实现：

| 主题 | 主色值 | 说明 |
|------|--------|------|
| 紫色 | `#8B5CF6` | 默认主题 |
| 蓝色 | `#409EFF` | Element Plus 蓝 |
| 绿色 | `#10B981` | 清新绿 |
| 粉色 | `#EC4899` | 少女粉 |
| 暗黑 | `#6366F1` | 暗色主题主色 |

所有图标均为白色（通过 CSS `filter: grayscale(100%) brightness(200%)` 实现），
自适应所有主题颜色。

---

## 八、已知问题

1. **后端偶发退出**：后端进程有时会非正常退出（exit code -1），原因不明，可能是内存不足或被系统终止。
2. **GitHub 推送网络超时**：443 端口连接不稳定，已配置自动重试脚本。
3. **Maven JDK 硬编码**：如遇 Maven 报错"无效的目标发行版"，检查 `mvn.cmd` 第 1 行的 `JAVA_HOME` 路径。
4. **响应格式不一致**：WebDesign 返回数组，Graduation 返回分页对象，已在小程序端通过 `normalize()` 函数统一处理。

---

## 九、Git 版本记录

| Commit | 时间 | 说明 |
|--------|------|------|
| `7d72cd2` | 2026-04-10 | docs: 创建项目 SUMMARY.md 总览文档 |
| `66fafb2` | 2026-04-10 | style: 列表页卡片三段式布局对齐首页，新增30条Mock数据 |
| `121e716` | 2026-04-10 | style: 列表页搜索栏和卡片UI对齐首页风格 |
| `cfedeec` | 2026-04-10 | docs: 更新DEV.md，补充Banner表结构和接口文档 |
| `c5f7fdf` | 2026-04-10 | feat: 轮播图后端接口动态获取（Banner表+CRUD接口） |
| `793ca1b` | 2026-04-09 | 创建 DEV.md 开发手册 |
| `052762b` | 2026-04-09 | 清理 backend/target/ 从 git 跟踪移除 |
| `1461e92` | 2026-04-09 | feat: 轮播图替代首页搜索功能 |
| `eaed6c2` | 2026-04-09 | fix: 搜索按钮修复（bindconfirm） |
| `2c1ddb3` | 2026-04-09 | fix: 还原浏览/点赞/收藏图标为 emoji |
| `5af7377` | 2026-04-08 | style: 全模块 emoji→PNG 图标替换 |
| `08d0604` | 2026-04-08 | fix: normalize 函数修复响应格式不统一 |
| `95f9ba3` | 2026-04-08 | feat: 小程序 TabBar 和主题系统 |
| `93214f1` | 2026-04-08 | feat: 首页 echarts 可视化大屏 |
| `...` | 更早 | 初始项目搭建 |

> ⚠️ **GitHub 推送状态**：HTTPS 443 端口被封，SSH 22 端口正常。
> 已生成 SSH key（`id_ed25519_github`），公钥需手动添加到 GitHub：
> - 打开 https://github.com/settings/keys → New SSH key
> - 粘贴：`ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEYllXtJmssQkRBxpc+/tiHe2uumKMlLxZ1l0aOwyH2U XiaoSaurus@aliyun.com`
> - 添加后运行 `git-push-ssh.ps1` 即可推送

---

## 十、当前服务状态

| 服务 | 状态 | 地址 |
|------|------|------|
| 后端 Spring Boot | 🟡 待确认 | `http://localhost:8080` |
| 前端 Vue | 🟡 待确认 | `http://localhost:3000` |
| MySQL | 🟢 运行中 | `localhost:3306` |

> 💡 **提示**：如服务未运行，按第六节的启动方式重新启动。
> 使用 `restart_backend.bat` 启动后端，使用 `npm run dev` 启动前端。

---

*最后更新：2026-04-10*
