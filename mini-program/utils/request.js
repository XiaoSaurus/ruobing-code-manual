const request = (url, options = {}) => {
  const app = getApp()
  return new Promise((resolve, reject) => {
    wx.request({
      url: app.globalData.apiBase + url,
      header: { 'Content-Type': 'application/json' },
      ...options,
      success: res => resolve(res.data),
      fail: err => reject(err)
    })
  })
}

// GET 快捷方法
request.get = (url, params) => {
  let query = ''
  if (params) {
    query = Object.keys(params).map(k => `${k}=${encodeURIComponent(params[k])}`).join('&')
    url = url + '?' + query
  }
  return request(url, { method: 'GET' })
}

// POST 快捷方法
request.post = (url, data) => request(url, { method: 'POST', data })

// PUT 快捷方法
request.put = (url, data) => request(url, { method: 'PUT', data })

// DELETE 快捷方法
request.delete = (url, params) => request(url, { method: 'DELETE', data: params })

module.exports = { request }
