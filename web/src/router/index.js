import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue')
  },
  {
    path: '/login/admin',
    name: 'AdminLogin',
    component: () => import('@/views/auth/AdminLogin.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/Register.vue')
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/auth/ForgotPassword.vue')
  },
  {
    path: '/',
    component: () => import('@/views/Layout.vue'),
    redirect: '/home',
    children: [
      { path: 'home', name: 'Home', meta: { title: '首页概览' }, component: () => import('@/views/Home.vue') },
      { path: 'web-design', name: 'WebDesign', meta: { title: '网页设计' }, component: () => import('@/views/WebDesign.vue') },
      {
        path: 'web-design/edit/:id?',
        name: 'WebDesignEdit',
        meta: { title: '编辑网页设计', requiresAdmin: true },
        component: () => import('@/views/WebDesignEdit.vue')
      },
      { path: 'graduation', name: 'Graduation', meta: { title: '毕业设计' }, component: () => import('@/views/Graduation.vue') },
      {
        path: 'graduation/edit/:id?',
        name: 'GraduationEdit',
        meta: { title: '编辑毕业设计', requiresAdmin: true },
        component: () => import('@/views/GraduationEdit.vue')
      },
      {
        path: 'feedback',
        name: 'Feedback',
        meta: { title: '用户反馈', requiresAdmin: true },
        component: () => import('@/views/Feedback.vue')
      },
      {
        path: 'changelog',
        name: 'Changelog',
        meta: { title: '更新日志', requiresAdmin: true },
        component: () => import('@/views/Changelog.vue')
      },
      {
        path: 'user-admin',
        name: 'SysUser',
        meta: { title: '用户管理', requiresAdmin: true },
        component: () => import('@/views/SysUser.vue')
      },
      {
        path: 'rbac',
        name: 'Rbac',
        meta: { title: '角色权限', requiresAdmin: true },
        component: () => import('@/views/Rbac.vue')
      },
      { path: 'profile', name: 'Profile', meta: { title: '个人资料' }, component: () => import('@/views/Profile.vue') },
      { path: 'about', name: 'About', meta: { title: '关于我们' }, component: () => import('@/views/About.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const PUBLIC_NAMES = ['Login', 'AdminLogin', 'Register', 'ForgotPassword']

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

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (PUBLIC_NAMES.includes(to.name)) {
    if (token) {
      next({ path: '/home' })
      return
    }
    next()
    return
  }
  if (!token) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }
  const needsAdmin = to.matched.some((m) => m.meta?.requiresAdmin)
  if (needsAdmin && resolveAuthRole() !== 'admin') {
    ElMessage.warning('该页面需要管理员账号，请使用「管理员账号登录」')
    next({ path: '/home' })
    return
  }
  next()
})

export default router
