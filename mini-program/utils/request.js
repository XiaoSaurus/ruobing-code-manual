/**
 * HTTP 请求工具
 * - 自动注入 Authorization Token
 * - 统一处理 401 跳转登录
 */
const request = (url, options = {}) => {
  const app = getApp()
  return new Promise((resolve, reject) => {
    const opts = { ...options }
    const maxRetry = Number.isInteger(opts.retry) ? opts.retry : 1
    const timeout = Number.isInteger(opts.timeout) ? opts.timeout : 15000
    let data = opts.data
    if (data != null && typeof data === 'object' && !(data instanceof ArrayBuffer)) {
      data = JSON.stringify(data)
    }

    // 自动注入 Token
    const token = wx.getStorageSync('accessToken') || ''
    const authHeader = token ? { Authorization: token } : {}

    const doRequest = (attempt = 0) => {
      wx.request({
        url: app.globalData.apiBase + url,
        method: opts.method || 'GET',
        data: data,
        timeout,
        header: {
          'Content-Type': 'application/json',
          ...authHeader,
          ...(opts.header || {})
        },
        success: res => {
          if (res.statusCode < 200 || res.statusCode >= 300) {
            reject(new Error('HTTP ' + res.statusCode))
            return
          }
          // 401 未登录 → 清除本地登录态
          if (res.data && res.data.code === 401) {
            app.clearAuth && app.clearAuth()
          }
          resolve(res.data)
        },
        fail: err => {
          const msg = (err && err.errMsg) || ''
          const isTimeout = msg.includes('timeout')
          if (isTimeout && attempt < maxRetry) {
            doRequest(attempt + 1)
            return
          }
          reject(err)
        }
      })
    }
    doRequest()
  })
}

request.get = (url, params) => {
  let query = ''
  if (params) {
    query = Object.keys(params)
      .filter(k => params[k] != null && params[k] !== '')
      .map(k => `${k}=${encodeURIComponent(params[k])}`)
      .join('&')
    if (query) url = url + '?' + query
  }
  return request(url, { method: 'GET' })
}

request.post = (url, data) => request(url, { method: 'POST', data })

request.put = (url, data) => request(url, { method: 'PUT', data })

request.delete = (url, params) => request(url, { method: 'DELETE', data: params })

module.exports = { request }
