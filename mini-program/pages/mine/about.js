const { request } = require('../../utils/request.js')
Page({
  data: { about: null },
  onLoad() {
    request('/about').then(res => this.setData({ about: res.data }))
  }
})
