<template>
  <el-container class="layout-container">
    <el-aside v-if="!isMobile" width="228px" class="layout-aside">
      <div class="logo">
        <img class="logo-mark" :src="logoSrc" alt="logo" />
        <div class="logo-text">
          <span class="logo-title">若冰代码手册</span>
          <span class="logo-sub">{{ isAdmin ? '管理后台' : '访客' }}</span>
        </div>
      </div>
      <el-menu :default-active="$route.path" router class="side-menu">
        <el-menu-item v-if="hasMenu('/home')" index="/home"><el-icon><HomeFilled /></el-icon><span>首页</span></el-menu-item>
        <el-menu-item v-if="hasMenu('/web-design')" index="/web-design"><el-icon><Document /></el-icon><span>网页设计</span></el-menu-item>
        <el-menu-item v-if="hasMenu('/graduation')" index="/graduation"><el-icon><School /></el-icon><span>毕业设计</span></el-menu-item>
        <template v-if="isAdmin">
          <el-menu-item v-if="hasMenu('/feedback')" index="/feedback"><el-icon><ChatDotRound /></el-icon><span>用户反馈</span></el-menu-item>
          <el-menu-item v-if="hasMenu('/changelog')" index="/changelog"><el-icon><List /></el-icon><span>更新日志</span></el-menu-item>
          <el-menu-item v-if="hasMenu('/user-admin') || hasMenu('/sys-user')" index="/user-admin"><el-icon><UserFilled /></el-icon><span>用户管理</span></el-menu-item>
          <el-menu-item v-if="hasMenu('/rbac')" index="/rbac"><el-icon><Lock /></el-icon><span>角色权限</span></el-menu-item>
          <el-menu-item v-if="hasMenu('/menu-manage') || hasMenu('/rbac')" index="/menu-manage"><el-icon><Grid /></el-icon><span>菜单管理</span></el-menu-item>
        </template>
        <el-menu-item v-if="hasMenu('/profile')" index="/profile"><el-icon><User /></el-icon><span>个人资料</span></el-menu-item>
        <el-menu-item index="/about"><el-icon><InfoFilled /></el-icon><span>关于我们</span></el-menu-item>
      </el-menu>
    </el-aside>

    <el-container class="layout-right">
      <el-header class="layout-header layout-header-safe">
        <el-button
          v-if="isMobile"
          class="menu-trigger"
          text
          @click="drawerVisible = true"
        >
          <el-icon :size="22"><Menu /></el-icon>
        </el-button>
        <div class="header-inner">
          <h1 class="title">{{ pageTitle }}</h1>
          <span class="header-hint">Ruobing Codebook Admin</span>
        </div>
        <el-dropdown trigger="click" @command="handleUserCommand">
          <div class="header-user">
            <el-avatar :size="30" :src="currentUser.avatar || ''">{{ userNameText }}</el-avatar>
            <span class="header-user-name">{{ currentUser.nickname || currentUser.username || '用户' }}</span>
            <el-icon><ArrowDown /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">个人资料</el-dropdown-item>
              <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main class="layout-main"><router-view /></el-main>
    </el-container>

    <el-drawer
      v-model="drawerVisible"
      direction="ltr"
      size="260px"
      :with-header="false"
      class="mobile-nav-drawer"
    >
      <div class="logo logo--drawer">
        <img class="logo-mark" :src="logoSrc" alt="logo" />
        <div class="logo-text">
          <span class="logo-title">若冰代码手册</span>
          <span class="logo-sub">{{ isAdmin ? '管理后台' : '访客' }}</span>
        </div>
      </div>
      <el-menu :default-active="$route.path" router class="side-menu" @select="drawerVisible = false">
        <el-menu-item v-if="hasMenu('/home')" index="/home"><el-icon><HomeFilled /></el-icon><span>首页</span></el-menu-item>
        <el-menu-item v-if="hasMenu('/web-design')" index="/web-design"><el-icon><Document /></el-icon><span>网页设计</span></el-menu-item>
        <el-menu-item v-if="hasMenu('/graduation')" index="/graduation"><el-icon><School /></el-icon><span>毕业设计</span></el-menu-item>
        <template v-if="isAdmin">
          <el-menu-item v-if="hasMenu('/feedback')" index="/feedback"><el-icon><ChatDotRound /></el-icon><span>用户反馈</span></el-menu-item>
          <el-menu-item v-if="hasMenu('/changelog')" index="/changelog"><el-icon><List /></el-icon><span>更新日志</span></el-menu-item>
          <el-menu-item v-if="hasMenu('/user-admin') || hasMenu('/sys-user')" index="/user-admin"><el-icon><UserFilled /></el-icon><span>用户管理</span></el-menu-item>
          <el-menu-item v-if="hasMenu('/rbac')" index="/rbac"><el-icon><Lock /></el-icon><span>角色权限</span></el-menu-item>
          <el-menu-item v-if="hasMenu('/menu-manage') || hasMenu('/rbac')" index="/menu-manage"><el-icon><Grid /></el-icon><span>菜单管理</span></el-menu-item>
        </template>
        <el-menu-item v-if="hasMenu('/profile')" index="/profile"><el-icon><User /></el-icon><span>个人资料</span></el-menu-item>
        <el-menu-item index="/about"><el-icon><InfoFilled /></el-icon><span>关于我们</span></el-menu-item>
      </el-menu>
    </el-drawer>
  </el-container>
</template>

<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { HomeFilled, Document, School, ChatDotRound, List, InfoFilled, UserFilled, Menu, User, ArrowDown, Lock, Grid } from '@element-plus/icons-vue'
import { useMobile } from '@/composables/useMobile.js'
import { authApi } from '@/api'
import logoSrc from '@/assets/logo.png'

function resolveAuthRole() {
  const explicit = localStorage.getItem('authRole')
  if (explicit) return explicit
  if (localStorage.getItem('appUser')) {
    localStorage.setItem('authRole', 'app')
    return 'app'
  }
  if (localStorage.getItem('adminUser')) {
    localStorage.setItem('authRole', 'admin')
    return 'admin'
  }
  return 'admin'
}

const route = useRoute()
const router = useRouter()
const { isMobile } = useMobile(768)
const drawerVisible = ref(false)
const isAdmin = ref(resolveAuthRole() === 'admin')
function buildDefaultMenus(role) {
  if (role === 'admin') {
    return new Set([
      '/home',
      '/web-design',
      '/graduation',
      '/feedback',
      '/changelog',
      '/user-admin',
      '/rbac',
      '/menu-manage',
      '/profile',
      '/about'
    ])
  }
  return new Set(['/home', '/web-design', '/graduation', '/about', '/profile'])
}

const allowedMenuPaths = ref(buildDefaultMenus(resolveAuthRole()))
const currentUser = ref(readUser())

watch(
  () => route.fullPath,
  () => {
    isAdmin.value = resolveAuthRole() === 'admin'
    currentUser.value = readUser()
  }
)

function refreshUser() {
  isAdmin.value = resolveAuthRole() === 'admin'
  currentUser.value = readUser()
}

const pageTitle = computed(() => route.meta?.title || '管理后台')
const userNameText = computed(() => {
  const n = currentUser.value.nickname || currentUser.value.username || 'U'
  return n.slice(0, 1).toUpperCase()
})

function readUser() {
  try {
    const key = resolveAuthRole() === 'admin' ? 'adminUser' : 'appUser'
    return JSON.parse(localStorage.getItem(key) || '{}')
  } catch (_) {
    return {}
  }
}

function hasMenu(path) {
  return allowedMenuPaths.value.has(path)
}

async function loadMenus() {
  if (!localStorage.getItem('token')) return
  const role = resolveAuthRole()
  allowedMenuPaths.value = buildDefaultMenus(role)
  try {
    if (role !== 'admin') return
    const res = await authApi.getMenus()
    if (res.code === 200 && Array.isArray(res.data) && res.data.length) {
      const merged = new Set([...buildDefaultMenus(role), ...res.data.map((m) => m.path)])
      allowedMenuPaths.value = merged
    }
  } catch (_) {
    allowedMenuPaths.value = buildDefaultMenus(role)
  }
}

function handleUserCommand(cmd) {
  if (cmd === 'profile') {
    router.push('/profile')
    return
  }
  if (cmd === 'logout') {
    localStorage.removeItem('token')
    localStorage.removeItem('authRole')
    localStorage.removeItem('adminUser')
    localStorage.removeItem('appUser')
    ElMessage.success('已退出登录')
    router.replace('/login')
  }
}

loadMenus()

onMounted(() => {
  window.addEventListener('user-profile-updated', refreshUser)
})

onUnmounted(() => {
  window.removeEventListener('user-profile-updated', refreshUser)
})
</script>

<style scoped>
.layout-container {
  height: 100vh;
  min-height: 100dvh;
}
.layout-aside {
  background: linear-gradient(180deg, #3f5fa0 0%, #2d3f6d 100%);
  color: #fff;
  flex-shrink: 0;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
}
.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 16px 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  min-height: 72px;
  box-sizing: border-box;
}
.logo--drawer {
  margin: -20px -20px 0;
  padding: 20px 16px 18px;
}
.logo-mark {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  object-fit: cover;
  flex-shrink: 0;
  box-shadow: 0 4px 14px rgba(64, 158, 255, 0.35);
}
.logo-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  min-width: 0;
}
.logo-title {
  font-size: 15px;
  font-weight: 600;
  color: #f8fafc;
  letter-spacing: 0.02em;
  line-height: 1.3;
}
.logo-sub {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 400;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.side-menu {
  flex: 1;
  border: none !important;
  background: transparent !important;
  padding: 12px 10px;
}
.side-menu :deep(.el-menu-item) {
  height: 46px;
  line-height: 46px;
  margin: 4px 0;
  border-radius: 10px;
  color: #94a3b8;
  font-size: 14px;
}
.side-menu :deep(.el-menu-item .el-icon) {
  font-size: 18px;
}
.side-menu :deep(.el-menu-item:hover) {
  background: rgba(255, 255, 255, 0.06) !important;
  color: #e2e8f0;
}
.side-menu :deep(.el-menu-item.is-active) {
  background: rgba(102, 177, 255, 0.28) !important;
  color: #ffffff !important;
  font-weight: 500;
  box-shadow: inset 3px 0 0 #ffffff;
}
.layout-right {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--rb-bg-page, #f1f5f9);
}
.layout-header {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid var(--rb-border, rgba(15, 23, 42, 0.08));
  flex-shrink: 0;
  min-height: 58px;
  height: auto !important;
  padding: 10px 22px;
}
.menu-trigger {
  padding: 8px;
  margin: -8px 4px -8px -8px;
  color: #475569;
  border-radius: 10px;
}
.menu-trigger:hover {
  background: #f1f5f9;
  color: #0f172a;
}
.header-inner {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.title {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  letter-spacing: -0.02em;
  line-height: 1.25;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.header-hint {
  font-size: 11px;
  color: #94a3b8;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.header-user {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 999px;
  cursor: pointer;
  background: #fff;
  border: 1px solid var(--rb-border, rgba(15, 23, 42, 0.08));
}
.header-user-name {
  font-size: 13px;
  color: #334155;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.layout-main {
  overflow-x: hidden;
  min-height: 0;
  flex: 1;
  --el-main-padding: 20px;
  background: var(--rb-bg-page, #f5f7fa);
}
</style>

<style>
.mobile-nav-drawer .el-drawer__body {
  padding: 20px 12px 24px;
  background: linear-gradient(180deg, #3f5fa0 0%, #2d3f6d 100%);
}
.mobile-nav-drawer .side-menu {
  padding-top: 8px;
}
</style>
