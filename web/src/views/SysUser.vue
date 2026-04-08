<template>
  <div class="page-container">
    <!-- 工具栏 -->
    <div class="toolbar">
      <el-input
        v-model="keyword"
        placeholder="搜索用户名/昵称"
        style="width: 240px; margin-right: 10px"
        clearable
        @clear="loadData"
        @keyup.enter="loadData"
      >
        <template #prefix><el-icon><Search /></el-icon></template>
      </el-input>
      <el-button type="primary" @click="openDialog()">新增用户</el-button>
    </div>

    <!-- 表格 -->
    <el-table :data="list" border stripe>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column label="头像" width="70">
        <template #default="{ row }">
          <el-avatar :src="row.avatar || defaultAvatar" :size="36" />
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名" width="140" />
      <el-table-column prop="nickname" label="昵称" min-width="120" />
      <el-table-column prop="role" label="角色" width="100">
        <template #default="{ row }">
          <el-tag :type="row.role === 'admin' ? 'danger' : 'primary'" size="small">
            {{ row.role === 'admin' ? '管理员' : '编辑' }}
          </el-tag>
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
      <el-table-column prop="createTime" label="创建时间" width="170" />
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="openDialog(row)">编辑</el-button>
          <el-button size="small" type="warning" @click="resetPwd(row)">重置密码</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="page"
      :page-size="pageSize"
      :total="total"
      layout="total, prev, pager, next"
      @current-change="loadData"
      style="margin-top: 16px"
    />

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="editing.id ? '编辑用户' : '新增用户'" width="480px" destroy-on-close>
      <el-form :model="form" label-width="80px">
        <el-form-item label="用户名" required>
          <el-input v-model="form.username" :disabled="!!editing.id" placeholder="登录用户名" />
        </el-form-item>
        <el-form-item label="密码" :required="!editing.id">
          <el-input v-model="form.password" type="password" show-password :placeholder="editing.id ? '不修改请留空' : '登录密码'" />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="form.nickname" placeholder="显示昵称" />
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
  list.value = res.data.records
  total.value = res.data.total
}

const openDialog = (row) => {
  editing.id = row?.id || null
  Object.assign(form, {
    username: row?.username || '',
    password: '',
    nickname: row?.nickname || '',
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
.page-container { padding: 20px; }
.toolbar { display: flex; align-items: center; margin-bottom: 16px; gap: 10px; }
</style>
