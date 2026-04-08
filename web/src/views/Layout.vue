<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <div class="logo">若冰代码手册</div>
      <el-menu :default-active="$route.path" router>
        <el-menu-item index="/home"><el-icon><HomeFilled /></el-icon>首页</el-menu-item>
        <el-menu-item index="/web-design"><el-icon><Document /></el-icon>网页设计</el-menu-item>
        <el-menu-item index="/graduation"><el-icon><School /></el-icon>毕业设计</el-menu-item>
        <el-menu-item index="/feedback"><el-icon><ChatDotRound /></el-icon>用户反馈</el-menu-item>
        <el-menu-item index="/changelog"><el-icon><List /></el-icon>更新日志</el-menu-item>
        <el-menu-item index="/sys-user"><el-icon><UserFilled /></el-icon>用户管理</el-menu-item>
        <el-menu-item index="/about"><el-icon><InfoFilled /></el-icon>关于我们</el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <span class="title">{{ $route.meta.title || '管理后台' }}</span>
      </el-header>
      <el-main><router-view /></el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { HomeFilled, Document, School, ChatDotRound, List, InfoFilled, UserFilled } from '@element-plus/icons-vue'
</script>

<style scoped>
.layout-container { height: 100vh; }
.el-aside { background: #304156; color: #fff; }
.logo { height: 60px; line-height: 60px; text-align: center; font-size: 18px; color: #fff; border-bottom: 1px solid #4a5568; }
.el-menu { border: none; background: #304156; }
.el-menu-item { color: #bfcbd9; }
.el-menu-item:hover, .el-menu-item.is-active { background: #263445; color: #409eff; }
.el-header { background: #fff; display: flex; align-items: center; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
.title { font-size: 18px; font-weight: 500; }
</style>
