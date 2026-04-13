const { request } = require('../../utils/request.js')
const { markdownToHtml } = require('../../utils/simpleMarkdown.js')
const app = getApp()

Page({
  data: {
    detail: null,
    articleUrl: '',
    formattedTime: '',
    summaryHtml: '',
    themeClass: '',
    pageStyle: '',
    liked: false,
    collected: false,
    lastTapTime: 0  // 上一次点击时间，用于检测双击
  },

  onLoad(options) {
    this.applyTheme()
    if (options.id) {
      request(`/graduation/${options.id}`).then(res => {
        const detail = res.data || {}
        const accent = (app.globalData.currentTheme && app.globalData.currentTheme.color) || '#409EFF'
        this.setData({
          detail: detail,
          articleUrl: detail.articleUrl || '',
          formattedTime: this.formatDateTime(detail.updateTime || detail.createTime),
          summaryHtml: markdownToHtml(detail.description || '', accent)
        })
      })
    }
  },

  onShow() {
    this.applyTheme()
  },

  applyTheme() {
    const theme = app.globalData.currentTheme
    if (!theme) return
    const style = `--theme-color: ${theme.color}; --theme-light: ${theme.light}; --theme-dark: ${theme.dark};`
    this.setData({
      themeClass: 'theme-' + theme.id,
      pageStyle: style
    })
    if (this.data.detail) {
      this.setData({
        summaryHtml: markdownToHtml(this.data.detail.description || '', theme.color || '#409EFF')
      })
    }
  },

  formatDateTime(value) {
    if (!value) return ''
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return String(value)
    const pad = n => String(n).padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  },

  // 打开公众号文章
  openArticle() {
    if (this.data.articleUrl) {
      wx.navigateTo({
        url: `/pages/web-view/web-view?url=${encodeURIComponent(this.data.articleUrl)}`
      })
    }
  },

  // 双击点赞 - 检测两次点击间隔
  handleDoubleTap() {
    const now = Date.now()
    const diff = now - this.data.lastTapTime
    
    // 如果两次点击间隔小于300ms，视为双击
    if (diff > 0 && diff < 300) {
      this.handleLike()
    }
    
    // 更新上次点击时间
    this.setData({ lastTapTime: now })
  },

  // 点赞 / 取消点赞（单击按钮或双击屏幕）
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
  },

  handleCollect() {
    const isCollected = this.data.collected
    const detail = this.data.detail
    this.setData({ collected: !isCollected })

    if (detail) {
      const newFavorites = isCollected
        ? Math.max(0, (detail.favorites || 0) - 1)
        : (detail.favorites || 0) + 1
      this.setData({
        detail: { ...detail, favorites: newFavorites }
      })
    }

    wx.showToast({
      title: isCollected ? '已取消收藏' : '收藏成功',
      icon: 'none'
    })
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
