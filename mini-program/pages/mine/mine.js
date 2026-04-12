const app = getApp()
const { pullUserFromServer } = require('../../utils/userSync.js')
const { buildUserCardGradient, isUserCardLightMode } = require('../../utils/themeUi.js')

Page({
  data: {
    userInfo: null,
    theme: null,
    themeColor: '#66B1FF',
    /** 用户卡背景；userCardLight 为 true 时用浅色字样式 .user-card--light */
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
    // 从服务端同步资料，避免仅本地有缓存、库中已更新或换机后不一致
    if (userInfo && userInfo.openid) {
      pullUserFromServer(userInfo.openid).then(fresh => {
        if (!fresh) return
        wx.setStorageSync('userInfo', fresh)
        app.globalData.userInfo = fresh
        this.setData({ userInfo: fresh })
      })
    }
  },

  // 应用主题 - 使用内联样式
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

  // 登录跳转
  goLogin() {
    wx.navigateTo({ url: '/pages/mine/login' })
  },

  // 个人资料
  goProfile() {
    wx.navigateTo({ url: '/pages/mine/profile' })
  },

  // 退出登录
  logout() {
    wx.showModal({
      title: '提示',
      content: '确定退出登录吗？',
      success: res => {
        if (res.confirm) {
          wx.removeStorageSync('userInfo')
          app.globalData.userInfo = null  // 清理全局状态
          this.setData({ userInfo: null })
          wx.showToast({ title: '已退出', icon: 'none' })
        }
      }
    })
  },

  // 意见反馈（需登录）
  goFeedback() {
    const userInfo = wx.getStorageSync('userInfo')
    if (!userInfo || !userInfo.openid) {
      wx.navigateTo({ url: '/pages/mine/login' })
      return
    }
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
