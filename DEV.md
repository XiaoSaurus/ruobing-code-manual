# 若冰代码手册 · 开发手册

> 快速了解项目全局状态，无需扫描全项目代码。  
> 本文档覆盖：项目结构、数据库、API、后端架构、前端架构、小程序架构、开发注意事项。

---

## 📦 一、项目概览

| 字段 | 内容 |
|------|------|
| 名称 | 若冰代码手册 |
| 仓库 | https://github.com/XiaoSaurus/ruobing-code-manual |
| 定位 | 微信小程序（用户端）+ Vue3 管理后台 + SpringBoot 后端 |
| 域名/IP | 当前 `192.168.56.1`，小程序连接时需使用局域网 IP |

---

## 🗂️ 二、项目结构

```
ruobing-code-manual/
├── backend/              # SpringBoot 后端（JDK 17，Maven）
├── web/                  # Vue 3 管理前端（Vite，端口 3000）
├── mini-program/         # 微信小程序（原生，TabBar 4 页）
└── database/             # MySQL 数据库脚本
    ├── schema.sql        # 建表语句 + 初始数据
    └── init_db.py       # Python 批量插入 Mock 数据脚本
```

---

## 🗄️ 三、数据库

**库名**：`ruobing_codebook`（utf8mb4）

### 3.1 表结构总览

| 表名 | 说明 | 关键字段 |
|------|------|---------|
| `user` | 微信小程序用户 | id, openid, nickname, avatar |
| `web_design` | 网页设计作品 | id, title, description, content, cover_image, tags, views, likes, **favorites**, is_hot, is_latest |
| `graduation_project` | 毕业设计项目 | 同 web_design 结构 |
| `feedback` | 用户反馈 | id, user_id, content, contact, images, status, reply |
| `changelog` | 版本更新日志 | id, version, title, content, type |
| `about_us` | 关于我们 | id, content |
| `sys_user` | 管理后台用户 | id, username, nickname, password, role, status |

> ⚠️ `web_design` 和 `graduation_project` 表已加 `favorites` 字段（默认 0），后端实体类（GraduationProject.java / WebDesign.java）需同步。

### 3.2 启动命令

```bash
mysql -u root -p < database/schema.sql
# 或
python database/init_db.py   # 插入 Mock 数据（6 条网页设计 + 6 条毕业设计）
```

---

## ⚙️ 四、环境配置

### 4.1 后端环境

| 项目 | 值 |
|------|---|
| JDK | **17**（路径：`E:\Java\JDK\jdk-17`） |
| Maven | `E:\apache-maven-3.9.6` |
| ⚠️ 注意事项 | `mvn.cmd` 第 1 行硬编码了 `JAVA_HOME=E:\Java\JDK\jdk-1.8`，若遇 `无效的目标发行版:17` 错误，需手动改为 JDK 17 路径 |
| 数据库 | MySQL，连接 `localhost:3306`，用户名 `root`，密码 `123456` |
| 后端端口 | **8080** |
| 配置文件 | `backend/src/main/resources/application.yml` |

### 4.2 前端环境

| 项目 | 值 |
|------|---|
| Node.js | **v18**（路径：`E:\Web\NodeJS\node.exe`） |
| 前端框架 | Vue 3 + Vite + Element Plus + ECharts |
| 管理后台端口 | **3000** |
| API 代理 | vite.config.js 代理 `/api` → `http://localhost:8080` |

### 4.3 小程序环境

| 项目 | 值 |
|------|---|
| appid | `__UNI__1234567`（占位符，需改为真实 appid） |
| API 地址 | `app.js` 中 `globalData.apiBase`，小程序中需使用**局域网 IP**（如 `192.168.56.1:8080`），不能写 `localhost` |
| 图标资源 | `mini-program/static/icons/`（10 个 PNG），`mini-program/static/tabbar/`（8 个 PNG） |
| 图标生成脚本 | `mini-program/static/icons/generate_icons.py`（Python Pillow 生成） |

---

## 🔌 五、后端 API

### 5.1 基础信息

- **Base URL**：`http://localhost:8080/api`
- **跨域**：CorsConfig 已配置允许所有来源
- **分页**：MyBatis-Plus 分页插件需在 `MybatisPlusConfig.java` 中注册

### 5.2 API 列表

#### 公开接口（小程序无需登录）

| 方法 | 路径 | 说明 | 返回格式 |
|------|------|------|---------|
| GET | `/web-design/hot` | 热门网页设计 | 数组 `[]` 或分页对象 `{records:[],total:N}` |
| GET | `/web-design/latest` | 最新网页设计 | 同上 |
| GET | `/web-design/list?page=&size=&keyword=&sortBy=` | 列表/搜索 | 分页对象 |
| GET | `/web-design/{id}` | 详情 | 单对象 |
| GET | `/graduation/hot` | 热门毕业设计 | 同上 |
| GET | `/graduation/latest` | 最新毕业设计 | 同上 |
| GET | `/graduation/list?page=&size=&keyword=&sortBy=` | 列表/搜索 | 分页对象 |
| GET | `/graduation/{id}` | 详情 | 单对象 |
| GET | `/about-us` | 关于我们 | 单对象 |
| GET | `/changelog` | 更新日志列表 | 数组 |
| POST | `/feedback` | 提交反馈 | `{content, contact}` |
| POST | `/user/login` | 小程序登录 | `{openid}` |

> ⚠️ **关键兼容逻辑**：小程序 `index.js` 中有 `normalize()` 函数，兼容处理 `/web-design/*` 返回**数组**和 `/graduation/*` 返回**分页对象**两种格式。修改后端返回格式时注意同步。

#### 管理后台接口（需登录）

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/sys-user/login` | 管理员登录 |
| GET | `/sys-user/list?page=&size=` | 用户列表 |
| POST | `/sys-user` | 新增用户 |
| PUT | `/sys-user/{id}` | 修改用户 |
| DELETE | `/sys-user/{id}` | 删除用户 |
| GET | `/index/stats` | 首页统计（数量卡片） |
| POST | `/web-design` | 新增网页设计 |
| PUT | `/web-design/{id}` | 修改网页设计 |
| DELETE | `/web-design/{id}` | 删除网页设计 |
| POST | `/graduation` | 新增毕业设计 |
| PUT | `/graduation/{id}` | 修改毕业设计 |
| DELETE | `/graduation/{id}` | 删除毕业设计 |
| GET | `/feedback/list?page=&size=` | 反馈列表 |
| PUT | `/feedback/{id}/reply` | 回复反馈 |
| PUT | `/about-us` | 更新关于我们 |
| POST | `/changelog` | 新增日志 |
| PUT | `/changelog/{id}` | 修改日志 |
| DELETE | `/changelog/{id}` | 删除日志 |

### 5.3 后端代码架构

```
controller/          # 控制器层（接收请求）
service/             # 业务逻辑层
repository/          # 数据访问层（MyBatis-Plus Mapper）
entity/              # 实体类
config/
  ├── CorsConfig.java          # 跨域配置
  └── MybatisPlusConfig.java   # 分页插件（必须！）
common/
  ├── Result.java              # 统一响应封装 {code, message, data}
  └── PageResult.java          # 分页封装 {records, total, ...}
```

**统一响应格式**：
```json
{ "code": 200, "message": "success", "data": {...} }
```

---

## 🖥️ 六、管理后台（Vue 3）

### 6.1 路由

```
/login                    → 登录页
/                         → 布局页
  /home                   → 首页大屏（ECharts 统计）
  /web-design             → 网页设计管理
  /web-design/edit/:id?   → 新增/编辑
  /graduation             → 毕业设计管理
  /graduation/edit/:id?   → 新增/编辑
  /feedback               → 用户反馈管理
  /changelog              → 更新日志管理
  /sys-user               → 系统用户管理
  /about                  → 关于我们编辑
```

### 6.2 登录

- 账号：`admin`
- 密码：`admin123`
- 接口：`POST /api/sys-user/login`
- Token 存储：localStorage

### 6.3 API 请求

- `web/src/utils/request.js`：Axios 实例，代理 `/api` → `http://localhost:8080`
- `web/src/api/index.js`：按模块聚合 API 调用

---

## 📱 七、微信小程序

### 7.1 页面结构

| 页面 | 路径 | 说明 |
|------|------|------|
| 首页 | `pages/index/index` | 热门推荐 + 最新更新 |
| 网页设计列表 | `pages/web-design/list` | 搜索/排序/分页 |
| 网页设计详情 | `pages/web-design/detail` | 详情页 |
| 毕业设计列表 | `pages/graduation/list` | 同网页设计 |
| 毕业设计详情 | `pages/graduation/detail` | 详情页 |
| 我的 | `pages/mine/mine` | 用户信息 + 菜单 |
| 意见反馈 | `pages/mine/feedback` | 提交反馈 |
| 更新日志 | `pages/mine/changelog` | 版本历史 |
| 关于我们 | `pages/mine/about` | 平台介绍 |
| 切换主题 | `pages/mine/theme` | 6 种主题色 |

### 7.2 TabBar 配置

```json
4 个标签页：首页 | 网页设计 | 毕业设计 | 我的
图标：mini-program/static/tabbar/（81×81 PNG，普通态+选中态各 4 张）
```

### 7.3 主题系统

- 入口：`pages/mine/theme` 页面，`app.js` 全局管理
- 6 种主题色：科技蓝 / 优雅紫 / 清新绿 / 活力橙 / 中国红 / 极客黑
- 实现：CSS 变量（`app.wxss` 中 `--theme-color`）+ wx.setTabBarStyle
- 存储：`wx.setStorageSync('theme', theme)`

### 7.4 图标资源

| 目录 | 文件 | 用途 |
|------|------|------|
| `static/icons/` | icon-search.png | 首页搜索 |
| `static/icons/` | icon-eye/heart/star.png | 首页/列表页浏览/点赞/收藏（**emoji 👁❤️⭐ 已还原**） |
| `static/icons/` | icon-book/monitor/cap/bulb.png | 关于页 Logo + 功能特性 |
| `static/icons/` | icon-pencil/clock/info/palette.png | 我的页菜单图标 |
| `static/icons/` | icon-fire.png | 主题预览 |
| `static/section_icons/` | section-hot/new.png | 首页热门/最新标签 |
| `static/tabbar/` | home/code/school/mine × 2 | TabBar 图标 |

### 7.5 API 请求封装

- 文件：`mini-program/utils/request.js`
- 自动读取 `app.globalData.apiBase`，拼接完整 URL
- 返回 Promise，统一处理 `res.data`

---

## 🐛 八、已知问题与解决

| # | 问题 | 原因 | 解决方式 |
|---|------|------|---------|
| 1 | `mvn spring-boot:run` 报"无效的目标发行版:17" | `mvn.cmd` 硬编码 `JAVA_HOME=jdk-1.8` | 修改 `E:\apache-maven-3.9.6\bin\mvn.cmd` 第 1 行改为 `set JAVA_HOME=E:\Java\JDK\jdk-17` |
| 2 | 小程序首页数据加载失败（接口 200 但页面空白） | 小程序不支持 `localhost`，API 地址需用局域网 IP | 修改 `mini-program/app.js` 的 `apiBase` 为 `http://192.168.56.1:8080/api` |
| 3 | 首页统计数量全为 0 | MyBatis-Plus 缺少分页插件 | 新建 `MybatisPlusConfig.java`，注册 `PaginationInnerInterceptor` |
| 4 | 首页热门/最新数据缺失 | `/web-design/*` 返回数组，`/graduation/*` 返回分页对象，解析逻辑不一致 | `index.js` 中 `normalize()` 函数兼容两种格式 |
| 5 | 小程序端 Emoji 图标显示变形 | 不同设备字体渲染差异 | 已为"我的"模块生成统一风格 PNG 图标，列表/首页保留 emoji |
| 6 | Maven 下载依赖极慢/超时 | 中央仓库网络问题 | 无代理解决方案，可配置阿里云镜像（未实施） |

---

## 🚀 九、快速启动

### 步骤 1：数据库
```bash
mysql -u root -p < database/schema.sql
python database/init_db.py    # 可选：插入 Mock 数据
```

### 步骤 2：后端
```powershell
# 确认 JDK 17 环境
$env:JAVA_HOME = 'E:\Java\JDK\jdk-17'

cd backend
# 修改 application.yml 数据库密码
mvn spring-boot:run
# 或使用启动脚本
.\backend\_start.ps1
# 后端地址：http://localhost:8080
```

### 步骤 3：前端
```powershell
# 确认 Node.js v18
cd web
npm install
npm run dev
# 前端地址：http://localhost:3000
# 管理后台：http://localhost:3000/login
```

### 步骤 4：小程序
1. 微信开发者工具导入 `mini-program` 目录
2. 修改 `app.js` 中 `apiBase` 为局域网 IP（如 `http://192.168.56.1:8080/api`）
3. 确保手机和电脑在同一局域网

---

## 📝 十、Git 版本记录

| Commit | 说明 |
|--------|------|
| `2c1ddb3` | fix: 还原列表页浏览/点赞/收藏 emoji，保留"我的"模块图标 |
| `5af7377` | refactor: 全局 emoji 替换为 Pillow PNG 图标（14 个） |
| `91c028e` | fix: section 图标用 Pillow 几何 PNG |
| `be15726` | fix: 首页 API 数据格式兼容处理（数组/分页对象） |
| `859b8bf` | fix: 小程序 API 地址 localhost → 局域网 IP |
| `08d0604` | fix: 列表页图标、收藏量、搜索 |
| `95f9ba3` | feat: 小程序全面优化（主题系统、TabBar、页面注册） |
| `93214f1` | feat: 用户管理模块 + MyBatisPlus 分页插件 + ECharts 大屏 |
| `315ab3b` | fix: 前端 API 导入路径修复 + 小程序 TabBar 图标 |

---

*最后更新：2026-04-09*
