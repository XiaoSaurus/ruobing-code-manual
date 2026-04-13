<template>
  <AuthPageShell subtitle="访客登录 · 手机验证码 / 微信扫码" heading="登录" bottom-tagline="若冰代码手册">
    <el-tabs v-model="activeTab" class="login-tabs" stretch>
      <el-tab-pane label="手机验证码" name="sms">
        <el-form class="auth-form" label-position="top" @submit.prevent="submitSms">
          <el-form-item label="手机号">
            <el-input
              v-model="smsForm.phone"
              maxlength="11"
              placeholder="11 位中国大陆手机号"
              size="large"
              clearable
              autocomplete="tel"
            />
          </el-form-item>
          <el-form-item label="验证码">
            <div class="sms-row">
              <el-input
                v-model="smsForm.code"
                maxlength="6"
                placeholder="短信验证码"
                size="large"
                clearable
                autocomplete="one-time-code"
              />
              <el-button
                size="large"
                :disabled="smsCooldown > 0 || smsSending"
                :loading="smsSending"
                @click="sendSms"
              >
                {{ smsCooldown > 0 ? `${smsCooldown}s` : '获取验证码' }}
              </el-button>
            </div>
          </el-form-item>
          <el-button type="primary" native-type="submit" class="auth-submit" size="large" :loading="loading">
            登录
          </el-button>
          <p class="auth-muted">未注册手机号验证通过后将自动创建账号；与小程序共用用户库。</p>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="微信扫码" name="wechat">
        <p class="wechat-desc">
          使用微信开放平台「网站应用」扫码登录。若该微信已绑定用户则直接登录，否则自动注册并保存微信唯一标识（web_openid）。
        </p>
        <el-button type="primary" class="auth-submit" size="large" :loading="wxLoading" @click="startWechatLogin">
          使用微信登录
        </el-button>
        <p class="auth-muted">需在开放平台创建网站应用，并配置授权回调域与后端 wxweb 参数一致。</p>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <router-link to="/login/admin">管理员账号登录</router-link>
    </template>
  </AuthPageShell>
</template>

<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import AuthPageShell from '@/components/auth/AuthPageShell.vue'
import { authApi } from '@/api'

const route = useRoute()
const router = useRouter()
const activeTab = ref('sms')
const loading = ref(false)
const wxLoading = ref(false)
const smsSending = ref(false)
const smsCooldown = ref(0)
let smsTimer = null

const smsForm = reactive({ phone: '', code: '' })

function persistAppSession(res) {
  if (res.code !== 200 || !res.data?.token) {
    ElMessage.error(res.message || '登录失败')
    return false
  }
  localStorage.setItem('token', res.data.token)
  localStorage.setItem('authRole', 'app')
  localStorage.removeItem('adminUser')
  if (res.data.user) {
    localStorage.setItem('appUser', JSON.stringify(res.data.user))
  }
  return true
}

const submitSms = async () => {
  const phone = smsForm.phone.trim()
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    ElMessage.warning('请输入正确的手机号')
    return
  }
  if (!smsForm.code.trim()) {
    ElMessage.warning('请输入验证码')
    return
  }
  loading.value = true
  try {
    const res = await authApi.loginAppSms({ phone, code: smsForm.code.trim() })
    if (!persistAppSession(res)) return
    ElMessage.success('登录成功')
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/home'
    router.replace(redirect.startsWith('/') ? redirect : '/home')
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const sendSms = async () => {
  const phone = smsForm.phone.trim()
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    ElMessage.warning('请先填写 11 位手机号')
    return
  }
  if (smsCooldown.value > 0) return
  smsSending.value = true
  try {
    const res = await authApi.sendAppSms({ phone })
    if (res.code !== 200) {
      ElMessage.error(res.message || '发送失败')
      return
    }
    ElMessage.success('验证码已发送（开发环境见后端日志或使用测试码）')
    smsCooldown.value = 60
    smsTimer = setInterval(() => {
      smsCooldown.value -= 1
      if (smsCooldown.value <= 0 && smsTimer) {
        clearInterval(smsTimer)
        smsTimer = null
      }
    }, 1000)
  } catch (e) {
    console.error(e)
  } finally {
    smsSending.value = false
  }
}

const startWechatLogin = async () => {
  wxLoading.value = true
  try {
    const res = await authApi.getWechatAuthorizeUrl()
    if (res.code !== 200 || !res.data?.url) {
      ElMessage.error(res.message || '未开启微信网站登录或配置不完整')
      return
    }
    window.location.href = res.data.url
  } catch (e) {
    console.error(e)
  } finally {
    wxLoading.value = false
  }
}

const exchangeTicketIfAny = async () => {
  const ticket = route.query.ticket
  if (!ticket) return
  loading.value = true
  try {
    const res = await authApi.exchangeOAuthTicket({ ticket: String(ticket) })
    if (!persistAppSession(res)) {
      await router.replace({ path: '/login', query: {} })
      return
    }
    ElMessage.success('登录成功')
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/home'
    await router.replace(redirect.startsWith('/') ? redirect : '/home')
  } catch (e) {
    console.error(e)
    await router.replace({ path: '/login', query: {} })
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (route.query.error === 'wechat') {
    const reason = route.query.reason
    ElMessage.error(typeof reason === 'string' && reason ? decodeURIComponent(reason) : '微信登录失败')
  }
  if (route.query.ticket) {
    await exchangeTicketIfAny()
  }
})

onUnmounted(() => {
  if (smsTimer) clearInterval(smsTimer)
})
</script>

<style scoped>
.login-tabs {
  width: 100%;
}
.login-tabs :deep(.el-tabs__header) {
  margin-bottom: 20px;
}
.sms-row {
  display: flex;
  gap: 10px;
  width: 100%;
}
.sms-row .el-input {
  flex: 1;
}
.wechat-desc {
  font-size: 13px;
  color: #64748b;
  line-height: 1.6;
  margin: 0 0 16px;
}
.auth-muted {
  margin: 14px 0 0;
  font-size: 12px;
  color: #94a3b8;
  line-height: 1.5;
}
</style>
