<template>
  <AuthPageShell subtitle="创建管理后台账号" heading="注册">
    <el-form :model="form" class="auth-form" @submit.prevent="submit" label-position="top">
      <el-form-item label="用户名">
        <el-input v-model="form.username" placeholder="3～32 个字符" size="large" clearable autocomplete="username" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input
          v-model="form.password"
          type="password"
          placeholder="至少 6 位"
          size="large"
          show-password
          autocomplete="new-password"
        />
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input
          v-model="form.confirm"
          type="password"
          placeholder="再次输入密码"
          size="large"
          show-password
          autocomplete="new-password"
        />
      </el-form-item>
      <el-form-item label="昵称（选填）">
        <el-input v-model="form.nickname" placeholder="默认与用户名相同" size="large" clearable />
      </el-form-item>
      <el-form-item label="邮箱（选填）">
        <el-input v-model="form.email" placeholder="用于找回密码，建议填写" size="large" clearable type="email" />
      </el-form-item>
      <el-button type="primary" native-type="submit" class="auth-submit" size="large" :loading="loading">
        注册并登录
      </el-button>
    </el-form>
    <template #footer>
      <router-link to="/login/admin">已有账号？去登录</router-link>
    </template>
  </AuthPageShell>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import AuthPageShell from '@/components/auth/AuthPageShell.vue'
import { authApi } from '@/api'

const router = useRouter()
const loading = ref(false)
const form = reactive({
  username: '',
  password: '',
  confirm: '',
  nickname: '',
  email: ''
})

const submit = async () => {
  if (form.password !== form.confirm) {
    ElMessage.warning('两次输入的密码不一致')
    return
  }
  loading.value = true
  try {
    const res = await authApi.register({
      username: form.username.trim(),
      password: form.password,
      nickname: form.nickname.trim() || undefined,
      email: form.email.trim() || undefined
    })
    if (res.code !== 200 || !res.data?.token) {
      ElMessage.error(res.message || '注册失败')
      return
    }
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('authRole', 'admin')
    localStorage.removeItem('appUser')
    if (res.data.user) {
      localStorage.setItem('adminUser', JSON.stringify(res.data.user))
    }
    ElMessage.success('注册成功')
    router.replace('/home')
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>
