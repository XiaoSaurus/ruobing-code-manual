const app = getApp()

Page({
  data: {
    loading: false
  },

  onLoad() {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo && userInfo.openid) {
      wx.navigateBack()
    }
  },

  // 微信授权登录（真实流程）
  onGetUserInfo(e) {
    if (this.data.loading) return
    // 用户点拒绝按钮时 errMsg 包含 "auth deny" 或 "cancel"
    const errMsg = e.detail.errMsg || ''
    if (errMsg.includes('cancel') || errMsg.includes('deny') || errMsg.includes('fail')) {
      wx.showToast({ title: '您取消了授权', icon: 'none' })
      return
    }
    const userInfo = e.detail.userInfo
    if (!userInfo) {
      wx.showToast({ title: '获取用户信息失败', icon: 'none' })
      return
    }
    this.doWechatLogin(userInfo)
  },

  // 正式微信登录流程：wx.login() → 拿 code 换 openid → 后端注册/登录
  doWechatLogin(userInfo) {
    this.setData({ loading: true })
    wx.showLoading({ title: '登录中…' })

    wx.login({
      success: loginRes => {
        if (!loginRes.code) {
          wx.hideLoading()
          this.setData({ loading: false })
          wx.showToast({ title: '微信登录失败', icon: 'none' })
          return
        }
        // 调用后端登录接口（后端拿 code 换 openid，新用户自动入库）
        app.globalData.request.post('/user/login', {
          code: loginRes.code,
          nickname: userInfo.nickName,
          avatar: userInfo.avatarUrl
        }).then(res => {
          wx.hideLoading()
          this.setData({ loading: false })
          if (res.code === 200 || res.code === 0) {
            const user = res.data?.user || {}
            const storeInfo = {
              id: user.id,
              openid: user.openid,
              nickName: user.nickname || userInfo.nickName,
              avatarUrl: user.avatar || userInfo.avatarUrl,
              gender: userInfo.gender,
              province: userInfo.province,
              city: userInfo.city,
              loginTime: Date.now()
            }
            wx.setStorageSync('userInfo', storeInfo)
            app.globalData.userInfo = storeInfo
            wx.showToast({ title: '登录成功', icon: 'success' })
            setTimeout(() => wx.navigateBack(), 800)
          } else {
            wx.showToast({ title: (res.message || '登录失败'), icon: 'none' })
          }
        }).catch(err => {
          wx.hideLoading()
          this.setData({ loading: false })
          wx.showToast({ title: '网络异常，请重试', icon: 'none' })
          console.error('登录失败:', err)
        })
      },
      fail: () => {
        wx.hideLoading()
        this.setData({ loading: false })
        wx.showToast({ title: '微信登录失败', icon: 'none' })
      }
    })
  },

  // 暂不登录：直接返回"我的"，不保存任何信息
  onGuestLogin() {
    wx.navigateBack()
  }
})
