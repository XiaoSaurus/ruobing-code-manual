const app = getApp()
const { buildThemePageStyle } = require('../../utils/themeUi.js')

function isLoggedIn() {
  return !!(wx.getStorageSync('accessToken'))
}

Page({
  data: {
    content: '',
    contact: '',
    submitting: false,
    pageStyle: ''
  },

  onLoad() {
    this.applyTheme()
    if (!isLoggedIn()) {
      wx.redirectTo({ url: '/pages/mine/login' })
    }
  },

  onShow() {
    this.applyTheme()
    if (!isLoggedIn()) {
      wx.redirectTo({ url: '/pages/mine/login' })
    }
  },

  applyTheme() {
    const theme = app.globalData.currentTheme || app.globalData.themes[0]
    this.setData({ pageStyle: buildThemePageStyle(theme) })
  },

  onContentInput(e) { this.setData({ content: e.detail.value }) },
  onContactInput(e) { this.setData({ contact: e.detail.value }) },

  goFeedbackRecords() {
    wx.navigateTo({ url: '/pages/mine/feedback-list' })
  },

  submit() {
    if (!isLoggedIn()) {
      wx.redirectTo({ url: '/pages/mine/login' })
      return
    }
    if (!this.data.content.trim()) {
      wx.showToast({ title: '请输入反馈内容', icon: 'none' })
      return
    }
    this.setData({ submitting: true })
    // Token 由 request.js 自动注入，无需手动传 openid
    app.globalData.request
      .post('/feedback', {
        content: this.data.content.trim(),
        contact: this.data.contact.trim()
      })
      .then(res => {
        this.setData({ submitting: false })
        if (res && (res.code === 0 || res.code === 200)) {
          wx.showToast({ title: '提交成功，感谢您的反馈！', icon: 'success' })
          setTimeout(() => wx.navigateBack(), 1500)
        } else {
          wx.showToast({ title: (res && (res.msg || res.message)) || '提交失败', icon: 'none' })
        }
      })
      .catch(() => {
        this.setData({ submitting: false })
        wx.showToast({ title: '网络错误，请重试', icon: 'none' })
      })
  }
})
