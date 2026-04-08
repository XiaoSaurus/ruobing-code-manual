import request from '../utils/request'

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
  getList: (params) => request.get('/sys-user/list', { params }),
  getAll: () => request.get('/sys-user/all'),
  getById: (id) => request.get(`/sys-user/${id}`),
  save: (data) => request.post('/sys-user', data),
  update: (id, data) => request.put(`/sys-user/${id}`, data),
  delete: (id) => request.delete(`/sys-user/${id}`),
  updateStatus: (id, status) => request.put(`/sys-user/${id}/status?status=${status}`),
  getStats: () => request.get('/sys-user/stats')
}
