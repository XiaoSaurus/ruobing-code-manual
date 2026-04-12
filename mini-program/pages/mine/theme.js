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
    console.log('selectTheme:', theme)
    if (!theme || !theme.id) {
      wx.showToast({ title: '主题数据错误', icon: 'none' })
      return
    }
    app.setTheme(theme)
    this.setData({ currentTheme: theme })
    wx.showToast({ title: `已切换为「${theme.name}」`, icon: 'none' })
    // 刷新所有已打开页面
    const pages = getCurrentPages()
    pages.forEach(page => page.onShow && page.onShow())
    setTimeout(() => wx.navigateBack(), 800)
  }
})
