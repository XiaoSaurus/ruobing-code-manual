const app = getApp()
const { markdownToHtml } = require('../../utils/simpleMarkdown.js')
const { buildThemePageStyle } = require('../../utils/themeUi.js')

function formatChangelogTime(t) {
  if (t == null) return ''
  if (typeof t === 'string') {
    return t.length >= 10 ? t.slice(0, 10) : t
  }
  if (Array.isArray(t) && t.length >= 3) {
    const y = t[0]
    const m = String(t[1]).padStart(2, '0')
    const d = String(t[2]).padStart(2, '0')
    return `${y}-${m}-${d}`
  }
  return String(t)
}

function currentAccent() {
  const theme = app.globalData.currentTheme || app.globalData.themes[0]
  return (theme && theme.color) || '#409EFF'
}

Page({
  data: {
    list: [],
    loaded: false,
    latestVersion: '',
    pageStyle: ''
  },

  onLoad() {
    this.applyTheme()
    this.loadData()
  },

  onShow() {
    this.applyTheme()
  },

  applyTheme() {
    const theme = app.globalData.currentTheme || app.globalData.themes[0]
    this.setData({
      pageStyle: buildThemePageStyle(theme)
    })
    if (this.data.list && this.data.list.length) {
      const accent = currentAccent()
      const list = this.data.list.map(it => ({
        ...it,
        contentHtml: markdownToHtml(
          (it.rawContent != null ? it.rawContent : it.content) || '',
          accent
        )
      }))
      this.setData({ list })
    }
  },

  loadData() {
    wx.showLoading({ title: '加载中…' })
    const accent = currentAccent()
    app.globalData.request
      .get('/changelog/list')
      .then(res => {
        wx.hideLoading()
        const raw = res && res.code === 200 && res.data ? res.data : []
        const list = (raw || []).map(item => ({
          ...item,
          rawContent: item.content,
          expanded: false,
          createTimeLabel: formatChangelogTime(item.createTime),
          contentHtml: markdownToHtml(item.content || '', accent)
        }))
        const latestVersion = list.length > 0 ? list[0].version : ''
        const theme = app.globalData.currentTheme || app.globalData.themes[0]
        this.setData({
          list,
          loaded: true,
          latestVersion,
          pageStyle: buildThemePageStyle(theme)
        })
      })
      .catch(() => {
        wx.hideLoading()
        this.setData({ loaded: true })
        wx.showToast({ title: '加载失败', icon: 'none' })
      })
  },

  toggleDetail(e) {
    const id = e.currentTarget.dataset.id
    if (id == null) return
    const list = this.data.list.map(it =>
      String(it.id) === String(id) ? { ...it, expanded: !it.expanded } : it
    )
    this.setData({ list })
  }
})
