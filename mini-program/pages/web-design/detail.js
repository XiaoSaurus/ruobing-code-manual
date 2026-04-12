const { request } = require('../../utils/request.js')

Page({
  data: {
    detail: null,
    articleUrl: '',
    liked: false,
    touchStartTime: 0
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
  },

  // 双击点赞 - 通过触摸事件检测
  handleTouchStart(e) {
    this.setData({ touchStartTime: e.timeStamp })
  },

  handleTouchEnd(e) {
    const diff = e.timeStamp - this.data.touchStartTime
    // 双击间隔小于300ms
    if (diff > 0 && diff < 300) {
      this.handleLike()
    }
  },

  // 点赞
  handleLike() {
    if (this.data.liked) {
      wx.showToast({ title: '已经点过赞啦', icon: 'none' })
      return
    }
    
    this.setData({ liked: true })
    
    // 更新本地显示
    const detail = this.data.detail
    if (detail) {
      this.setData({
        detail: { ...detail, likes: (detail.likes || 0) + 1 }
      })
    }
    
    wx.showToast({ title: '点赞成功 ❤️', icon: 'none' })
    
    // TODO: 调用后端API更新点赞数
    // request('/web-design/like', { method: 'POST', data: { id: this.data.detail.id } })
  },

  // 分享
  onShareAppMessage() {
    return {
      title: this.data.detail?.title || '网页设计分享',
      path: `/pages/web-design/detail?id=${this.data.detail?.id}`,
      imageUrl: this.data.detail?.coverImage
    }
  },

  // 下载
  handleDownload() {
    wx.showModal({
      title: '下载资料',
      content: '该功能暂未开放，敬请期待',
      showCancel: false,
      confirmText: '知道了'
    })
  }
})
