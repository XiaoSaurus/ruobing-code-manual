const app = getApp()
const { buildThemePageStyle } = require('../../utils/themeUi.js')

const KEYS = {
  user: 'legal_user_agreement',
  privacy: 'legal_privacy_policy'
}

Page({
  data: {
    html: '',
    loadErr: '',
    pageStyle: ''
  },

  onLoad(options) {
    const type = options.type === 'privacy' ? 'privacy' : 'user'
    const title = type === 'privacy' ? '隐私政策' : '用户协议'
    wx.setNavigationBarTitle({ title })
    this.dictKey = KEYS[type]
    this.applyTheme()
    this.loadContent()
  },

  onShow() {
    this.applyTheme()
  },

  applyTheme() {
    const theme = app.globalData.currentTheme || app.globalData.themes[0]
    this.setData({ pageStyle: buildThemePageStyle(theme) })
  },

  loadContent() {
    this.setData({ loadErr: '', html: '' })
    wx.showLoading({ title: '加载中…' })
    app.globalData.request
      .get(`/dict/${this.dictKey}`)
      .then(res => {
        wx.hideLoading()
        if (res && res.code === 200 && res.data) {
          this.setData({ html: res.data })
        } else {
          this.setData({ loadErr: res.message || '加载失败' })
        }
      })
      .catch(() => {
        wx.hideLoading()
        this.setData({ loadErr: '网络异常，请稍后重试' })
      })
  }
})
