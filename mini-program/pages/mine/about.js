const { request } = require('../../utils/request.js')

Page({
  data: {
    about: null
  },

  onLoad() {
    wx.showLoading({ title: '加载中...' })
    request('/about').then(res => {
      wx.hideLoading()
      this.setData({ about: res.data })
    }).catch(() => {
      wx.hideLoading()
    })
  }
})
