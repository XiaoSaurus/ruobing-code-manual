const { request } = require('../../utils/request.js')
Page({
  data: { keyword: '', sortBy: 'sort_order', list: [], page: 1, pageSize: 10, hasMore: true },
  onLoad(options) {
    if (options.keyword) this.setData({ keyword: options.keyword })
    this.loadData()
  },
  loadData(reset = false) {
    if (reset) this.setData({ page: 1, list: [], hasMore: true })
    const { keyword, sortBy, page, pageSize } = this.data
    request('/graduation/list', { data: { keyword, sortBy, page, pageSize } }).then(res => {
      const newList = reset ? res.data.records : [...this.data.list, ...res.data.records]
      this.setData({ list: newList, hasMore: newList.length < res.data.total })
    })
  },
  onKeywordInput(e) { this.setData({ keyword: e.detail.value }) },
  onSort(e) { this.setData({ sortBy: e.currentTarget.dataset.sort }); this.loadData(true) },
  loadMore() { this.setData({ page: this.data.page + 1 }); this.loadData() },
  goDetail(e) { wx.navigateTo({ url: `/pages/graduation/detail?id=${e.currentTarget.dataset.id}` }) }
})
