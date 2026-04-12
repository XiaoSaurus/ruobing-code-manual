const app = getApp()
const { buildThemePageStyle } = require('../../utils/themeUi.js')

Page({
  data: {
    pageStyle: ''
  },

  onLoad() {
    this.applyTheme()
  },

  onShow() {
    this.applyTheme()
  },

  applyTheme() {
    const theme = app.globalData.currentTheme || app.globalData.themes[0]
    this.setData({
      pageStyle: buildThemePageStyle(theme)
    })
  }
})
