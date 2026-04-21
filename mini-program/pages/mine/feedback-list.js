const app = getApp()
const { buildThemePageStyle } = require('../../utils/themeUi.js')

function isLoggedIn() {
  return !!(wx.getStorageSync('accessToken'))
}

function formatTime(t) {
  if (t == null) return ''
  if (typeof t === 'string') {
    return t.length >= 16 ? t.slice(0, 16).replace('T', ' ') : t
  }
  if (Array.isArray(t) && t.length >= 6) {
    const y = t[0]
    const m = String(t[1]).padStart(2, '0')
    const d = String(t[2]).padStart(2, '0')
    const h = String(t[3] != null ? t[3] : 0).padStart(2, '0')
    const mi = String(t[4] != null ? t[4] : 0).padStart(2, '0')
    return `${y}-${m}-${d} ${h}:${mi}`
  }
  return String(t)
}

Page({
  data: {
    list: [],
    loaded: false,
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
      return
    }
    this.loadData()
  },

  applyTheme() {
    const theme = app.globalData.currentTheme || app.globalData.themes[0]
    this.setData({ pageStyle: buildThemePageStyle(theme) })
  },

  loadData() {
    wx.showLoading({ title: '加载中…' })
    // Token 由 request.js 自动注入
    app.globalData.request
      .get('/feedback/mine')
      .then(res => {
        wx.hideLoading()
        const raw = res && (res.code === 0 || res.code === 200) && res.data ? res.data : []
        const list = (raw || []).map(item => {
          const replied = !!(item.status === true || item.status === 1 || item.reply)
          return {
            ...item,
            timeLabel: formatTime(item.createTime),
            statusLabel: replied ? '已回复' : '待回复',
            statusClass: replied ? 'done' : 'pending'
          }
        })
        this.setData({ list, loaded: true })
      })
      .catch(() => {
        wx.hideLoading()
        this.setData({ list: [], loaded: true })
        wx.showToast({ title: '加载失败', icon: 'none' })
      })
  }
})
