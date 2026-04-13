<template>
  <div class="page-container profile-page">
    <div class="profile-head">
      <el-avatar :size="72" :src="form.avatar || defaultAvatar">{{ avatarText }}</el-avatar>
      <div>
        <h2>{{ form.nickname || form.username || '未命名用户' }}</h2>
        <p>{{ isAdmin ? '管理员账号资料' : '访客账号资料' }}</p>
      </div>
    </div>

    <el-form label-position="top" class="profile-form" @submit.prevent="save">
      <el-row :gutter="16">
        <el-col :xs="24" :md="12">
          <el-form-item label="用户名">
            <el-input v-model="form.username" disabled />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item label="角色">
            <el-input v-model="form.role" disabled />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="昵称">
        <el-input v-model="form.nickname" maxlength="32" placeholder="显示名称" />
      </el-form-item>

      <el-form-item label="头像 URL">
        <el-input v-model="form.avatar" placeholder="https://..." />
      </el-form-item>

      <el-form-item label="邮箱">
        <el-input v-model="form.email" type="email" placeholder="用于找回密码" />
      </el-form-item>

      <div class="actions">
        <el-button type="primary" :loading="saving" @click="save">保存资料</el-button>
        <el-button @click="load">重置</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { authApi } from '@/api'

const saving = ref(false)
const isAdmin = computed(() => localStorage.getItem('authRole') === 'admin')
const defaultAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=ruobing'

const form = reactive({
  id: null,
  username: '',
  nickname: '',
  avatar: '',
  email: '',
  role: ''
})

const avatarText = computed(() => {
  const n = form.nickname || form.username || ''
  return n ? n.slice(0, 1).toUpperCase() : 'U'
})

const load = async () => {
  const res = isAdmin.value ? await authApi.getMe() : await authApi.getAppMe()
  if (res.code !== 200 || !res.data) {
    ElMessage.error(res.message || '获取用户资料失败')
    return
  }
  Object.assign(form, {
    id: res.data.id,
    username: res.data.username || '',
    nickname: res.data.nickname || '',
    avatar: res.data.avatar || '',
    email: res.data.email || '',
    role: res.data.role || 'app_user'
  })
  if (isAdmin.value) {
    localStorage.setItem('adminUser', JSON.stringify(res.data))
  } else {
    localStorage.setItem('appUser', JSON.stringify(res.data))
  }
}

const save = async () => {
  saving.value = true
  try {
    const payload = {
      nickname: form.nickname,
      avatar: form.avatar,
      email: form.email
    }
    const res = isAdmin.value ? await authApi.updateMyProfile(payload) : await authApi.updateAppMeProfile(payload)
    if (res.code !== 200) {
      ElMessage.error(res.message || '保存失败')
      return
    }
    ElMessage.success('保存成功')
    await load()
  } finally {
    saving.value = false
  }
}

load()
</script>

<style scoped>
.profile-page {
  max-width: 920px;
}
.profile-head {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
}
.profile-head h2 {
  margin: 0;
  font-size: 20px;
}
.profile-head p {
  margin: 4px 0 0;
  color: #8a8a9a;
}
.actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}
</style>
