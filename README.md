# 若冰代码手册

微信小程序 + Vue管理后台 + SpringBoot后端

## 项目结构

```
ruobing-code-manual/
├── backend/           # SpringBoot 后端 (JDK 17)
├── web/               # Vue 3 管理前端
├── mini-program/      # 微信小程序客户端
└── database/          # MySQL 数据库脚本
```

## 快速开始

### 1. 数据库

```bash
mysql -u root -p < database/schema.sql
```

### 2. 后端

```bash
cd backend
# 修改 src/main/resources/application.yml 中的数据库配置
mvn spring-boot:run
```

### 3. 前端

```bash
cd web
npm install
npm run dev
```

### 4. 小程序

使用微信开发者工具导入 `mini-program` 目录，修改 `app.js` 中的 `apiBase` 为你的后端地址。

## 功能模块

- 首页：热门推荐、最新更新
- 网页设计：列表、搜索、详情
- 毕业设计：列表、搜索、详情
- 我的：个人信息、反馈、更新日志、关于我们

## 技术栈

- **后端**：SpringBoot 2.7 + MyBatis-Plus + MySQL
- **前端**：Vue 3 + Element Plus + Axios
- **小程序**：原生小程序 + Flex布局
