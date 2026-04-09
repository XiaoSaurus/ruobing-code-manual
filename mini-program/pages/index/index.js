const { request } = require('../../utils/request.js')

Page({
  data: {
    hotList: [],
    latestList: [],
    keyword: '',
    isSearching: false,
    searchResult: []
  },

  onLoad() {
    this.loadData()
  },

  onShow() {
    // 从搜索结果返回时恢复首页
    if (this.data.isSearching) {
      this.setData({ isSearching: false, searchResult: [], keyword: '' })
    }
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

  onInput(e) {
    this.setData({ keyword: e.detail.value })
  },

  doSearch() {
    const keyword = (this.data.keyword || '').trim()
    if (!keyword) {
      wx.showToast({ title: '请输入搜索关键词', icon: 'none' })
      return
    }
    this._executeSearch(keyword)
  },

  onSearch(e) {
    const keyword = (e.detail.value || '').trim()
    if (!keyword) return
    this.setData({ keyword })
    this._executeSearch(keyword)
  },

  _executeSearch(keyword) {
    wx.showLoading({ title: '搜索中...' })
    // 同时搜索网页设计和毕业设计
    Promise.all([
      request('/web-design/list', { data: { keyword, page: 1, pageSize: 20 } }),
      request('/graduation/list', { data: { keyword, page: 1, pageSize: 20 } })
    ]).then(([webRes, gpRes]) => {
      const normalize = (res) => {
        if (!res || res.code !== 200) return []
        const data = res.data || []
        if (Array.isArray(data)) return data
        if (data.records) return data.records
        return []
      }
      const webResults = normalize(webRes).map(item => ({ ...item, _type: 'web' }))
      const gpResults = normalize(gpRes).map(item => ({ ...item, _type: 'gp' }))
      const allResults = [...webResults, ...gpResults]
      this.setData({
        isSearching: true,
        searchResult: allResults
      })
      wx.hideLoading()
      if (allResults.length === 0) {
        wx.showToast({ title: '未找到相关资源', icon: 'none' })
      }
    }).catch(err => {
      wx.hideLoading()
      console.error('search error:', err)
      wx.showToast({ title: '搜索失败', icon: 'none' })
    })
  },

  clearSearch() {
    this.setData({ isSearching: false, searchResult: [], keyword: '' })
  },

  goDetail(e) {
    const { type, id } = e.currentTarget.dataset
    if (type === 'web' || type === 'gp') {
      const page = type === 'web' ? 'web-design' : 'graduation'
      wx.navigateTo({ url: `/pages/${page}/detail?id=${id}` })
    }
  }
})
