<template>
  <div class="page-container rbac-page">
    <div class="toolbar">
      <el-button type="primary" @click="openAddRole">新增角色</el-button>
      <el-button @click="loadAll">刷新</el-button>
    </div>

    <el-row :gutter="16">
      <el-col :xs="24" :lg="11">
        <el-card shadow="never">
          <template #header>角色列表</template>
          <el-table :data="roles" size="small" highlight-current-row @current-change="selectRole" style="width:100%">
            <el-table-column prop="roleName" label="角色名称" min-width="140" />
            <el-table-column label="适用对象" min-width="120">
              <template #default="{ row }">{{ roleAudience(row.roleCode) }}</template>
            </el-table-column>
            <el-table-column label="状态" width="90">
              <template #default="{ row }">
                <el-switch
                  v-model="row.status"
                  :active-value="1"
                  :inactive-value="0"
                  @change="updateRoleStatus(row)"
                />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="130">
              <template #default="{ row }">
                <el-button size="small" text @click.stop="openEditRole(row)">编辑</el-button>
                <el-button v-if="canDelete(row.roleCode)" size="small" type="danger" text @click.stop="removeRole(row.roleCode)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="13">
        <el-card shadow="never">
          <template #header>角色菜单权限（{{ currentRole?.roleName || '未选择角色' }}）</template>
          <el-checkbox-group v-model="checkedMenuIds" class="menu-grid" :disabled="!currentRole">
            <el-checkbox v-for="m in menus" :key="m.id" :label="m.id">
              <span class="menu-title">{{ m.title }}</span>
              <span class="muted">{{ m.path }}</span>
            </el-checkbox>
          </el-checkbox-group>
          <div class="actions">
            <el-button type="primary" :disabled="!currentRole" @click="saveBindings">保存权限</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="roleDialog" :title="roleForm.id ? '编辑角色' : '新增角色'" width="420px">
      <el-form :model="roleForm" label-position="top">
        <el-form-item label="角色名称">
          <el-input v-model="roleForm.roleName" placeholder="如 审核员" />
        </el-form-item>
        <el-form-item label="角色标识（系统用）">
          <el-input v-model="roleForm.roleCode" :disabled="!!roleForm.id" placeholder="如 reviewer" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="roleForm.status" :active-value="1" :inactive-value="0" />
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
const roleForm = reactive({ id: null, roleCode: '', roleName: '', status: 1 })

function canDelete(code) {
  return !['admin', 'app_user'].includes((code || '').toLowerCase())
}

function roleAudience(code) {
  const map = {
    admin: '后台管理员',
    editor: '后台编辑',
    app_user: '小程序/访客'
  }
  return map[code] || '自定义角色'
}

async function loadAll() {
  const [rRes, mRes] = await Promise.all([rbacApi.getRoles(), rbacApi.getMenusAll()])
  if (rRes.code !== 200) {
    ElMessage.error(rRes.message || '角色数据加载失败')
    return
  }
  if (mRes.code !== 200) {
    ElMessage.error(mRes.message || '菜单数据加载失败')
    return
  }
  roles.value = rRes.data || []
  menus.value = mRes.data || []
}

async function selectRole(role) {
  if (!role) return
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
  roleForm.id = null
  roleForm.roleCode = ''
  roleForm.roleName = ''
  roleForm.status = 1
  roleDialog.value = true
}

function openEditRole(row) {
  roleForm.id = row.id
  roleForm.roleCode = row.roleCode
  roleForm.roleName = row.roleName
  roleForm.status = row.status ?? 1
  roleDialog.value = true
}

async function saveRole() {
  const code = roleForm.roleCode.trim()
  const name = roleForm.roleName.trim()
  if (!code || !name) {
    ElMessage.warning('请填写角色编码和名称')
    return
  }
  const res = await rbacApi.saveRole({ id: roleForm.id, roleCode: code, roleName: name, status: roleForm.status })
  if (res.code !== 200) {
    ElMessage.error(res.message || '保存失败')
    return
  }
  roleDialog.value = false
  ElMessage.success('角色已保存')
  await loadAll()
}

async function updateRoleStatus(row) {
  const res = await rbacApi.saveRole({
    id: row.id,
    roleCode: row.roleCode,
    roleName: row.roleName,
    status: row.status
  })
  if (res.code !== 200) {
    ElMessage.error(res.message || '状态修改失败')
    return
  }
  ElMessage.success('状态已更新')
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
.menu-title {
  margin-right: 6px;
  font-weight: 500;
}
.muted {
  color: #94a3b8;
  font-size: 12px;
}
.actions {
  margin-top: 16px;
}
</style>
