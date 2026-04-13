<template>
  <el-config-provider :locale="zhCn">
    <router-view />
  </el-config-provider>
</template>

<script setup>
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: var(--rb-font-sans, 'PingFang SC', 'Microsoft YaHei', sans-serif);
  background: var(--rb-bg-page, #f1f5f9);
  color: var(--rb-text, #0f172a);
}
</style>
