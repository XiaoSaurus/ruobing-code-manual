const app = getApp()

Page({
  data: {
    loading: false
  },

  onLoad() {
    // 如果已经登录，直接跳转回来
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      wx.navigateBack()
    }
  },

  // 微信授权登录（获取用户信息）
  onGetUserInfo(e) {
    if (e.detail.errMsg !== 'getUserProfile:ok') {
      wx.showToast({ title: '您取消了授权', icon: 'none' })
      return
    }
    const userInfo = e.detail.userInfo
    this.saveAndLogin(userInfo)
  },

  // 获取手机号（需企业认证账号）
  onGetPhoneNumber(e) {
    if (e.detail.errMsg !== 'getPhoneNumber:ok') {
      wx.showToast({ title: '授权失败，请重试', icon: 'none' })
      return
    }
    // 真实项目：把 e.detail 传给后端，后端调微信接口解密
    wx.showToast({ title: '手机号获取需企业认证', icon: 'none' })
  },

  // 演示：游客登录（仅本地演示用）
  onGuestLogin() {
    const guestInfo = {
      nickName: '游客_' + Math.random().toString(36).slice(2, 7),
      avatarUrl: '/static/default-avatar.png',
      gender: 0,
      province: '',
      city: '',
      country: ''
    }
    this.saveAndLogin(guestInfo)
  },

  // 保存并跳转
  saveAndLogin(userInfo) {
    const storeInfo = {
      nickName: userInfo.nickName || userInfo.nickname,
      avatarUrl: userInfo.avatarUrl,
      gender: userInfo.gender,
      province: userInfo.province,
      city: userInfo.city,
      country: userInfo.country,
      loginTime: Date.now()
    }
    wx.setStorageSync('userInfo', storeInfo)
    app.globalData.userInfo = storeInfo
    wx.showToast({ title: '登录成功', icon: 'success' })
    setTimeout(() => wx.navigateBack(), 800)
  }
})
