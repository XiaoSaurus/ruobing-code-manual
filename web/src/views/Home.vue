<template>
  <div class="home">
    <!-- 顶部统计数据 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6">
        <el-card class="stat-card web-design" shadow="hover">
          <div class="stat-content">
            <div class="stat-left">
              <div class="stat-icon">
                <el-icon><Monitor /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ stats.webDesign }}</div>
                <div class="stat-label">网页设计</div>
              </div>
            </div>
            <div class="stat-trend up">
              <el-icon><Top /></el-icon>
              <span>+{{ Math.floor(Math.random() * 3 + 1) }}</span>
            </div>
          </div>
          <div class="stat-bar">
            <div class="bar-fill" style="width: 75%; background: linear-gradient(90deg, #409eff, #66b1ff);"></div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stat-card graduation" shadow="hover">
          <div class="stat-content">
            <div class="stat-left">
              <div class="stat-icon">
                <el-icon><School /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ stats.graduation }}</div>
                <div class="stat-label">毕业设计</div>
              </div>
            </div>
            <div class="stat-trend up">
              <el-icon><Top /></el-icon>
              <span>+{{ Math.floor(Math.random() * 2 + 1) }}</span>
            </div>
          </div>
          <div class="stat-bar">
            <div class="bar-fill" style="width: 60%; background: linear-gradient(90deg, #67c23a, #85ce61);"></div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stat-card feedback" shadow="hover">
          <div class="stat-content">
            <div class="stat-left">
              <div class="stat-icon">
                <el-icon><ChatDotRound /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ stats.feedback }}</div>
                <div class="stat-label">用户反馈</div>
              </div>
            </div>
            <div class="stat-trend" :class="stats.feedback > 0 ? 'up' : 'neutral'">
              <el-icon v-if="stats.feedback > 0"><Top /></el-icon>
              <el-icon v-else><Minus /></el-icon>
              <span>0</span>
            </div>
          </div>
          <div class="stat-bar">
            <div class="bar-fill" style="width: 20%; background: linear-gradient(90deg, #e6a23c, #ebb563);"></div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stat-card changelog" shadow="hover">
          <div class="stat-content">
            <div class="stat-left">
              <div class="stat-icon">
                <el-icon><Document /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ stats.changelog }}</div>
                <div class="stat-label">更新日志</div>
              </div>
            </div>
            <div class="stat-trend up">
              <el-icon><Top /></el-icon>
              <span>new</span>
            </div>
          </div>
          <div class="stat-bar">
            <div class="bar-fill" style="width: 10%; background: linear-gradient(90deg, #f56c6c, #f78989);"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 系统用户统计 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6">
        <el-card class="stat-card sys-user" shadow="hover">
          <div class="stat-content">
            <div class="stat-left">
              <div class="stat-icon">
                <el-icon><UserFilled /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ userStats.total }}</div>
                <div class="stat-label">系统用户</div>
              </div>
            </div>
            <div class="stat-trend up">
              <el-icon><Top /></el-icon>
              <span>+{{ userStats.total }}</span>
            </div>
          </div>
          <div class="stat-bar">
            <div class="bar-fill" :style="{ width: '100%', background: 'linear-gradient(90deg, #9c27b0, #e040fb)' }"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card user-active" shadow="hover">
          <div class="stat-content">
            <div class="stat-left">
              <div class="stat-icon">
                <el-icon><Avatar /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ userStats.active }}</div>
                <div class="stat-label">活跃用户</div>
              </div>
            </div>
            <div class="stat-trend up">
              <el-icon><Top /></el-icon>
              <span>{{ ((userStats.active / (userStats.total || 1)) * 100).toFixed(0) }}%</span>
            </div>
          </div>
          <div class="stat-bar">
            <div class="bar-fill" :style="{ width: ((userStats.active / (userStats.total || 1)) * 100) + '%', background: 'linear-gradient(90deg, #e040fb, #ea80fc)' }"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card user-role" shadow="hover">
          <div class="stat-content">
            <div class="stat-left">
              <div class="stat-icon">
                <el-icon><User /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ userStats.total - userStats.active }}</div>
                <div class="stat-label">禁用账号</div>
              </div>
            </div>
            <div class="stat-trend neutral">
              <el-icon><Minus /></el-icon>
              <span>inactive</span>
            </div>
          </div>
          <div class="stat-bar">
            <div class="bar-fill" :style="{ width: ((userStats.total - userStats.active) / (userStats.total || 1) * 100) + '%', background: 'linear-gradient(90deg, #909399, #c0c4cc)' }"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card user-list" shadow="hover">
          <div class="stat-content">
            <div class="stat-left">
              <div class="stat-icon">
                <el-icon><List /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ recentUsers.length }}</div>
                <div class="stat-label">最近注册</div>
              </div>
            </div>
            <div class="stat-trend up">
              <el-icon><View /></el-icon>
              <span>latest</span>
            </div>
          </div>
          <div class="stat-bar">
            <div class="bar-fill" style="width: 50%; background: linear-gradient(90deg, #00bcd4, #26c6da);"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 用户图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>👥 用户角色分布</span>
              <el-tag type="purple" size="small">实时</el-tag>
            </div>
          </template>
          <div ref="userRoleChartRef" class="chart-container-bar"></div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>📅 用户注册趋势（近7天）</span>
              <el-tag type="success" size="small">实时</el-tag>
            </div>
          </template>
          <div ref="userTrendChartRef" class="chart-container-bar"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="16">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>📈 内容增长趋势（近7天）</span>
              <el-tag type="success" size="small">实时</el-tag>
            </div>
          </template>
          <div ref="growthChartRef" class="chart-container"></div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>📊 内容分布</span>
            </div>
          </template>
          <div ref="pieChartRef" class="chart-container-pie"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 底部图表 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>🔥 内容热度排行 TOP 5</span>
            </div>
          </template>
          <div ref="barChartRef" class="chart-container-bar"></div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>🎯 互动数据统计</span>
            </div>
          </template>
          <div class="interaction-stats">
            <div class="interaction-item">
              <div class="interaction-icon views">
                <el-icon><View /></el-icon>
              </div>
              <div class="interaction-info">
                <div class="interaction-value">{{ totalViews.toLocaleString() }}</div>
                <div class="interaction-label">总浏览量</div>
              </div>
              <div class="interaction-bar">
                <div class="ib" :style="{ width: (totalViews / (totalViews + totalLikes) * 100) + '%', background: '#409eff' }"></div>
              </div>
            </div>
            <div class="interaction-item">
              <div class="interaction-icon likes">
                <el-icon><Star /></el-icon>
              </div>
              <div class="interaction-info">
                <div class="interaction-value">{{ totalLikes.toLocaleString() }}</div>
                <div class="interaction-label">总点赞量</div>
              </div>
              <div class="interaction-bar">
                <div class="ib" :style="{ width: (totalLikes / (totalViews + totalLikes) * 100) + '%', background: '#f56c6c' }"></div>
              </div>
            </div>
            <div class="interaction-item">
              <div class="interaction-icon ratio">
                <el-icon><DataLine /></el-icon>
              </div>
              <div class="interaction-info">
                <div class="interaction-value">{{ likeRatio }}%</div>
                <div class="interaction-label">点赞率</div>
              </div>
              <div class="interaction-bar">
                <div class="ib" :style="{ width: likeRatio + '%', background: '#67c23a' }"></div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onUnmounted, computed } from 'vue'
import * as echarts from 'echarts'
import { webDesignApi, graduationApi, feedbackApi, changelogApi, sysUserApi } from '@/api'
import { Monitor, School, ChatDotRound, Document, Top, Minus, View, Star, DataLine, UserFilled, Avatar, User } from '@element-plus/icons-vue'

const stats = ref({ webDesign: 0, graduation: 0, feedback: 0, changelog: 0 })
const userStats = ref({ total: 0, active: 0 })
const recentUsers = ref([])
const totalViews = ref(0)
const totalLikes = ref(0)
const hotList = ref([])

let growthChart = null
let pieChart = null
let barChart = null
let userRoleChart = null
let userTrendChart = null
const growthChartRef = ref(null)
const pieChartRef = ref(null)
const barChartRef = ref(null)
const userRoleChartRef = ref(null)
const userTrendChartRef = ref(null)

const likeRatio = computed(() => {
  if (totalViews.value === 0) return 0
  return ((totalLikes.value / totalViews.value) * 100).toFixed(1)
})

// 生成近7天数据
function getLast7Days() {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(`${d.getMonth() + 1}/${d.getDate()}`)
  }
  return days
}

// 生成模拟增长数据
function generateGrowthData() {
  return {
    webDesign: [1, 2, 3, 4, 5, 5, 6],
    graduation: [0, 1, 2, 3, 4, 5, 6],
  }
}

function initGrowthChart() {
  if (!growthChartRef.value) return
  growthChart = echarts.init(growthChartRef.value)
  const days = getLast7Days()
  const data = generateGrowthData()
  const option = {
    tooltip: { trigger: 'axis' },
    legend: {
      data: ['网页设计', '毕业设计'],
      bottom: 0
    },
    grid: { top: 20, right: 20, bottom: 40, left: 50 },
    xAxis: {
      type: 'category',
      data: days,
      axisLine: { lineStyle: { color: '#e4e7ed' } },
      axisLabel: { color: '#606266' }
    },
    yAxis: {
      type: 'value',
      min: 0,
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#f0f0f0', type: 'dashed' } },
      axisLabel: { color: '#606266' }
    },
    series: [
      {
        name: '网页设计',
        type: 'line',
        smooth: true,
        data: data.webDesign,
        itemStyle: { color: '#409eff' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(64,158,255,0.3)' },
            { offset: 1, color: 'rgba(64,158,255,0.05)' }
          ])
        },
        symbol: 'circle',
        symbolSize: 6
      },
      {
        name: '毕业设计',
        type: 'line',
        smooth: true,
        data: data.graduation,
        itemStyle: { color: '#67c23a' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(103,194,58,0.3)' },
            { offset: 1, color: 'rgba(103,194,58,0.05)' }
          ])
        },
        symbol: 'circle',
        symbolSize: 6
      }
    ]
  }
  growthChart.setOption(option)
}

function initPieChart() {
  if (!pieChartRef.value) return
  pieChart = echarts.init(pieChartRef.value)
  const option = {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { bottom: 0, left: 'center' },
    series: [{
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['50%', '45%'],
      avoidLabelOverlap: true,
      itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
      label: { show: true, formatter: '{b}\n{d}%', fontSize: 12 },
      emphasis: {
        label: { show: true, fontSize: 14, fontWeight: 'bold' }
      },
      data: [
        { value: stats.value.webDesign, name: '网页设计', itemStyle: { color: '#409eff' } },
        { value: stats.value.graduation, name: '毕业设计', itemStyle: { color: '#67c23a' } }
      ]
    }]
  }
  pieChart.setOption(option)
}

function initBarChart() {
  if (!barChartRef.value) return
  barChart = echarts.init(barChartRef.value)
  const top5 = hotList.value.slice(0, 5)
  const option = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { top: 10, right: 20, bottom: 10, left: 10, containLabel: true },
    xAxis: { type: 'value', axisLine: { show: false }, splitLine: { show: false }, axisLabel: { show: false } },
    yAxis: {
      type: 'category',
      data: top5.map(i => i.title?.substring(0, 10) + '...'),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#606266', fontSize: 12 }
    },
    series: [{
      type: 'bar',
      data: top5.map((i, idx) => ({
        value: i.views,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#409eff' },
            { offset: 1, color: '#79bbff' }
          ]),
          borderRadius: [0, 4, 4, 0]
        }
      })),
      barWidth: 16,
      label: { show: true, position: 'right', color: '#909399', fontSize: 12 }
    }]
  }
  barChart.setOption(option)
}

function initUserRoleChart() {
  if (!userRoleChartRef.value) return
  userRoleChart = echarts.init(userRoleChartRef.value)

  const roleCount = {}
  ;[...(allUsers || [])].forEach(u => {
    const role = u.role || '未知'
    roleCount[role] = (roleCount[role] || 0) + 1
  })

  const colors = {
    admin: '#9c27b0',
    editor: '#e040fb',
    unknown: '#909399'
  }
  const roleData = Object.entries(roleCount).map(([name, value]) => ({
    name,
    value,
    itemStyle: { color: colors[name] || '#909399' }
  }))

  const option = {
    tooltip: { trigger: 'item', formatter: '{b}: {c}人 ({d}%)' },
    legend: { bottom: 0, left: 'center' },
    series: [{
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['50%', '45%'],
      avoidLabelOverlap: true,
      itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
      label: { show: true, formatter: '{b}\n{c}人', fontSize: 13 },
      emphasis: {
        label: { show: true, fontSize: 14, fontWeight: 'bold' }
      },
      data: roleData.length > 0 ? roleData : [{ name: '暂无数据', value: 0, itemStyle: { color: '#f0f0f0' } }]
    }]
  }
  userRoleChart.setOption(option)
}

function initUserTrendChart() {
  if (!userTrendChartRef.value) return
  userTrendChart = echarts.init(userTrendChartRef.value)

  const days = getLast7Days() // ['4/3', '4/4', ...]

  // 从 create_time 统计近7天每天的注册量
  const counts = new Array(7).fill(0)
  const now = new Date()
  if (allUsers && allUsers.length > 0) {
    allUsers.forEach(u => {
      const createDate = new Date(u.createTime || u.create_time || 0)
      const diff = Math.floor((now - createDate) / (1000 * 60 * 60 * 24))
      const idx = 6 - diff // diff=0 → 今天(idx=6), diff=6 → 第1天(idx=0)
      if (idx >= 0 && idx < 7) counts[idx]++
    })
  }

  const option = {
    tooltip: { trigger: 'axis' },
    grid: { top: 20, right: 20, bottom: 40, left: 50 },
    xAxis: {
      type: 'category',
      data: days,
      axisLine: { lineStyle: { color: '#e4e7ed' } },
      axisLabel: { color: '#606266' }
    },
    yAxis: {
      type: 'value',
      min: 0,
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#f0f0f0', type: 'dashed' } },
      axisLabel: { color: '#606266' }
    },
    series: [{
      name: '新增用户',
      type: 'bar',
      data: counts,
      tooltip: { trigger: 'axis', formatter: params => `${params[0].name}<br/>新增用户：<b>${params[0].value}</b> 人` },
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#9c27b0' },
          { offset: 1, color: '#e040fb' }
        ]),
        borderRadius: [4, 4, 0, 0]
      },
      barWidth: 28,
      label: { show: true, position: 'top', color: '#9c27b0', fontSize: 12 }
    }]
  }
  userTrendChart.setOption(option)
}

let allUsers = []

function updateCharts() {
  if (growthChart) initGrowthChart()
  if (pieChart) initPieChart()
  if (barChart) initBarChart()
  if (userRoleChart) initUserRoleChart()
  if (userTrendChart) initUserTrendChart()
}

let resizeObserver = null

onMounted(async () => {
  try {
    const [wd, gp, fb, cl, us] = await Promise.all([
      webDesignApi.getList({ page: 1, pageSize: 100 }),
      graduationApi.getList({ page: 1, pageSize: 100 }),
      feedbackApi.getList(),
      changelogApi.getList(),
      sysUserApi.getStats()
    ])

    stats.value.webDesign = wd.data?.total || 0
    stats.value.graduation = gp.data?.total || 0
    stats.value.feedback = fb.data?.length || 0
    stats.value.changelog = cl.data?.length || 0

    userStats.value = {
      total: us.data?.total || 0,
      active: us.data?.active || 0
    }

    const allUsersResp = await sysUserApi.getAll()
    allUsers = allUsersResp.data || []
    recentUsers.value = allUsers.slice(0, 5)

    const webRecords = wd.data?.records || []
    const gradRecords = gp.data?.records || []
    const allRecords = [...webRecords, ...gradRecords]

    totalViews.value = allRecords.reduce((sum, i) => sum + (i.views || 0), 0)
    totalLikes.value = allRecords.reduce((sum, i) => sum + (i.likes || 0), 0)
    hotList.value = [...webRecords, ...gradRecords]
      .filter(i => i.views > 0)
      .sort((a, b) => b.views - a.views)

    await nextTick()
    initGrowthChart()
    initPieChart()
    initBarChart()
    initUserRoleChart()
    initUserTrendChart()

    // 响应窗口大小变化
    resizeObserver = new ResizeObserver(() => {
      growthChart?.resize()
      pieChart?.resize()
      barChart?.resize()
      userRoleChart?.resize()
      userTrendChart?.resize()
    })
    if (growthChartRef.value) resizeObserver.observe(growthChartRef.value)

  } catch (e) {
    console.error(e)
  }
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  growthChart?.dispose()
  pieChart?.dispose()
  barChart?.dispose()
  userRoleChart?.dispose()
  userTrendChart?.dispose()
})
</script>

<style scoped>
.home { padding: 20px; background: #f5f7fa; min-height: 100vh; }

/* 统计卡片 */
.stat-card {
  border: none;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}
.stat-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }

.stat-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.stat-left { display: flex; align-items: center; gap: 14px; }
.stat-icon {
  width: 52px; height: 52px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 24px; color: #fff;
}
.web-design .stat-icon { background: linear-gradient(135deg, #409eff, #66b1ff); }
.graduation .stat-icon { background: linear-gradient(135deg, #67c23a, #85ce61); }
.feedback .stat-icon { background: linear-gradient(135deg, #e6a23c, #ebb563); }
.changelog .stat-icon { background: linear-gradient(135deg, #f56c6c, #f78989); }
.sys-user .stat-icon { background: linear-gradient(135deg, #9c27b0, #e040fb); }
.user-active .stat-icon { background: linear-gradient(135deg, #e040fb, #ea80fc); }
.user-role .stat-icon { background: linear-gradient(135deg, #909399, #c0c4cc); }
.user-list .stat-icon { background: linear-gradient(135deg, #00bcd4, #26c6da); }

.stat-value { font-size: 30px; font-weight: 800; color: #303133; line-height: 1; }
.stat-label { font-size: 13px; color: #909399; margin-top: 4px; }

.stat-trend {
  display: flex; align-items: center; gap: 2px;
  font-size: 12px; padding: 3px 8px; border-radius: 20px;
}
.stat-trend.up { color: #67c23a; background: #f0f9eb; }
.stat-trend.neutral { color: #909399; background: #f4f4f5; }

.stat-bar { height: 6px; background: #f0f2f5; border-radius: 3px; overflow: hidden; }
.bar-fill { height: 100%; border-radius: 3px; transition: width 1s ease; }

/* 图表区域 */
.chart-row { margin-top: 20px; }
.chart-card { border-radius: 12px; border: none; }
.card-header {
  display: flex; justify-content: space-between; align-items: center;
  font-weight: 600; font-size: 15px; color: #303133;
}
.chart-container { height: 260px; }
.chart-container-pie { height: 260px; }
.chart-container-bar { height: 260px; }

/* 互动统计 */
.interaction-stats { display: flex; flex-direction: column; gap: 20px; padding: 8px 0; }
.interaction-item { display: flex; align-items: center; gap: 14px; }
.interaction-icon {
  width: 42px; height: 42px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; color: #fff; flex-shrink: 0;
}
.interaction-icon.views { background: linear-gradient(135deg, #409eff, #66b1ff); }
.interaction-icon.likes { background: linear-gradient(135deg, #f56c6c, #f78989); }
.interaction-icon.ratio { background: linear-gradient(135deg, #67c23a, #85ce61); }

.interaction-info { min-width: 100px; }
.interaction-value { font-size: 22px; font-weight: 700; color: #303133; }
.interaction-label { font-size: 12px; color: #909399; }

.interaction-bar {
  flex: 1; height: 8px; background: #f0f2f5; border-radius: 4px; overflow: hidden;
}
.ib { height: 100%; border-radius: 4px; transition: width 1s ease; }
</style>
