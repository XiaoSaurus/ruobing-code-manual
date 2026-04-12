const app = getApp()

Page({
  data: {
    userInfo: null,
    theme: null,
    themeColor: '#409EFF',
    pageStyle: ''
  },

  onLoad() {
    this.applyTheme()
  },

  onShow() {
    const userInfo = wx.getStorageSync('userInfo') || null
    this.applyTheme()
    this.setData({ userInfo })
  },

  // 应用主题 - 使用内联样式
  applyTheme() {
    const theme = app.globalData.currentTheme || app.globalData.themes[0]
    const style = `--theme-color: ${theme.color}; --theme-light: ${theme.light}; --theme-dark: ${theme.dark};`
    this.setData({ 
      theme, 
      themeColor: theme.color,
      pageStyle: style 
    })
  },

  // 登录
  goLogin() {
    wx.getUserProfile({
      desc: '用于完善个人资料',
      success: res => {
        const userInfo = res.userInfo
        userInfo.avatar = userInfo.avatarUrl
        userInfo.nickname = userInfo.nickName
        wx.setStorageSync('userInfo', userInfo)
        this.setData({ userInfo })
        wx.showToast({ title: '登录成功', icon: 'success' })
      },
      fail: () => {
        wx.showToast({ title: '您取消了授权', icon: 'none' })
      }
    })
  },

  // 退出登录
  logout() {
    wx.showModal({
      title: '提示',
      content: '确定退出登录吗？',
      success: res => {
        if (res.confirm) {
          wx.removeStorageSync('userInfo')
          this.setData({ userInfo: null })
          wx.showToast({ title: '已退出', icon: 'none' })
        }
      }
    })
  },

  // 意见反馈
  goFeedback() {
    wx.navigateTo({ url: '/pages/mine/feedback' })
  },

  // 更新日志
  goChangelog() {
    wx.navigateTo({ url: '/pages/mine/changelog' })
  },

  // 关于我们
  goAbout() {
    wx.navigateTo({ url: '/pages/mine/about' })
  },

  // 切换主题
  goTheme() {
    wx.navigateTo({ url: '/pages/mine/theme' })
  }
})
