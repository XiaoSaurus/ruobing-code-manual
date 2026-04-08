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
    wx.showLoading({ title: '加载中...' })
    Promise.all([
      request('/web-design/hot'),
      request('/web-design/latest'),
      request('/graduation/hot'),
      request('/graduation/latest')
    ]).then(([webHot, webLatest, gpHot, gpLatest]) => {
      const merge = (list, type) => (list.data || []).map(item => ({
        ...item,
        _type: type,
        tagsArray: item.tags ? item.tags.split(',').filter(t => t.trim()) : []
      }))
      const hotWeb = merge(webHot.data || [], 'web')
      const hotGp = merge(gpHot.data || [], 'gp')
      const newWeb = merge(webLatest.data || [], 'web')
      const newGp = merge(gpLatest.data || [], 'gp')
      this.setData({
        hotList: [...hotWeb, ...hotGp].slice(0, 6),
        latestList: [...newWeb, ...newGp].slice(0, 6)
      })
      wx.hideLoading()
    }).catch(() => {
      wx.hideLoading()
      wx.showToast({ title: '加载失败，请检查网络', icon: 'none' })
    })
  },

  onSearch(e) {
    const keyword = (e.detail.value || '').trim()
    if (keyword) {
      wx.navigateTo({ url: `/pages/web-design/list?keyword=${encodeURIComponent(keyword)}` })
    }
  },

  goDetail(e) {
    const { type, id } = e.currentTarget.dataset
    if (type === 'web' || type === 'gp') {
      const page = type === 'web' ? 'web-design' : 'graduation'
      wx.navigateTo({ url: `/pages/${page}/detail?id=${id}` })
    }
  }
})
