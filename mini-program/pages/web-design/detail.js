const { request } = require('../../utils/request.js')

Page({
  data: { detail: null },

  onLoad(options) {
    if (options.id) {
      request(`/web-design/${options.id}`).then(res => {
        this.setData({ detail: res.data })
      })
    }
  }
})
