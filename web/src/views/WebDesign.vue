<template>
  <div class="page-container">
    <div class="toolbar">
      <el-button type="primary" @click="$router.push('/web-design/edit')">新增</el-button>
    </div>
    <el-table :data="list" border>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="tags" label="标签" />
      <el-table-column prop="views" label="浏览" width="80" />
      <el-table-column prop="likes" label="点赞" width="80" />
      <el-table-column prop="isHot" label="热门" width="80">
        <template #default="{ row }">{{ row.isHot ? '是' : '否' }}</template>
      </el-table-column>
      <el-table-column prop="isLatest" label="最新" width="80">
        <template #default="{ row }">{{ row.isLatest ? '是' : '否' }}</template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button size="small" @click="$router.push(`/web-design/edit/${row.id}`)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="page"
      :page-size="pageSize"
      :total="total"
      layout="total, prev, pager, next"
      @current-change="loadData"
      style="margin-top: 20px"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { webDesignApi } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'

const list = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

const loadData = async () => {
  const res = await webDesignApi.getList({ page: page.value, pageSize: pageSize.value })
  list.value = res.data.records
  total.value = res.data.total
}

const handleDelete = async (id) => {
  await ElMessageBox.confirm('确定删除？')
  await webDesignApi.delete(id)
  ElMessage.success('删除成功')
  loadData()
}

onMounted(loadData)
</script>

<style scoped>
.page-container { padding: 20px; }
.toolbar { margin-bottom: 15px; }
</style>
