<template>
  <div class="home">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card>
          <div class="stat-item">
            <div class="stat-value">{{ stats.webDesign }}</div>
            <div class="stat-label">网页设计</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="stat-item">
            <div class="stat-value">{{ stats.graduation }}</div>
            <div class="stat-label">毕业设计</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="stat-item">
            <div class="stat-value">{{ stats.feedback }}</div>
            <div class="stat-label">用户反馈</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="stat-item">
            <div class="stat-value">{{ stats.changelog }}</div>
            <div class="stat-label">更新日志</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { webDesignApi, graduationApi, feedbackApi, changelogApi } from '@/api'

const stats = ref({ webDesign: 0, graduation: 0, feedback: 0, changelog: 0 })

onMounted(async () => {
  try {
    const [wd, gp, fb, cl] = await Promise.all([
      webDesignApi.getList({ page: 1, pageSize: 1 }),
      graduationApi.getList({ page: 1, pageSize: 1 }),
      feedbackApi.getList(),
      changelogApi.getList()
    ])
    stats.value.webDesign = wd.data?.total || 0
    stats.value.graduation = gp.data?.total || 0
    stats.value.feedback = fb.data?.length || 0
    stats.value.changelog = cl.data?.length || 0
  } catch (e) {
    console.error(e)
  }
})
</script>

<style scoped>
.home { padding: 20px; }
.stat-item { text-align: center; padding: 20px; }
.stat-value { font-size: 32px; font-weight: bold; color: #409eff; }
.stat-label { margin-top: 10px; color: #666; }
</style>
