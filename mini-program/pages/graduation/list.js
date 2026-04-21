const { request } = require('../../utils/request.js')
const app = getApp()

Page({
  data: {
    keyword: '',
    sortBy: 'create_time',
    viewMode: 'single',
    list: [],
    page: 1,
    pageSize: 10,
    hasMore: true,
    loading: false,
    themeClass: '',
    pageStyle: ''
  },

  onLoad(options) {
    this.applyTheme()
    if (options.keyword) {
      this.setData({ keyword: decodeURIComponent(options.keyword) })
    }
    this.loadData(true)
  },

  onShow() {
    this.applyTheme()
    if (app.globalData.themeDirty) {
      app.globalData.themeDirty = false
      app.updateTabBar(app.globalData.currentTheme)
    }
  },

  applyTheme() {
    const theme = app.globalData.currentTheme
    if (theme) {
      const style = `--theme-color: ${theme.color}; --theme-light: ${theme.light}; --theme-dark: ${theme.dark};`
      this.setData({ themeClass: 'theme-' + theme.id, pageStyle: style })
    }
  },

  loadData(reset = false) {
    if (reset) {
      this.setData({ page: 1, list: [], hasMore: true })
    }
    const { keyword, sortBy, page, pageSize } = this.data
    this.setData({ loading: true })
    request.get('/graduation/list', { keyword, sortBy, page, pageSize }).then(res => {
      const resData = (res && (res.code === 0 || res.code === 200)) ? (res.data || {}) : {}
      // 后端返回 {list, total} 或 {list, summary, total}
      const records = resData.list || resData.records || []
      const total = resData.total || 0
      const arr = Array.isArray(records) ? records : []
      const items = arr.map(item => ({
        ...item,
        tagsArray: item.tags ? item.tags.split(',').filter(t => t.trim()) : []
      }))
      const newList = reset ? items : [...this.data.list, ...items]
      this.setData({
        list: newList,
        hasMore: newList.length < total,
        loading: false
      })
    }).catch(() => {
      this.setData({ loading: false })
      wx.showToast({ title: '加载失败', icon: 'none' })
    })
  },

  toggleView() {
    this.setData({ viewMode: this.data.viewMode === 'single' ? 'double' : 'single' })
  },

  onKeywordInput(e) { this.setData({ keyword: e.detail.value }) },
  onClearKeyword() { this.setData({ keyword: '' }); this.loadData(true) },
  onSearch() { this.setData({ keyword: (this.data.keyword || '').trim() }); this.loadData(true) },

  onSort(e) {
    const sortBy = e.currentTarget.dataset.sort
    if (sortBy === this.data.sortBy) return
    this.setData({ sortBy })
    this.loadData(true)
  },

  onReachBottom() {
    if (!this.data.hasMore || this.data.loading) return
    this.setData({ page: this.data.page + 1 })
    this.loadData()
  },

  goDetail(e) {
    wx.navigateTo({ url: `/pages/graduation/detail?id=${e.currentTarget.dataset.id}` })
  }
})
