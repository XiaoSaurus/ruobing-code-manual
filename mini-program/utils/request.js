const request = (url, options = {}) => {
  const app = getApp()
  return new Promise((resolve, reject) => {
    const opts = { ...options }
    let data = opts.data
    // 对象必须 JSON 序列化，否则部分环境下 PUT/POST 体为空，后端收不到 province/nickname 等
    if (data != null && typeof data === 'object' && !(data instanceof ArrayBuffer)) {
      data = JSON.stringify(data)
    }
    wx.request({
      url: app.globalData.apiBase + url,
      method: opts.method || 'GET',
      data: data,
      header: {
        'Content-Type': 'application/json',
        ...(opts.header || {})
      },
      success: res => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error('HTTP ' + res.statusCode))
          return
        }
        resolve(res.data)
      },
      fail: err => reject(err)
    })
  })
}

request.get = (url, params) => {
  let query = ''
  if (params) {
    query = Object.keys(params)
      .map(k => `${k}=${encodeURIComponent(params[k] == null ? '' : params[k])}`)
      .join('&')
    url = url + '?' + query
  }
  return request(url, { method: 'GET' })
}

request.post = (url, data) => request(url, { method: 'POST', data })

request.put = (url, data) => request(url, { method: 'PUT', data })

request.delete = (url, params) => request(url, { method: 'DELETE', data: params })

module.exports = { request }
