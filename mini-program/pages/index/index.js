const { request } = require('../../utils/request.js')

Page({
  data: {
    hotList: [],
    latestList: [],
    keyword: ''
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
      // 统一处理：可能是数组也可能是分页对象 {records, total}
      const normalize = (res) => {
        if (!res || res.code !== 200) return []
        const data = res.data || []
        // 如果是分页对象（有 records 字段），取 records
        if (Array.isArray(data)) return data
        if (data.records) return data.records
        return []
      }
      const merge = (list, type) => normalize(list).map(item => ({
        ...item,
        _type: type,
        tagsArray: item.tags ? item.tags.split(',').filter(t => t.trim()) : []
      }))
      const hotWeb = merge(webHot, 'web')
      const hotGp = merge(gpHot, 'gp')
      const newWeb = merge(webLatest, 'web')
      const newGp = merge(gpLatest, 'gp')
      this.setData({
        hotList: [...hotWeb, ...hotGp].slice(0, 6),
        latestList: [...newWeb, ...newGp].slice(0, 6)
      })
      wx.hideLoading()
    }).catch(err => {
      wx.hideLoading()
      console.error('loadData error:', err)
      wx.showToast({ title: '加载失败，请检查网络', icon: 'none' })
    })
  },

  onInput(e) {
    this.setData({ keyword: e.detail.value })
  },

  doSearch() {
    const keyword = (this.data.keyword || '').trim()
    if (keyword) {
      wx.navigateTo({ url: `/pages/web-design/list?keyword=${encodeURIComponent(keyword)}` })
    }
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
