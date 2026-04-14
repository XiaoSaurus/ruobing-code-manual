<template>
  <div class="page-container">
    <div class="toolbar">
      <el-button type="primary" @click="$router.push('/graduation/edit')">新增</el-button>
    </div>
    <div class="table-scroll">
    <el-table :data="list" border size="small">
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="tags" label="标签" />
      <el-table-column prop="views" label="浏览" width="80" />
      <el-table-column prop="likes" label="点赞" width="80" />
      <el-table-column prop="favorites" label="收藏" width="80" />
      <el-table-column prop="isHot" label="热门" width="80">
        <template #default="{ row }">{{ row.isHot ? '是' : '否' }}</template>
      </el-table-column>
      <el-table-column label="创建时间" width="180">
        <template #default="{ row }">{{ formatDateTime(row.createTime) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button size="small" @click="$router.push(`/graduation/edit/${row.id}`)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>
    <el-pagination
      class="pagination-bar"
      v-model:current-page="page"
      :page-size="pageSize"
      :total="total"
      layout="total, prev, pager, next"
      size="small"
      @current-change="loadData"
      style="margin-top: 20px"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { graduationApi } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatDateTime } from '@/utils/format'

const list = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

const loadData = async () => {
  const res = await graduationApi.getList({ page: page.value, pageSize: pageSize.value })
  list.value = res.data.records
  total.value = res.data.total
}

const handleDelete = async (id) => {
  await ElMessageBox.confirm('确定删除？')
  await graduationApi.delete(id)
  ElMessage.success('删除成功')
  loadData()
}

onMounted(loadData)
</script>

<style scoped>
.toolbar { margin-bottom: 0; }
</style>
