<template>
  <div class="edit-container">
    <el-form :model="form" label-width="100px">
      <el-form-item label="标题">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="简介">
        <el-input v-model="form.description" type="textarea" rows="3" />
      </el-form-item>
      <el-form-item label="封面图片">
        <el-input v-model="form.coverImage" placeholder="图片URL" />
      </el-form-item>
      <el-form-item label="标签">
        <el-input v-model="form.tags" placeholder="多个标签用逗号分隔" />
      </el-form-item>
      <el-form-item label="详细内容">
        <el-input v-model="form.content" type="textarea" rows="10" />
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model="form.sortOrder" :min="0" />
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="form.isHot">热门推荐</el-checkbox>
        <el-checkbox v-model="form.isLatest">最新更新</el-checkbox>
        <el-checkbox v-model="form.status">上架</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { webDesignApi } from '@/api'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const form = ref({ title: '', description: '', coverImage: '', tags: '', content: '', sortOrder: 0, isHot: false, isLatest: false, status: true })

onMounted(async () => {
  if (route.params.id) {
    const res = await webDesignApi.getDetail(route.params.id)
    form.value = { ...form.value, ...res.data }
  }
})

const handleSave = async () => {
  await webDesignApi.save(form.value)
  ElMessage.success('保存成功')
  router.push('/web-design')
}
</script>

<style scoped>
.edit-container { padding: 20px; max-width: 800px; }
</style>
