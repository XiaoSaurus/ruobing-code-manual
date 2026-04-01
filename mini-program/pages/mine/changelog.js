const { request } = require('../../utils/request.js')
Page({
  data: { list: [] },
  onLoad() {
    request('/changelog/list').then(res => this.setData({ list: res.data || [] }))
  }
})
