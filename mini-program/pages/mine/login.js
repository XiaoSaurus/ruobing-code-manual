const app = getApp()
const { mapServerUser, isApiSuccess } = require('../../utils/userSync.js')
const { buildThemePageStyle } = require('../../utils/themeUi.js')

const MODAL_AGREE_TIP =
  '请先勾选「登录即表示同意《用户协议》和《隐私政策》」\r\n是否同意并继续？'
const TOAST_TAP_AGAIN = '请再次点击\n「微信授权登录」'

Page({
  data: {
    loading: false,
    pageStyle: '',
    agreed: false
  },

  onLoad() {
    this.applyTheme()
    const token = wx.getStorageSync('accessToken')
    const userInfo = wx.getStorageSync('userInfo')
    if (token && userInfo && userInfo.openid) {
      wx.navigateBack()
    }
  },

  onUnload() {},

  onShow() {
    this.applyTheme()
  },

  applyTheme() {
    const theme = app.globalData.currentTheme || app.globalData.themes[0]
    this.setData({ pageStyle: buildThemePageStyle(theme) })
  },

  toggleAgree() {
    this.setData({ agreed: !this.data.agreed })
  },

  openLegal(e) {
    const type = e.currentTarget.dataset.type || 'user'
    wx.navigateTo({ url: `/pages/mine/legal?type=${type}` })
  },

  ensureAgreeThen(next) {
    if (this.data.agreed) { next(); return }
    wx.showModal({
      title: '提示',
      content: MODAL_AGREE_TIP,
      confirmText: '同意',
      cancelText: '取消',
      success: res => {
        if (!res.confirm) return
        this.setData({ agreed: true }, () => next())
      }
    })
  },

  /** 处理登录响应：存 Token + userInfo */
  applyLoginResponse(res) {
    if (!isApiSuccess(res)) {
      wx.showToast({ title: res.msg || res.message || '登录失败', icon: 'none' })
      return
    }
    const data = res.data || {}
    const token = data.accessToken
    if (!token) {
      wx.showToast({ title: '登录数据异常', icon: 'none' })
      return
    }

    // 存 Token
    app.setToken(token)

    // 构建本地 userInfo
    const userInfo = {
      id: data.userId,
      openid: data.openid || '',
      nickName: data.nickname || '',
      avatarUrl: data.avatar || '',
      gender: 0,
      province: '', city: '', district: '',
      regionValue: [], regionDisplayText: '',
      loginTime: Date.now()
    }
    wx.setStorageSync('userInfo', userInfo)
    app.globalData.userInfo = userInfo

    wx.showToast({ title: '登录成功', icon: 'success' })
    setTimeout(() => wx.navigateBack(), 800)
  },

  onLoginTap() {
    if (this.data.loading) return
    if (!this.data.agreed) {
      wx.showModal({
        title: '提示',
        content: MODAL_AGREE_TIP,
        confirmText: '同意',
        cancelText: '取消',
        success: res => {
          if (!res.confirm) return
          this.setData({ agreed: true }, () => {
            wx.getUserProfile({
              desc: '用于展示头像与昵称',
              success: r => { if (r.userInfo) this.doWechatLogin(r.userInfo) },
              fail: () => {
                wx.showToast({ title: TOAST_TAP_AGAIN, icon: 'none', duration: 3000 })
              }
            })
          })
        }
      })
      return
    }
    wx.getUserProfile({
      desc: '用于展示头像与昵称',
      success: res => {
        if (res.userInfo) {
          this.doWechatLogin(res.userInfo)
        } else {
          wx.showToast({ title: '获取用户信息失败', icon: 'none' })
        }
      },
      fail: () => {
        wx.showToast({ title: '需要授权才能登录', icon: 'none' })
      }
    })
  },

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
        // 调新后端 /auth/wx-login
        app.globalData.request
          .post('/auth/wx-login', {
            code: loginRes.code,
            nickname: userInfo.nickName,
            avatar: userInfo.avatarUrl
          })
          .then(res => {
            wx.hideLoading()
            this.setData({ loading: false })
            this.applyLoginResponse(res)
          })
          .catch(err => {
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
  }
})
