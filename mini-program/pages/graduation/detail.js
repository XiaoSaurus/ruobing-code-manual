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
      request(`/graduation/${options.id}`).then(res => {
        const detail = res.data || {}
        this.setData({
          detail: detail,
          articleUrl: detail.articleUrl || ''
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

  // 点赞 / 取消点赞
  handleLike() {
    const isLiked = this.data.liked
    const detail = this.data.detail
    
    // 切换点赞状态
    this.setData({ liked: !isLiked })
    
    // 更新本地显示的点赞数
    if (detail) {
      const newLikes = isLiked 
        ? Math.max(0, (detail.likes || 0) - 1)  // 取消点赞，-1
        : (detail.likes || 0) + 1                // 点赞，+1
      
      this.setData({
        detail: { ...detail, likes: newLikes }
      })
    }
    
    // 显示提示
    if (isLiked) {
      wx.showToast({ title: '已取消点赞', icon: 'none' })
    } else {
      wx.showToast({ title: '点赞成功 ❤️', icon: 'none' })
    }
    
    // TODO: 调用后端API更新点赞数
    // request('/graduation/like', { method: 'POST', data: { id: this.data.detail.id, liked: !isLiked } })
  },

  // 分享
  onShareAppMessage() {
    return {
      title: this.data.detail?.title || '毕业设计分享',
      path: `/pages/graduation/detail?id=${this.data.detail?.id}`,
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
