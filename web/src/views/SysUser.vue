<template>
  <div class="page-container">
    <!-- 工具栏 -->
    <div class="toolbar toolbar--responsive">
      <el-input
        v-model="keyword"
        placeholder="搜索用户名/昵称"
        class="search-input"
        clearable
        @clear="loadData"
        @keyup.enter="loadData"
      >
        <template #prefix><el-icon><Search /></el-icon></template>
      </el-input>
      <el-button type="primary" @click="openDialog()">新增用户</el-button>
    </div>

    <!-- 表格 -->
    <div class="table-scroll">
    <el-table :data="list" border stripe size="small">
      <el-table-column prop="username" label="用户名" width="150" />
      <el-table-column prop="nickname" label="昵称" min-width="120" />
      <el-table-column label="头像" width="70">
        <template #default="{ row }">
          <el-avatar :src="row.avatar || defaultAvatar" :size="36" />
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱" min-width="140" show-overflow-tooltip />
      <el-table-column prop="role" label="角色" width="100">
        <template #default="{ row }">
          <el-tag :type="row.role === 'admin' ? 'danger' : 'primary'" size="small">{{ roleLabel(row.role) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="90">
        <template #default="{ row }">
          <el-switch
            v-model="row.status"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180">
        <template #default="{ row }">{{ formatDateTime(row.createTime) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="openDialog(row)">编辑</el-button>
          <el-button size="small" type="warning" @click="resetPwd(row)">重置密码</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>

    <!-- 分页 -->
    <el-pagination
      class="pagination-bar"
      v-model:current-page="page"
      :page-size="pageSize"
      :total="total"
      layout="total, prev, pager, next"
      size="small"
      @current-change="loadData"
      style="margin-top: 16px"
    />

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="editing.id ? '编辑用户' : '新增用户'" width="480px" destroy-on-close>
      <el-form :model="form" label-width="80px" label-position="top">
        <el-form-item label="用户名" required>
          <el-input v-model="form.username" :disabled="!!editing.id" placeholder="登录用户名" />
        </el-form-item>
        <el-form-item label="密码" :required="!editing.id">
          <el-input v-model="form.password" type="password" show-password :placeholder="editing.id ? '不修改请留空' : '登录密码'" />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="form.nickname" placeholder="显示昵称" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" placeholder="用于找回密码，选填" type="email" />
        </el-form-item>
        <el-form-item label="头像">
          <el-input v-model="form.avatar" placeholder="头像URL">
            <template #append>
              <el-button @click="form.avatar = defaultAvatar">随机</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="form.role" style="width: 100%">
            <el-option label="管理员" value="admin" />
            <el-option label="编辑" value="editor" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
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
import { ref, reactive, onMounted } from 'vue'
import { sysUserApi } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { formatDateTime, roleLabel } from '@/utils/format'

const defaultAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'

const list = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const keyword = ref('')
const dialogVisible = ref(false)
const editing = reactive({ id: null })
const form = reactive({
  username: '',
  password: '',
  nickname: '',
  email: '',
  avatar: '',
  role: 'editor',
  status: 1
})

const loadData = async () => {
  const res = await sysUserApi.getList({
    page: page.value,
    pageSize: pageSize.value,
    keyword: keyword.value || undefined
  })
  if (res.code !== 200) {
    ElMessage.error(res.message || '用户数据加载失败')
    return
  }
  list.value = res.data.records
  total.value = res.data.total
}

const openDialog = (row) => {
  editing.id = row?.id || null
  Object.assign(form, {
    username: row?.username || '',
    password: '',
    nickname: row?.nickname || '',
    email: row?.email || '',
    avatar: row?.avatar || '',
    role: row?.role || 'editor',
    status: row?.status ?? 1
  })
  dialogVisible.value = true
}

const handleSave = async () => {
  if (!form.username.trim()) {
    ElMessage.warning('用户名不能为空')
    return
  }
  if (!editing.id && !form.password) {
    ElMessage.warning('密码不能为空')
    return
  }
  const data = { ...form }
  if (!data.password) delete data.password
  if (editing.id) {
    await sysUserApi.update(editing.id, data)
    ElMessage.success('更新成功')
  } else {
    await sysUserApi.save(data)
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
  loadData()
}

const handleStatusChange = async (row) => {
  await sysUserApi.updateStatus(row.id, row.status)
  ElMessage.success(`已${row.status === 1 ? '启用' : '禁用'}`)
}

const resetPwd = async (row) => {
  await ElMessageBox.confirm(`确定重置用户「${row.username}」的密码为 123456？`, '重置密码')
  await sysUserApi.update(row.id, { password: '123456' })
  ElMessage.success('密码已重置为 123456')
}

const handleDelete = async (id) => {
  await ElMessageBox.confirm('确定删除该用户？', '删除确认')
  await sysUserApi.delete(id)
  ElMessage.success('删除成功')
  loadData()
}

onMounted(loadData)
</script>

<style scoped>
.toolbar { display: flex; align-items: center; margin-bottom: 0; gap: 10px; flex-wrap: wrap; }
.search-input {
  width: 240px;
  margin-right: 10px;
}
@media (max-width: 768px) {
  .search-input {
    width: 100%;
    margin-right: 0;
  }
}
</style>
