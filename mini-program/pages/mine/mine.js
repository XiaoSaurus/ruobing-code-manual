const app = getApp()
const { pullUserFromServer } = require('../../utils/userSync.js')
const { buildUserCardGradient, isUserCardLightMode } = require('../../utils/themeUi.js')

Page({
  data: {
    userInfo: null,
    theme: null,
    themeColor: '#66B1FF',
    userCardBg: 'linear-gradient(175deg, #E6F4FF 0%, #ffffff 100%)',
    userCardLight: true,
    pageStyle: ''
  },

  onLoad() {
    this.applyTheme()
  },

  onShow() {
    let userInfo = wx.getStorageSync('userInfo') || null
    this.applyTheme()
    this.setData({ userInfo })
    if (app.globalData.themeDirty) {
      app.globalData.themeDirty = false
      app.updateTabBar(app.globalData.currentTheme)
    }
    // 有 Token 则从服务端同步最新资料
    const token = wx.getStorageSync('accessToken') || ''
    if (token && userInfo) {
      pullUserFromServer().then(fresh => {
        if (!fresh) return
        wx.setStorageSync('userInfo', fresh)
        app.globalData.userInfo = fresh
        this.setData({ userInfo: fresh })
      })
    }
  },

  applyTheme() {
    const theme = app.globalData.currentTheme || app.globalData.themes[0]
    const style = `--theme-color: ${theme.color}; --theme-light: ${theme.light}; --theme-dark: ${theme.dark};`
    const userCardBg = buildUserCardGradient(theme)
    this.setData({
      theme,
      themeColor: theme.color,
      userCardBg,
      userCardLight: isUserCardLightMode(theme),
      pageStyle: style
    })
  },

  goLogin() {
    wx.navigateTo({ url: '/pages/mine/login' })
  },

  goProfile() {
    wx.navigateTo({ url: '/pages/mine/profile' })
  },

  logout() {
    wx.showModal({
      title: '提示',
      content: '确定退出登录吗？',
      success: res => {
        if (res.confirm) {
          // 调后端 logout 使 Token 失效
          app.globalData.request.post('/auth/logout').catch(() => {})
          app.clearAuth()
          this.setData({ userInfo: null })
          wx.showToast({ title: '已退出', icon: 'none' })
        }
      }
    })
  },

  goFeedback() {
    const token = wx.getStorageSync('accessToken') || ''
    if (!token) {
      wx.navigateTo({ url: '/pages/mine/login' })
      return
    }
    wx.navigateTo({ url: '/pages/mine/feedback' })
  },

  goChangelog() {
    wx.navigateTo({ url: '/pages/mine/changelog' })
  },

  goAbout() {
    wx.navigateTo({ url: '/pages/mine/about' })
  },

  goTheme() {
    wx.navigateTo({ url: '/pages/mine/theme' })
  }
})
