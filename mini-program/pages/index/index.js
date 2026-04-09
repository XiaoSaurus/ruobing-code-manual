const { request } = require('../../utils/request.js')

Page({
  data: {
    hotList: [],
    latestList: []
  },

  onLoad() {
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
      const normalize = (res) => {
        if (!res || res.code !== 200) return []
        const data = res.data || []
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

  goDetail(e) {
    const { type, id } = e.currentTarget.dataset
    if (type === 'web' || type === 'gp') {
      const page = type === 'web' ? 'web-design' : 'graduation'
      wx.navigateTo({ url: `/pages/${page}/detail?id=${id}` })
    }
  }
})