const app = getApp()
const { buildThemePageStyle } = require('../../utils/themeUi.js')
const { USER_AGREEMENT_HTML, PRIVACY_POLICY_HTML } = require('../../assets/constants/legal.js')

const HTML_MAP = {
  user: USER_AGREEMENT_HTML,
  privacy: PRIVACY_POLICY_HTML
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
    this.setData({ html: HTML_MAP[type] })
    this.applyTheme()
  },

  onShow() {
    this.applyTheme()
  },

  applyTheme() {
    const theme = app.globalData.currentTheme || app.globalData.themes[0]
    this.setData({ pageStyle: buildThemePageStyle(theme) })
  }
})
