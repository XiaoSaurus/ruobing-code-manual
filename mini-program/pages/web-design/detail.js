const { request } = require('../../utils/request.js')

Page({
  data: {
    detail: null,
    articleUrl: ''
  },

  onLoad(options) {
    if (options.id) {
      request(`/web-design/${options.id}`).then(res => {
        this.setData({
          detail: res.data,
          articleUrl: res.data.articleUrl || ''
        })
      })
    }
  },

  // 打开公众号文章
  openArticle() {
    if (this.data.articleUrl) {
      wx.navigateTo({
        url: `/pages/web-view/web-view?url=${encodeURIComponent(this.data.articleUrl)}`
      })
    }
  }
})
