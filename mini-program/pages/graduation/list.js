const { request } = require('../../utils/request.js')

Page({
  data: {
    keyword: '',
    sortBy: 'sort_order',
    list: [],
    page: 1,
    pageSize: 10,
    hasMore: true
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
    wx.showLoading({ title: '加载中...', mask: true })
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
        hasMore: newList.length < (res.data.total || 0)
      })
      wx.hideLoading()
    }).catch(() => {
      wx.hideLoading()
      wx.showToast({ title: '加载失败', icon: 'none' })
    })
  },

  onSearch(e) {
    const keyword = (e.detail.value || '').trim()
    this.setData({ keyword })
    if (keyword) {
      this.loadData(true)
    }
  },

  onKeywordInput(e) {
    this.setData({ keyword: e.detail.value })
  },

  onSort(e) {
    const sortBy = e.currentTarget.dataset.sort
    if (sortBy === this.data.sortBy) return
    this.setData({ sortBy })
    this.loadData(true)
  },

  loadMore() {
    if (!this.data.hasMore) return
    this.setData({ page: this.data.page + 1 })
    this.loadData()
  },

  goDetail(e) {
    wx.navigateTo({ url: `/pages/graduation/detail?id=${e.currentTarget.dataset.id}` })
  }
})
