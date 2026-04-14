<template>
  <div class="page-container">
    <div class="toolbar">
      <el-button type="primary" @click="openDialog()">新增菜单</el-button>
      <el-button @click="loadData">刷新</el-button>
    </div>

    <el-table :data="menus" border stripe>
      <el-table-column prop="title" label="菜单名称" min-width="160" />
      <el-table-column prop="path" label="菜单路径" min-width="180" />
      <el-table-column label="图标" width="160">
        <template #default="{ row }">
          <div class="table-icon-cell">
            <el-icon v-if="iconMap[row.icon]" class="menu-icon">
              <component :is="iconMap[row.icon]" />
            </el-icon>
            <span>{{ row.icon || '-' }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="sortOrder" label="排序" width="90" />
      <el-table-column label="状态" width="90">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'">{{ row.status === 1 ? '启用' : '禁用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="openDialog(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="remove(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="form.id ? '编辑菜单' : '新增菜单'" width="520px">
      <el-form :model="form" label-position="top">
        <el-form-item label="菜单名称">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="菜单路径">
          <el-input v-model="form.path" placeholder="/menu-path" />
        </el-form-item>
        <el-form-item label="图标">
          <div class="icon-picker-wrap">
            <el-select
              v-model="form.icon"
              placeholder="请选择图标"
              clearable
              filterable
              class="icon-select"
            >
              <el-option v-for="item in iconOptions" :key="item.name" :label="item.name" :value="item.name">
                <div class="icon-option">
                  <el-icon class="icon-item-symbol">
                    <component :is="item.component" />
                  </el-icon>
                  <span>{{ item.name }}</span>
                </div>
              </el-option>
            </el-select>
            <div class="icon-preview">
              <span class="preview-label">当前选择</span>
              <el-icon v-if="iconMap[form.icon]" class="menu-icon">
                <component :is="iconMap[form.icon]" />
              </el-icon>
              <el-tag effect="plain">{{ form.icon || '未选择' }}</el-tag>
              <el-button v-if="form.icon" link type="danger" @click="form.icon = ''">清空</el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sortOrder" :min="0" :max="9999" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { HomeFilled, Document, School, ChatDotRound, List, InfoFilled, UserFilled, Menu, Lock, Grid } from '@element-plus/icons-vue'
import { rbacApi } from '@/api'

const iconOptions = [
  { name: 'HomeFilled', component: HomeFilled },
  { name: 'Document', component: Document },
  { name: 'School', component: School },
  { name: 'ChatDotRound', component: ChatDotRound },
  { name: 'List', component: List },
  { name: 'InfoFilled', component: InfoFilled },
  { name: 'UserFilled', component: UserFilled },
  { name: 'Menu', component: Menu },
  { name: 'Lock', component: Lock },
  { name: 'Grid', component: Grid }
]
const iconMap = Object.fromEntries(iconOptions.map((i) => [i.name, i.component]))

const menus = ref([])
const dialogVisible = ref(false)
const form = reactive({
  id: null,
  title: '',
  path: '',
  icon: '',
  sortOrder: 0,
  status: 1
})

async function loadData() {
  const res = await rbacApi.getMenusAll()
  if (res.code !== 200) {
    ElMessage.error(res.message || '菜单数据加载失败')
    return
  }
  menus.value = res.data || []
}

function openDialog(row) {
  Object.assign(form, {
    id: row?.id ?? null,
    title: row?.title ?? '',
    path: row?.path ?? '',
    icon: row?.icon ?? '',
    sortOrder: row?.sortOrder ?? 0,
    status: row?.status ?? 1
  })
  dialogVisible.value = true
}

async function save() {
  if (!form.title?.trim() || !form.path?.trim()) {
    ElMessage.warning('请填写菜单名称和路径')
    return
  }
  const res = await rbacApi.saveMenu({
    id: form.id,
    title: form.title.trim(),
    path: form.path.trim(),
    icon: form.icon?.trim() || null,
    sortOrder: form.sortOrder ?? 0,
    status: form.status
  })
  if (res.code !== 200) {
    ElMessage.error(res.message || '保存失败')
    return
  }
  ElMessage.success('保存成功')
  dialogVisible.value = false
  await loadData()
}

async function remove(id) {
  await ElMessageBox.confirm('确认删除该菜单？', '提示')
  const res = await rbacApi.deleteMenu(id)
  if (res.code !== 200) {
    ElMessage.error(res.message || '删除失败')
    return
  }
  ElMessage.success('已删除')
  await loadData()
}

loadData()
</script>

<style scoped>
.table-icon-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}
.menu-icon {
  font-size: 16px;
  color: #606266;
}
.icon-picker-wrap {
  display: grid;
  gap: 10px;
}
.icon-select {
  width: 100%;
}
.icon-option {
  display: flex;
  align-items: center;
  gap: 8px;
}
.icon-item-symbol {
  font-size: 16px;
  color: #409eff;
}
.icon-preview {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  background: #fafafa;
}
.preview-label {
  color: #909399;
  font-size: 12px;
}
</style>
