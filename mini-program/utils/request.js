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

module.exports = { request }
