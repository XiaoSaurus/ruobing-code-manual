const { request } = require('../../utils/request.js')
const app = getApp()

Page({
  data: {
    banners: [],
    hotList: [],
    latestList: [],
    themeClass: '',
    pageStyle: ''
  },

  onLoad() {
    this.applyTheme()
    this.loadData()
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

  loadData() {
    wx.showLoading({ title: '加载中...' })
    Promise.all([
      request('/banner/list'),
      request('/web-design/hot'),
      request('/web-design/latest'),
      request('/graduation/hot'),
      request('/graduation/latest')
    ]).then(([banners, webHot, webLatest, gpHot, gpLatest]) => {
      // 兼容 code:0 和 code:200
      const normalize = (res) => {
        if (!res || (res.code !== 0 && res.code !== 200)) return []
        const data = res.data || []
        if (Array.isArray(data)) return data
        if (data.records) return data.records
        return []
      }

      const bannerList = normalize(banners)

      const merge = (list, type) => normalize(list).map(item => ({
        ...item,
        _type: type,
        tagsArray: item.tags ? item.tags.split(',').filter(t => t.trim()) : []
      }))

      this.setData({
        banners: bannerList,
        hotList: [...merge(webHot, 'web'), ...merge(gpHot, 'gp')].slice(0, 6),
        latestList: [...merge(webLatest, 'web'), ...merge(gpLatest, 'gp')].slice(0, 6)
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
  },

  goBanner(e) {
    const { index } = e.currentTarget.dataset
    const banner = this.data.banners[index]
    if (!banner) return
    switch (banner.linkType) {
      case 2:
        if (banner.linkId) wx.navigateTo({ url: `/pages/web-design/detail?id=${banner.linkId}` })
        break
      case 3:
        if (banner.linkId) wx.navigateTo({ url: `/pages/graduation/detail?id=${banner.linkId}` })
        break
      case 4:
        if (banner.linkUrl) wx.navigateTo({ url: `/pages/web-view/web-view?url=${encodeURIComponent(banner.linkUrl)}` })
        break
      default:
        break
    }
  },

  onBannerImageError(e) {
    const index = Number(e.currentTarget.dataset.index)
    if (Number.isNaN(index)) return
    const list = [...this.data.banners]
    if (!list[index] || list[index].imageUrl === '/static/default.png') return
    list[index] = { ...list[index], imageUrl: '/static/default.png' }
    this.setData({ banners: list })
  },

  onHotCoverError(e) {
    const index = Number(e.currentTarget.dataset.index)
    if (Number.isNaN(index)) return
    const list = [...this.data.hotList]
    if (!list[index] || list[index].coverImage === '/static/default.png') return
    list[index] = { ...list[index], coverImage: '/static/default.png' }
    this.setData({ hotList: list })
  },

  onLatestCoverError(e) {
    const index = Number(e.currentTarget.dataset.index)
    if (Number.isNaN(index)) return
    const list = [...this.data.latestList]
    if (!list[index] || list[index].coverImage === '/static/default.png') return
    list[index] = { ...list[index], coverImage: '/static/default.png' }
    this.setData({ latestList: list })
  }
})
