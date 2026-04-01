<template>
  <div class="page-container">
    <div class="toolbar">
      <el-button type="primary" @click="dialogVisible = true">新增版本</el-button>
    </div>
    <el-table :data="list" border>
      <el-table-column prop="version" label="版本号" width="120" />
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="type" label="类型" width="100">
        <template #default="{ row }">
          <el-tag :type="row.type === 'feature' ? 'success' : 'info'">{{ row.type === 'feature' ? '新功能' : '修复' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="时间" width="180" />
    </el-table>

    <el-dialog v-model="dialogVisible" title="新增版本" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="版本号"><el-input v-model="form.version" /></el-form-item>
        <el-form-item label="标题"><el-input v-model="form.title" /></el-form-item>
        <el-form-item label="内容"><el-input v-model="form.content" type="textarea" rows="4" /></el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="form.type">
            <el-radio label="feature">新功能</el-radio>
            <el-radio label="fix">修复优化</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { changelogApi } from '@/api'
import { ElMessage } from 'element-plus'

const list = ref([])
const dialogVisible = ref(false)
const form = ref({ version: '', title: '', content: '', type: 'feature' })

const loadData = async () => {
  const res = await changelogApi.getList()
  list.value = res.data || []
}

const handleSave = async () => {
  await changelogApi.save(form.value)
  ElMessage.success('保存成功')
  dialogVisible.value = false
  form.value = { version: '', title: '', content: '', type: 'feature' }
  loadData()
}

onMounted(loadData)
</script>

<style scoped>
.page-container { padding: 20px; }
.toolbar { margin-bottom: 15px; }
</style>
