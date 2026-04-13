<template>
  <div class="auth-page">
    <div class="auth-bg" aria-hidden="true" />
    <el-card class="auth-card" shadow="never">
      <div class="auth-brand">
        <img class="auth-mark" :src="logoSrc" alt="logo" />
        <div>
          <h1>若冰代码手册</h1>
          <p class="auth-sub">{{ subtitle }}</p>
        </div>
      </div>
      <p v-if="heading" class="auth-heading">{{ heading }}</p>
      <slot />
      <div v-if="$slots.footer" class="auth-footer-links">
        <slot name="footer" />
      </div>
    </el-card>
    <p class="auth-page-hint">{{ bottomTagline }} · 管理后台</p>
  </div>
</template>

<script setup>
import logoSrc from '@/assets/logo.png'

defineProps({
  subtitle: { type: String, default: '管理后台' },
  heading: { type: String, default: '' },
  bottomTagline: { type: String, default: '若冰代码手册' }
})
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 16px 32px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, var(--rb-primary-light, #e8f4ff) 0%, #f5f7fa 45%, #ffffff 100%);
}

.auth-bg {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 20% 15%, rgba(64, 158, 255, 0.28) 0%, transparent 48%),
    radial-gradient(circle at 82% 12%, rgba(102, 177, 255, 0.22) 0%, transparent 40%);
  pointer-events: none;
}

.auth-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  border-radius: 20px !important;
  border: 1px solid var(--rb-border, rgba(15, 23, 42, 0.08)) !important;
  background: rgba(255, 255, 255, 0.98) !important;
  backdrop-filter: blur(12px);
  box-shadow: 0 14px 38px rgba(15, 23, 42, 0.12) !important;
  padding: 8px 4px 12px;
}

.auth-card :deep(.el-card__body) {
  padding: 28px 28px 32px;
}

.auth-brand {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  text-align: left;
}

.auth-mark {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  object-fit: cover;
  flex-shrink: 0;
  box-shadow: 0 8px 20px rgba(64, 158, 255, 0.35);
}

.auth-brand h1 {
  font-size: clamp(20px, 4.5vw, 22px);
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.02em;
  margin: 0 0 4px;
  line-height: 1.3;
}

.auth-sub {
  margin: 0;
  font-size: 13px;
  color: #64748b;
}

.auth-heading {
  font-size: 15px;
  font-weight: 600;
  color: #334155;
  margin: 0 0 18px;
}

.auth-footer-links {
  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px 20px;
  font-size: 14px;
}

.auth-footer-links a {
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
}

.auth-footer-links a:hover {
  text-decoration: underline;
}

.auth-page-hint {
  position: relative;
  z-index: 1;
  margin-top: 24px;
  font-size: 12px;
  color: rgba(100, 116, 139, 0.85);
  letter-spacing: 0.06em;
}

.auth-form :deep(.el-form-item__label) {
  font-weight: 500;
  color: #475569;
}

.auth-submit {
  width: 100%;
  margin-top: 8px;
  font-weight: 600;
  letter-spacing: 0.04em;
  border-radius: 10px !important;
}
</style>
