App({
  globalData: {
    apiBase: 'http://localhost:8080/api',
    userInfo: null
  },
  onLaunch() {
    // 登录获取用户信息
    wx.login({
      success: res => {
        // 获取 openid 后端处理
      }
    })
  }
})
