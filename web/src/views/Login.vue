<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2>若冰代码手册</h2>
      <p>管理后台登录</p>
      <el-form :model="form" @submit.prevent="handleLogin">
        <el-form-item label="管理员密钥">
          <el-input v-model="form.key" type="password" placeholder="请输入管理员密钥" />
        </el-form-item>
        <el-button type="primary" native-type="submit" style="width: 100%">登录</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const form = reactive({ key: '' })

const handleLogin = () => {
  if (form.key === 'admin123') {
    localStorage.setItem('token', 'admin-token')
    router.push('/')
  } else {
    ElMessage.error('密钥错误')
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.login-card {
  width: 400px;
  text-align: center;
}
h2 { margin-bottom: 10px; color: #333; }
p { margin-bottom: 20px; color: #666; }
</style>
