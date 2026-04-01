const { request } = require('../../utils/request.js')

Page({
  data: {
    hotList: [],
    latestList: []
  },

  onLoad() {
    this.loadData()
  },

  onShow() {
    this.loadData()
  },

  loadData() {
    Promise.all([
      request('/web-design/hot'),
      request('/web-design/latest'),
      request('/graduation/hot'),
      request('/graduation/latest')
    ]).then(([webHot, webLatest, gpHot, gpLatest]) => {
      this.setData({
        hotList: [...(webHot.data || []), ...(gpHot.data || [])].slice(0, 5),
        latestList: [...(webLatest.data || []), ...(gpLatest.data || [])].slice(0, 5)
      })
    })
  },

  onSearch(e) {
    const keyword = e.detail.value
    if (keyword) {
      wx.navigateTo({ url: `/pages/web-design/list?keyword=${keyword}` })
    }
  },

  goDetail(e) {
    const { type, id } = e.currentTarget.dataset
    if (type === 'web') {
      wx.navigateTo({ url: `/pages/web-design/detail?id=${id}` })
    } else {
      wx.navigateTo({ url: `/pages/graduation/detail?id=${id}` })
    }
  }
})
