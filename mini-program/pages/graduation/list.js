const { request } = require('../../utils/request.js')
const app = getApp()

Page({
  data: {
    keyword: '',
    sortBy: 'sort_order',
    viewMode: 'single',
    list: [],
    page: 1,
    pageSize: 10,
    hasMore: true,
    loading: false,
    themeClass: ''
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
  },

  applyTheme() {
    const theme = app.globalData.currentTheme
    if (theme) {
      this.setData({ themeClass: 'theme-' + theme.id })
    }
  },

  loadData(reset = false) {
    if (reset) {
      this.setData({ page: 1, list: [], hasMore: true })
    }
    const { keyword, sortBy, page, pageSize } = this.data
    this.setData({ loading: true })
    request('/graduation/list', {
      data: { keyword, sortBy, page, pageSize }
    }).then(res => {
      const records = (res.data.records || []).map(item => ({
        ...item,
        tagsArray: item.tags ? item.tags.split(',').filter(t => t.trim()) : []
      }))
      const newList = reset ? records : [...this.data.list, ...records]
      this.setData({
        list: newList,
        hasMore: newList.length < (res.data.total || 0),
        loading: false
      })
    }).catch(() => {
      this.setData({ loading: false })
      wx.showToast({ title: '加载失败', icon: 'none' })
    })
  },

  toggleView() {
    this.setData({
      viewMode: this.data.viewMode === 'single' ? 'double' : 'single'
    })
  },

  onKeywordInput(e) {
    this.setData({ keyword: e.detail.value })
  },

  onSearch() {
    this.loadData(true)
  },

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
