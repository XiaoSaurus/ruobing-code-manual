<template>
  <div class="page-container">
    <div class="toolbar">
      <el-button type="primary" @click="dialogVisible = true">新增版本</el-button>
    </div>
    <div class="table-scroll">
    <el-table :data="list" border size="small">
      <el-table-column prop="version" label="版本号" width="120" />
      <el-table-column prop="title" label="标题" />
      <el-table-column label="更新内容" min-width="260">
        <template #default="{ row }">
          <div class="content-preview markdown-card" v-html="toHtml(row.content)" />
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型" width="100">
        <template #default="{ row }">
          <el-tag :type="row.type === 'feature' ? 'success' : 'info'">{{ row.type === 'feature' ? '新功能' : '修复' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="时间" width="190">
        <template #default="{ row }">{{ formatDateTime(row.createTime) }}</template>
      </el-table-column>
    </el-table>
    </div>

    <el-dialog v-model="dialogVisible" title="新增版本" width="500px">
      <el-form :model="form" label-width="80px" label-position="top">
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
import { markdownToHtml } from '@/utils/markdown'
import { formatDateTime } from '@/utils/format'

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

const toHtml = (content) => markdownToHtml(content || '', '#67c23a')

onMounted(loadData)
</script>

<style scoped>
.toolbar { margin-bottom: 0; }
.content-preview {
  max-height: 160px;
  overflow: auto;
  font-size: 13px;
  line-height: 1.7;
}
.markdown-card {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #ebeef5;
  background: #f8fafc;
}
.markdown-card :deep(p) {
  margin: 0 0 8px;
}
.markdown-card :deep(h1),
.markdown-card :deep(h2),
.markdown-card :deep(h3) {
  margin: 0 0 8px;
  font-size: 14px;
}
.markdown-card :deep(ul),
.markdown-card :deep(ol) {
  margin: 0;
  padding-left: 18px;
}
</style>
