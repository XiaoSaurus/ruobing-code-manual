const app = getApp()

Page({
  data: {
    list: [],
    loaded: false
  },

  onLoad() {
    this.loadData()
  },

  loadData() {
    wx.showLoading({ title: '加载中…' })
    app.request.get('/changelog/list').then(res => {
      wx.hideLoading()
      this.setData({
        list: res.data || [],
        loaded: true
      })
    }).catch(() => {
      wx.hideLoading()
      this.setData({ loaded: true })
      wx.showToast({ title: '加载失败', icon: 'none' })
    })
  }
})
