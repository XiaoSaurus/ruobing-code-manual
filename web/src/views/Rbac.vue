<template>
  <div class="page-container rbac-page">
    <div class="toolbar">
      <el-button type="primary" @click="openAddRole">新增角色</el-button>
      <el-button @click="loadAll">刷新</el-button>
    </div>

    <el-row :gutter="16">
      <el-col :xs="24" :md="10">
        <el-card shadow="never">
          <template #header>角色列表</template>
          <el-table :data="roles" size="small" @row-click="selectRole" style="width:100%">
            <el-table-column prop="roleCode" label="编码" width="110" />
            <el-table-column prop="roleName" label="名称" />
            <el-table-column label="状态" width="80">
              <template #default="{ row }">{{ row.status === 1 ? '启用' : '禁用' }}</template>
            </el-table-column>
            <el-table-column label="操作" width="86">
              <template #default="{ row }">
                <el-button v-if="canDelete(row.roleCode)" type="danger" text @click.stop="removeRole(row.roleCode)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :xs="24" :md="14">
        <el-card shadow="never">
          <template #header>角色菜单绑定（{{ currentRole?.roleName || '未选择' }}）</template>
          <el-checkbox-group v-model="checkedMenuIds" class="menu-grid" :disabled="!currentRole">
            <el-checkbox v-for="m in menus" :key="m.id" :label="m.id">
              {{ m.title }} <span class="muted">{{ m.path }}</span>
            </el-checkbox>
          </el-checkbox-group>
          <div class="actions">
            <el-button type="primary" :disabled="!currentRole" @click="saveBindings">保存权限</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="roleDialog" title="新增角色" width="420px">
      <el-form :model="roleForm" label-position="top">
        <el-form-item label="角色编码">
          <el-input v-model="roleForm.roleCode" placeholder="如 reviewer" />
        </el-form-item>
        <el-form-item label="角色名称">
          <el-input v-model="roleForm.roleName" placeholder="如 审核员" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="roleDialog=false">取消</el-button>
        <el-button type="primary" @click="saveRole">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { rbacApi } from '@/api'

const roles = ref([])
const menus = ref([])
const currentRole = ref(null)
const checkedMenuIds = ref([])

const roleDialog = ref(false)
const roleForm = reactive({ roleCode: '', roleName: '', status: 1 })

function canDelete(code) {
  return !['admin', 'app_user'].includes((code || '').toLowerCase())
}

async function loadAll() {
  const [rRes, mRes] = await Promise.all([rbacApi.getRoles(), rbacApi.getMenus()])
  if (rRes.code === 200) roles.value = rRes.data || []
  if (mRes.code === 200) menus.value = mRes.data || []
}

async function selectRole(role) {
  currentRole.value = role
  const res = await rbacApi.getRoleMenus(role.roleCode)
  if (res.code === 200) {
    checkedMenuIds.value = res.data?.menuIds || []
  }
}

async function saveBindings() {
  if (!currentRole.value) return
  const res = await rbacApi.bindRoleMenus(currentRole.value.roleCode, checkedMenuIds.value)
  if (res.code !== 200) {
    ElMessage.error(res.message || '保存失败')
    return
  }
  ElMessage.success('权限保存成功')
}

function openAddRole() {
  roleForm.roleCode = ''
  roleForm.roleName = ''
  roleDialog.value = true
}

async function saveRole() {
  const code = roleForm.roleCode.trim()
  const name = roleForm.roleName.trim()
  if (!code || !name) {
    ElMessage.warning('请填写角色编码和名称')
    return
  }
  const res = await rbacApi.saveRole({ roleCode: code, roleName: name, status: 1 })
  if (res.code !== 200) {
    ElMessage.error(res.message || '保存失败')
    return
  }
  roleDialog.value = false
  ElMessage.success('角色已保存')
  await loadAll()
}

async function removeRole(code) {
  await ElMessageBox.confirm(`确认删除角色 ${code} ?`, '提示')
  const res = await rbacApi.deleteRole(code)
  if (res.code !== 200) {
    ElMessage.error(res.message || '删除失败')
    return
  }
  ElMessage.success('已删除')
  if (currentRole.value?.roleCode === code) {
    currentRole.value = null
    checkedMenuIds.value = []
  }
  await loadAll()
}

loadAll()
</script>

<style scoped>
.rbac-page .menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 10px 12px;
}
.muted {
  color: #94a3b8;
  font-size: 12px;
  margin-left: 6px;
}
.actions {
  margin-top: 16px;
}
</style>
