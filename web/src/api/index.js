import request from '../utils/request'

export { authApi } from './auth'

export const webDesignApi = {
  getList: (params) => request.get('/web-design/list', { params }),
  getHotList: () => request.get('/web-design/hot'),
  getLatestList: () => request.get('/web-design/latest'),
  getDetail: (id) => request.get(`/web-design/${id}`),
  save: (data) => request.post('/web-design', data),
  delete: (id) => request.delete(`/web-design/${id}`)
}

export const graduationApi = {
  getList: (params) => request.get('/graduation/list', { params }),
  getHotList: () => request.get('/graduation/hot'),
  getLatestList: () => request.get('/graduation/latest'),
  getDetail: (id) => request.get(`/graduation/${id}`),
  save: (data) => request.post('/graduation', data),
  delete: (id) => request.delete(`/graduation/${id}`)
}

export const feedbackApi = {
  getList: (params) => request.get('/feedback/list', { params }),
  submit: (data) => request.post('/feedback', data),
  reply: (id, reply) => request.put(`/feedback/${id}/reply`, reply)
}

export const changelogApi = {
  getList: () => request.get('/changelog/list'),
  save: (data) => request.post('/changelog', data)
}

export const aboutApi = {
  get: () => request.get('/about'),
  update: (data) => request.put('/about', data)
}

export const sysUserApi = {
  getList: (params) => request.get('/user/admin/list', { params }),
  getAll: () => request.get('/user/admin/all'),
  getById: (id) => request.get(`/user/admin/${id}`),
  save: (data) => request.post('/user/admin', data),
  update: (id, data) => request.put(`/user/admin/${id}`, data),
  delete: (id) => request.delete(`/user/admin/${id}`),
  updateStatus: (id, status) => request.put(`/user/admin/${id}/status?status=${status}`),
  getStats: () => request.get('/user/admin/stats')
}

export const rbacApi = {
  getRoles: () => request.get('/rbac/roles'),
  saveRole: (data) => request.post('/rbac/roles', data),
  deleteRole: (roleCode) => request.delete(`/rbac/roles/${roleCode}`),
  getMenus: () => request.get('/rbac/menus'),
  getRoleMenus: (roleCode) => request.get(`/rbac/roles/${roleCode}/menus`),
  bindRoleMenus: (roleCode, menuIds) => request.post(`/rbac/roles/${roleCode}/menus`, { menuIds })
}
