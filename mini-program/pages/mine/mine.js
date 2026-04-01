const { request } = require('../../utils/request.js')

Page({
  data: {
    userInfo: {}
  },

  onLoad() {
    const userInfo = wx.getStorageSync('userInfo') || {}
    this.setData({ userInfo })
  },

  onShow() {
    const userInfo = wx.getStorageSync('userInfo') || {}
    this.setData({ userInfo })
  },

  goFeedback() {
    wx.navigateTo({ url: '/pages/mine/feedback' })
  },

  goChangelog() {
    wx.navigateTo({ url: '/pages/mine/changelog' })
  },

  goAbout() {
    wx.navigateTo({ url: '/pages/mine/about' })
  }
})
