<template>
  <div class="page-container about-page">
    <div class="about-preview-card">
      <div class="about-head">关于我们</div>
      <div class="about-markdown" v-html="aboutHtml" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { markdownToHtml } from '@/utils/markdown'

const ABOUT_MD = `
# 若冰代码手册

学习 · 展示 · 交流

## 简介

「若冰代码手册」是面向学习与作品展示的平台，聚合网页设计案例与毕业设计项目，便于随时浏览、收藏灵感；配合个人中心、主题与反馈等能力，让日常查阅更轻便。

## 定位

为学生、设计与开发人员提供案例浏览与项目参考，侧重“学习、展示与交流”，不替代系统课程或完整工程交付。

## 提供什么

- **网页设计**：作品列表与详情，案例说明与演示入口。
- **毕业设计**：项目分享与选题、实现要点梳理。
- **我的**：登录与资料、主题色、意见反馈与更新日志等。

## 使用与版权

案例、图片与文字版权归原作者所有或已获授权；仅供个人学习与非商业交流，请勿擅自转载、商用或用于违法用途。合作或授权请通过“意见反馈”说明来意。

**当前版本：V1.0.0**
`

const aboutHtml = computed(() => markdownToHtml(ABOUT_MD, '#409eff'))
</script>

<style scoped>
.page-container { max-width: 980px; width: 100%; box-sizing: border-box; }
.about-preview-card {
  border: 1px solid #ebeef5;
  border-radius: 10px;
  background: #fff;
  padding: 18px 20px;
}
.about-head { font-weight: 600; margin-bottom: 10px; }
.about-markdown :deep(h1),
.about-markdown :deep(h2),
.about-markdown :deep(h3) { line-height: 1.4; }
.about-markdown :deep(p) { margin: 0 0 8px; }
.about-markdown :deep(ul) { padding-left: 18px; margin: 8px 0 12px; }
@media (max-width: 768px) {
  .page-container { max-width: 100%; }
}
</style>
