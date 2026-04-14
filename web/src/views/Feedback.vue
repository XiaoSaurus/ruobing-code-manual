<template>
  <div class="page-container">
    <div class="table-scroll">
    <el-table :data="list" border size="small">
      <el-table-column prop="content" label="反馈内容" show-overflow-tooltip />
      <el-table-column prop="contact" label="联系方式" width="150" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status ? 'success' : 'warning'">{{ row.status ? '已处理' : '待处理' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="时间" width="190">
        <template #default="{ row }">{{ formatDateTime(row.createTime) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button size="small" v-if="!row.status" @click="handleReply(row)">回复</el-button>
          <span v-else style="color: #67c23a">{{ row.reply }}</span>
        </template>
      </el-table-column>
    </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { feedbackApi } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatDateTime } from '@/utils/format'

const list = ref([])

const loadData = async () => {
  const res = await feedbackApi.getList()
  if (res.code !== 200) {
    ElMessage.error(res.message || '反馈数据加载失败')
    return
  }
  list.value = res.data || []
}

const handleReply = async (row) => {
  const { value } = await ElMessageBox.prompt('请输入回复内容', '回复反馈')
  if (!value || !value.trim()) {
    ElMessage.warning('回复内容不能为空')
    return
  }
  const res = await feedbackApi.reply(row.id, value.trim())
  if (res.code !== 200) {
    ElMessage.error(res.message || '回复失败')
    return
  }
  ElMessage.success('回复成功')
  loadData()
}

onMounted(loadData)
</script>

