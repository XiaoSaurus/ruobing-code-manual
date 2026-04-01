# 若冰代码手册 - 更新日志

> 记录项目每次更新内容和变更说明

---

## v1.0.0 (2026-04-01)

### 首次发布

#### 新增功能
- **项目框架搭建**：微信小程序 + Vue管理后台 + SpringBoot后端
- **数据库设计**：6张核心数据表
  - `user` - 用户表
  - `web_design` - 网页设计资源表
  - `graduation_project` - 毕业设计资源表
  - `feedback` - 用户反馈表
  - `changelog` - 更新日志表
  - `about_us` - 关于我们表

#### 后端 (SpringBoot)
- RESTful API 接口开发
- MyBatis-Plus ORM 集成
- 跨域配置 (CORS)
- 分页查询支持
- 热门/最新推荐功能

#### 管理后台 (Vue 3 + Element Plus)
- 首页数据统计
- 网页设计管理（增删改查）
- 毕业设计管理（增删改查）
- 用户反馈管理
- 更新日志管理
- 关于我们编辑

#### 微信小程序
- 首页：热门推荐 + 最新更新
- 网页设计模块：列表/搜索/排序/详情
- 毕业设计模块：列表/搜索/排序/详情
- 我的页面：个人信息/反馈/更新日志/关于我们

---

## 技术栈

| 模块 | 技术 |
|------|------|
| 后端 | SpringBoot 2.7 + MyBatis-Plus + MySQL |
| 前端 | Vue 3 + Element Plus + Vite |
| 小程序 | 原生微信小程序 |
| 数据库 | MySQL 8.0 |
| JDK | 17 |

---

## 接口文档

### 基础信息
- 基础路径：`http://localhost:8080/api`
- 返回格式：`{ code: 200, message: "success", data: {...} }`

### 接口列表

#### 用户
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /user/login | 微信登录 |
| GET | /user/{id} | 获取用户信息 |
| PUT | /user | 更新用户信息 |

#### 网页设计
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /web-design/list | 获取列表（支持搜索/排序/分页） |
| GET | /web-design/hot | 热门推荐 |
| GET | /web-design/latest | 最新更新 |
| GET | /web-design/{id} | 详情 |
| POST | /web-design | 新增/编辑 |
| DELETE | /web-design/{id} | 删除 |

#### 毕业设计
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /graduation/list | 获取列表 |
| GET | /graduation/hot | 热门推荐 |
| GET | /graduation/latest | 最新更新 |
| GET | /graduation/{id} | 详情 |
| POST | /graduation | 新增/编辑 |
| DELETE | /graduation/{id} | 删除 |

#### 反馈
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /feedback | 提交反馈 |
| GET | /feedback/list | 获取反馈列表 |
| PUT | /feedback/{id}/reply | 回复反馈 |

#### 其他
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /changelog/list | 更新日志列表 |
| GET | /about | 获取关于我们 |
| PUT | /about | 更新关于我们 |

---

## 启动说明

### 1. 后端启动
```bash
cd backend
# 设置 JAVA_HOME (Windows)
$env:JAVA_HOME = "E:\Java\JDK\jdk-17"
$env:PATH = "E:\Java\Maven\apache-maven-3.9.6\bin;" + $env:PATH
mvn spring-boot:run
```

### 2. 前端启动
```bash
cd web
npm install
npm run dev
```

### 3. 小程序
使用微信开发者工具导入 `mini-program` 目录

---

## 项目结构

```
ruobing-code-manual/
├── backend/                    # SpringBoot 后端
│   ├── src/main/java/
│   │   └── com/ruobing/codebook/
│   │       ├── controller/    # 控制器
│   │       ├── service/        # 业务逻辑
│   │       ├── entity/         # 实体类
│   │       ├── repository/      # 数据访问
│   │       ├── common/         # 通用类
│   │       └── config/         # 配置类
│   └── src/main/resources/
│       └── application.yml     # 配置文件
├── web/                       # Vue 3 管理后台
│   └── src/
│       ├── views/             # 页面
│       ├── api/               # API 接口
│       └── router/            # 路由
├── mini-program/              # 微信小程序
│   └── pages/                 # 页面
├── database/                  # 数据库脚本
└── README.md                  # 项目说明
```

---

## 配置文件

### 数据库配置 (application.yml)
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/ruobing_codebook
    username: root
    password: 123456
```

### 管理后台登录
- 密钥：`admin123`

---

*文档更新时间：2026-04-01*
