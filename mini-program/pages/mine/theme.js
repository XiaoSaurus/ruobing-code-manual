const app = getApp()
const {
  buildUserCardGradient,
  isUserCardLightMode,
  buildThemePageStyle
} = require('../../utils/themeUi.js')

function previewState(theme) {
  if (!theme || !theme.id) {
    return {
      pageStyle: '',
      previewUserCardBg: 'linear-gradient(175deg, #E6F4FF 0%, #ffffff 100%)',
      previewUserCardLight: true
    }
  }
  return {
    pageStyle: buildThemePageStyle(theme),
    previewUserCardBg: buildUserCardGradient(theme),
    previewUserCardLight: isUserCardLightMode(theme)
  }
}

Page({
  data: {
    themes: [],
    currentTheme: null,
    pageStyle: '',
    previewUserCardBg: '',
    previewUserCardLight: true
  },

  onLoad() {
    const currentTheme = app.globalData.currentTheme || app.globalData.themes[0]
    this.setData({
      themes: app.globalData.themes,
      currentTheme,
      ...previewState(currentTheme)
    })
  },

  selectTheme(e) {
    const theme = e.currentTarget.dataset.theme
    if (!theme || !theme.id) {
      wx.showToast({ title: '主题数据错误', icon: 'none' })
      return
    }
    app.setTheme(theme, false)
    this.setData({ currentTheme: theme, ...previewState(theme) })
    wx.showToast({ title: `已切换为「${theme.name}」`, icon: 'none' })
    setTimeout(() => wx.navigateBack(), 600)
  }
})
