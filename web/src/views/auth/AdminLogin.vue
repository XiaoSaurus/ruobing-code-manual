<template>
  <AuthPageShell subtitle="管理后台 · 管理员登录" heading="登录">
    <el-form :model="form" class="auth-form" @submit.prevent="submit" label-position="top">
      <el-form-item label="用户名">
        <el-input v-model="form.username" placeholder="请输入用户名" size="large" clearable autocomplete="username" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input
          v-model="form.password"
          type="password"
          placeholder="请输入密码"
          size="large"
          show-password
          clearable
          autocomplete="current-password"
        />
      </el-form-item>
      <el-button type="primary" native-type="submit" class="auth-submit" size="large" :loading="loading">
        登录
      </el-button>
    </el-form>
    <template #footer>
      <router-link to="/register">注册账号</router-link>
      <router-link to="/forgot-password">忘记密码</router-link>
      <router-link to="/login">返回访客登录</router-link>
    </template>
  </AuthPageShell>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import AuthPageShell from '@/components/auth/AuthPageShell.vue'
import { authApi } from '@/api'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const form = reactive({ username: '', password: '' })

const submit = async () => {
  if (!form.username.trim() || !form.password) {
    ElMessage.warning('请输入用户名和密码')
    return
  }
  loading.value = true
  try {
    const res = await authApi.login({
      username: form.username.trim(),
      password: form.password
    })
    if (res.code !== 200 || !res.data?.token) {
      ElMessage.error(res.message || '登录失败')
      return
    }
    const role = res.data?.user?.role
    if (role !== 'admin') {
      ElMessage.error('该账号不是管理员账号，请使用管理员账号登录')
      return
    }
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('authRole', role)
    localStorage.removeItem('appUser')
    if (res.data.user) {
      localStorage.setItem('adminUser', JSON.stringify(res.data.user))
    }
    ElMessage.success('登录成功')
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/home'
    router.replace(redirect.startsWith('/') ? redirect : '/home')
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>
