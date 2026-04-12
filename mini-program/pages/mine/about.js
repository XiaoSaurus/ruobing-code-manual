const app = getApp()

Page({
  data: {
    about: null
  },

  onLoad() {
    wx.showLoading({ title: '加载中…' })
    app.globalData.request.get('/about').then(res => {
      wx.hideLoading()
      this.setData({ about: res.data })
    }).catch(() => {
      wx.hideLoading()
    })
  }
})
