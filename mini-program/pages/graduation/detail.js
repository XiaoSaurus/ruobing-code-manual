const { request } = require('../../utils/request.js')

Page({
  data: {
    detail: null,
    articleUrl: ''
  },

  onLoad(options) {
    if (options.id) {
      request(`/graduation/${options.id}`).then(res => {
        const detail = res.data || {}
        this.setData({
          detail: detail,
          articleUrl: detail.articleUrl || ''
        })
      })
    }
  }
})
