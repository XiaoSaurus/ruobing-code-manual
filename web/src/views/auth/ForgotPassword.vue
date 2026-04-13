<template>
  <AuthPageShell subtitle="通过绑定邮箱重置密码" heading="忘记密码">
    <el-alert
      class="auth-tip"
      type="info"
      :closable="false"
      show-icon
      title="请填写账号与注册时绑定的邮箱；若未绑定邮箱，请联系管理员或在「用户管理」中补充邮箱后再试。"
    />
    <el-form :model="form" class="auth-form" @submit.prevent="submit" label-position="top">
      <el-form-item label="用户名">
        <el-input v-model="form.username" placeholder="系统登录用户名" size="large" clearable />
      </el-form-item>
      <el-form-item label="绑定邮箱">
        <el-input v-model="form.email" placeholder="与账号一致的邮箱" size="large" clearable type="email" />
      </el-form-item>
      <el-form-item label="新密码">
        <el-input
          v-model="form.newPassword"
          type="password"
          placeholder="6～64 位"
          size="large"
          show-password
          autocomplete="new-password"
        />
      </el-form-item>
      <el-form-item label="确认新密码">
        <el-input
          v-model="form.confirm"
          type="password"
          placeholder="再次输入新密码"
          size="large"
          show-password
          autocomplete="new-password"
        />
      </el-form-item>
      <el-button type="primary" native-type="submit" class="auth-submit" size="large" :loading="loading">
        重置密码
      </el-button>
    </el-form>
    <template #footer>
      <router-link to="/login/admin">返回管理员登录</router-link>
      <router-link to="/register">注册账号</router-link>
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
  email: '',
  newPassword: '',
  confirm: ''
})

const submit = async () => {
  if (form.newPassword !== form.confirm) {
    ElMessage.warning('两次输入的新密码不一致')
    return
  }
  loading.value = true
  try {
    const res = await authApi.forgotPassword({
      username: form.username.trim(),
      email: form.email.trim(),
      newPassword: form.newPassword
    })
    if (res.code !== 200) {
      ElMessage.error(res.message || '重置失败')
      return
    }
    ElMessage.success('密码已重置，请使用新密码登录')
    router.replace('/login')
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-tip {
  margin-bottom: 18px;
}
.auth-tip :deep(.el-alert__title) {
  font-size: 13px;
  line-height: 1.5;
}
</style>
