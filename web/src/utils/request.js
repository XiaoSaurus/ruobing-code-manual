import axios from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000
})

request.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers || {}
    if (!config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

request.interceptors.response.use(
  response => {
    const data = response.data
    if (data && typeof data.code === 'number' && data.code === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('authRole')
      localStorage.removeItem('adminUser')
      localStorage.removeItem('appUser')
      ElMessage.error(data.message || '登录已过期，请重新登录')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return data
  },
  error => {
    ElMessage.error(error.message || '请求失败')
    return Promise.reject(error)
  }
)

export default request
