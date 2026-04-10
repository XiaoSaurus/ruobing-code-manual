const { request } = require('../../utils/request.js')

Page({
  data: {
    keyword: '',
    sortBy: 'sort_order',
    list: [],
    page: 1,
    pageSize: 10,
    hasMore: true,
    loading: false,
    viewMode: 'single'  // 'single' 或 'double'
  },

  onLoad(options) {
    if (options.keyword) {
      this.setData({ keyword: decodeURIComponent(options.keyword) })
    }
    this.loadData(true)
  },

  loadData(reset = false) {
    if (reset) {
      this.setData({ page: 1, list: [], hasMore: true })
    }
    const { keyword, sortBy, page, pageSize } = this.data
    this.setData({ loading: true })
    request('/web-design/list', {
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

  toggleView() {
    const newMode = this.data.viewMode === 'single' ? 'double' : 'single'
    this.setData({ viewMode: newMode })
  },

  goDetail(e) {
    wx.navigateTo({ url: `/pages/web-design/detail?id=${e.currentTarget.dataset.id}` })
  }
})
