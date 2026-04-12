const app = getApp()

Page({
  data: {
    themes: [],
    currentTheme: null
  },

  onLoad() {
    this.setData({
      themes: app.globalData.themes,
      currentTheme: app.globalData.currentTheme
    })
  },

  selectTheme(e) {
    const theme = e.currentTarget.dataset.theme
    if (!theme || !theme.id) {
      wx.showToast({ title: '主题数据错误', icon: 'none' })
      return
    }
    // 标记需要更新 TabBar（由 TabBar 页面的 onShow 执行更新）
    app.setTheme(theme, false)
    this.setData({ currentTheme: theme })
    wx.showToast({ title: `已切换为「${theme.name}」`, icon: 'none' })
    setTimeout(() => wx.navigateBack(), 600)
  }
})
