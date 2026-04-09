# 睿理代码宝 - 开发手册

> 若无特别说明，以下路径均相对于项目根目录。

---

## 📌 项目概述

**睿理代码宝**是一个代码资源管理系统，包含三个子项目：

| 子项目 | 技术栈 | 端口 | 说明 |
|--------|--------|------|------|
| `backend/` | Spring Boot 3 + MyBatis-Plus + MySQL | 8080 | REST API 后端 |
| `frontend/` | Vue 3 + Vite + Element Plus | 3000 | PC 管理后台 |
| `mini-program/` | 原生微信小程序 | - | 微信小程序客户端 |

---

## 📂 项目结构

```
ruobing-code-manual/
├── backend/                         # Spring Boot 后端
│   ├── _start.ps1                  # 启动脚本（PowerShell）
│   ├── _start.bat                  # 启动脚本（CMD）
│   └── src/main/java/com/ruobing/codebook/
│       ├── CodebookApplication.java          # 启动类
│       ├── config/
│       │   └── CorsConfig.java              # 跨域配置
│       ├── common/
│       │   ├── Result.java                  # 统一响应体 {code, msg, data}
│       │   └── PageResult.java               # 分页响应 {records, total}
│       ├── entity/                          # JPA 实体类
│       │   ├── WebDesign.java               # 网页设计资源
│       │   ├── GraduationProject.java       # 毕业设计资源
│       │   ├── User.java                    # 用户
│       │   ├── SysUser.java                 # 系统用户
│       │   ├── AboutUs.java                 # 关于我们
│       │   ├── Changelog.java              # 更新日志
│       │   └── Feedback.java                # 用户反馈
│       ├── repository/                       # 数据访问层
│       ├── service/                          # 业务层
│       └── controller/                       # 控制器
│           ├── WebDesignController.java      # 网页设计 CRUD + 列表/热门/最新
│           ├── GraduationProjectController.java
│           ├── UserController.java            # 用户登录
│           ├── SysUserController.java        # 用户管理（管理后台）
│           ├── IndexController.java          # 首页统计
│           ├── FeedbackController.java
│           ├── ChangelogController.java
│           └── AboutUsController.java
│
├── frontend/                        # Vue 3 管理后台
│   ├── src/views/
│   │   ├── Home.vue                 # 首页大屏（ECharts 统计）
│   │   ├── SysUser.vue              # 用户管理
│   │   ├── WebDesign.vue            # 网页设计管理
│   │   └── GraduationProject.vue    # 毕业设计管理
│   └── vite.config.js               # 代理配置 → localhost:8080
│
├── mini-program/                    # 微信小程序
│   ├── app.js                       # 全局配置、主题系统、apiBase
│   ├── app.wxss                     # 全局样式（CSS 变量主题系统）
│   ├── pages/
│   │   ├── index/                   # 首页（轮播图 + 热门/最新列表）
│   │   ├── web-design/
│   │   │   ├── list.js              # 列表页（支持 keyword 搜索）
│   │   │   └── detail.js            # 详情页
│   │   ├── graduation/              # 同上结构
│   │   └── mine/
│   │       ├── mine.js              # 个人中心
│   │       ├── about.js             # 关于
│   │       ├── changelog.js          # 更新日志
│   │       ├── feedback.js           # 反馈
│   │       └── theme.js             # 主题切换（5 色可选）
│   └── static/
│       ├── icons/                   # 功能图标（14 个 PNG）
│       ├── tabbar/                  # 底部导航图标（8 个 PNG）
│       ├── section_icons/           # 列表页 section 图标
│       ├── banners/                 # 首页轮播图（4 张 PNG）
│       └── default.png             # 默认封面占位图
│
├── docs/
│   ├── README.md                    # 项目说明
│   └── releases/                    # 版本记录
└── DEV.md                          # 本文档
```

---

## 🗄️ 数据库

**MySQL 数据库名：** `ruobing_code`

### 表结构

#### `web_design` 网页设计资源

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK | 主键 |
| title | VARCHAR(200) | 标题 |
| description | TEXT | 描述 |
| cover_image | VARCHAR(500) | 封面图 URL |
| content | TEXT | 内容详情 |
| tags | VARCHAR(500) | 标签（逗号分隔） |
| author | VARCHAR(100) | 作者 |
| views | INT DEFAULT 0 | 浏览量 |
| likes | INT DEFAULT 0 | 点赞数 |
| favorites | INT DEFAULT 0 | 收藏数 |
| source_url | VARCHAR(500) | 源码链接 |
| demo_url | VARCHAR(500) | 演示链接 |
| price | DECIMAL(10,2) | 价格 |
| status | INT DEFAULT 1 | 状态（1正常 0下架） |
| create_time | DATETIME | 创建时间 |

#### `graduation_project` 毕业设计资源

> 字段与 `web_design` 基本相同，额外无 `demo_url`。

#### `sys_user` 系统用户（管理后台）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK | |
| username | VARCHAR(50) | 登录账号 |
| nickname | VARCHAR(100) | 昵称 |
| password | VARCHAR(100) | 密码（存明文或 MD5） |
| role | VARCHAR(20) | 角色（admin / user） |
| status | INT DEFAULT 1 | 状态 |
| create_time | DATETIME | 创建时间 |

> 初始账号：`admin` / `admin123`

#### 辅助表

- `about_us` - 关于我们内容
- `changelog` - 更新日志
- `feedback` - 用户反馈

---

## 🌐 API 接口

**基础路径：** `/api`

### 公开接口

| 方法 | 路径 | 说明 | 返回 |
|------|------|------|------|
| GET | `/web-design/list` | 网页设计列表（支持 `keyword` `page` `pageSize`） | `{data: {records:[], total:N}}` |
| GET | `/web-design/hot` | 热门推荐 | 数组或分页对象 |
| GET | `/web-design/latest` | 最新更新 | 同上 |
| GET | `/web-design/{id}` | 详情 | 单条记录 |
| GET | `/graduation/list` | 毕业设计列表 | 同上 |
| GET | `/graduation/hot` | 热门推荐 | 同上 |
| GET | `/graduation/latest` | 最新更新 | 同上 |
| GET | `/graduation/{id}` | 详情 | 单条记录 |
| GET | `/index/stats` | 首页统计数据 | `{data: {...}}` |
| GET | `/about` | 关于我们 | 单条 |
| GET | `/changelog` | 更新日志列表 | 数组 |
| GET | `/user/login` | 用户登录（GET） | `{token, user}` |

### 管理接口（需登录）

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/admin/web-design/add` | 添加网页设计 |
| POST | `/admin/web-design/update` | 更新 |
| POST | `/admin/web-design/delete/{id}` | 删除 |
| GET | `/admin/sys-user/list` | 用户列表 |
| POST | `/admin/sys-user/add` | 添加用户 |
| POST | `/admin/sys-user/update` | 更新用户 |
| POST | `/admin/sys-user/delete/{id}` | 删除用户 |

### 响应格式

```json
// 成功
{ "code": 200, "msg": "success", "data": {...} }

// 失败
{ "code": 500, "msg": "error message", "data": null }
```

> ⚠️ **重要**：部分接口返回纯数组，部分返回分页对象 `{records:[], total}`。小程序端使用 `normalize()` 函数统一处理：
> ```js
> const normalize = (res) => {
>   if (!res || res.code !== 200) return []
>   const data = res.data || []
>   return Array.isArray(data) ? data : (data.records || [])
> }
> ```

---

## 🔧 环境配置

### 依赖版本

| 组件 | 版本 | 路径 |
|------|------|------|
| JDK | **17** | `E:\Java\JDK\jdk-17` |
| Maven | 3.9.6 | `E:\apache-maven-3.9.6` |
| Node.js | 18.x | `E:\Web\NodeJS\node.exe` |
| MySQL | 8.x | 本地 3306 |
| Spring Boot | 3.x | - |
| MyBatis-Plus | 3.5.x | - |

### 关键配置文件

| 文件 | 作用 |
|------|------|
| `backend/src/main/resources/application.yml` | 数据库连接、JVM 参数 |
| `frontend/vite.config.js` | Vite 代理配置 |
| `mini-program/app.js` | 小程序全局配置（apiBase、主题） |

### 小程序 API 地址

| 环境 | apiBase |
|------|---------|
| 开发者工具本地调试 | `http://localhost:8080/api` |
| 局域网真机调试 | `http://192.168.x.x:8080/api` |
| 正式服务器 | 替换为服务器公网地址 |

在 `mini-program/app.js` 中修改 `apiBase` 变量。

---

## 🚀 快速启动

### 后端

```bash
# CMD（推荐）
cd backend
start_backend.bat

# PowerShell
cd backend
.\backend\_start.ps1
```

> 或手动：`mvn spring-boot:run`（需确保 JDK 17 和 Maven 已配置）

启动成功标志：`Started CodebookApplication in X seconds`

### 前端

```bash
cd frontend
npm install
npm run dev
# 访问 http://localhost:3000
```

### 小程序

在微信开发者工具中导入 `mini-program/` 目录，编译即可。

---

## 🔑 已知问题与解决方案

### 1. Maven 编译报错 "无效的目标发行版:17"

**原因：** `mvn.cmd` 脚本第一行硬编码了 `JAVA_HOME=E:\Java\JDK\jdk-1.8`，覆盖了系统环境变量。

**解决：** 修改 `E:\apache-maven-3.9.6\bin\mvn.cmd` 第 1 行：
```bat
@REM set JAVA_HOME=E:\Java\JDK\jdk-1.8
set JAVA_HOME=E:\Java\JDK\jdk-17
```

### 2. 首页统计数据全是 0

**原因：** MyBatis-Plus 缺少分页插件配置。

**解决：** 创建 `config/MybatisPlusConfig.java`，注册 `PaginationInnerInterceptor`。

### 3. 小程序首页数据加载失败

**原因：** `apiBase` 使用 `localhost`，小程序无法访问本机。

**解决：** 在开发者工具中勾选"不校验合法域名..."，或修改 `app.js` 中 `apiBase` 为本机局域网 IP（如 `192.168.56.1`）。

### 4. 响应格式不一致（数组 vs 分页对象）

**原因：** 部分接口返回数组，部分返回分页对象 `{records, total}`。

**解决：** 小程序端使用 `normalize()` 函数统一处理（见上方 API 说明）。

---

## 🎨 主题系统

小程序支持 5 种主题颜色，存储在 `mini-program/app.js` 的 `themeList` 中：

```js
themeList: [
  { id: 'purple',  color: '#6666CC', dark: '#5555AA', light: 'rgba(102,102,204,0.12)',  name: '商务紫',  shadow: 'rgba(102,102,204,0.25)' },
  { id: 'blue',    color: '#1976D2', dark: '#1565C0', light: 'rgba(25,118,210,0.12)',  name: '天空蓝',  shadow: 'rgba(25,118,210,0.25)'  },
  { id: 'green',   color: '#43A047', dark: '#388E3C', light: 'rgba(67,160,71,0.12)',   name: '自然绿',  shadow: 'rgba(67,160,71,0.25)'   },
  { id: 'pink',    color: '#E91E63', dark: '#C2185B', light: 'rgba(233,30,99,0.12)',   name: '樱花粉',  shadow: 'rgba(233,30,99,0.25)'   },
  { id: 'dark',    color: '#37474F', dark: '#263238', light: 'rgba(55,71,79,0.12)',    name: '暗夜灰',  shadow: 'rgba(55,71,79,0.25)'   },
]
```

主题通过 `wx.setStorageSync('theme', theme)` 持久化，`app.wxss` 中的 CSS 变量 `--theme-*` 自动生效。

---

## 📝 Git 版本记录

| Commit | 说明 | 日期 |
|--------|------|------|
| 052762b | 从git跟踪中移除backend/target编译产物 | 2026-04-10 |
| 1461e92 | 首页搜索替换为轮播图 | 2026-04-09 |
| 73ea8a5 | 搜索UI升级（渐变按钮、徽标、清除按钮） | 2026-04-09 |
| cb5777d | 修复首页搜索功能（直接调用API） | 2026-04-09 |
| f993e37 | 首页搜索栏及卡片UI升级 | 2026-04-09 |
| 31ebc16 | 修复搜索功能bindconfirm事件 | 2026-04-09 |
| eaed6c2 | 首页搜索框添加搜索按钮，精简列表项 | 2026-04-09 |
| 5af7377 | emoji替换为14个PNG图标 | 2026-04-09 |
| be15726 | 修复API响应格式兼容（normalize函数） | 2026-04-09 |
| 859b8bf | 小程序API地址localhost改为IP | 2026-04-08 |
| 08d0604 | 列表页图标、收藏量、搜索修复 | 2026-04-08 |
| 793ca1b | 添加DEV.md开发手册 | 2026-04-09 |

---

## 📋 管理后台功能清单

- **首页大屏**：ECharts 统计图（数据卡片、趋势图、饼图、排行榜）
- **用户管理**：列表、增删改（账号 admin / admin123）
- **网页设计管理**：列表、增删改、搜索排序
- **毕业设计管理**：同上结构

---

## ⚙️ 部署说明

### 小程序上线前

1. 将 `mini-program/app.js` 中 `apiBase` 改为服务器公网地址
2. 在微信公众平台配置服务器域名（request 合法域名）
3. 审核代码并提交发布

### 管理后台上线

```bash
cd frontend
npm run build
# 将 dist/ 目录部署到 Nginx
```

### 后端部署

```bash
cd backend
mvn clean package -DskipTests
java -jar target/codebook-0.0.1-SNAPSHOT.jar
```

---

*最后更新：2026-04-10*
