<template>
  <div class="page-container">
    <el-form :model="form" label-width="100px">
      <el-form-item label="关于我们内容">
        <el-input v-model="form.content" type="textarea" rows="15" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { aboutApi } from '@/api'
import { ElMessage } from 'element-plus'

const form = ref({ id: null, content: '' })

const loadData = async () => {
  const res = await aboutApi.get()
  if (res.data) {
    form.value = res.data
  }
}

const handleSave = async () => {
  await aboutApi.update(form.value)
  ElMessage.success('保存成功')
}

onMounted(loadData)
</script>

<style scoped>
.page-container { padding: 20px; max-width: 800px; }
</style>
