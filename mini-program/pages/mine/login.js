const app = getApp()
const { mapServerUser, pullUserFromServer, isApiSuccess } = require('../../utils/userSync.js')
const { buildThemePageStyle } = require('../../utils/themeUi.js')

/** 协议弹窗：仅一处换行（部分机型需 \r\n）；getUserProfile 失败用 toast，勿用二次确认弹窗 */
const MODAL_AGREE_TIP =
  '请先勾选「登录即表示同意《用户协议》和《隐私政策》」\r\n是否同意并继续？'
const TOAST_TAP_AGAIN = '请再次点击\n「微信授权登录」'

function isValidCnPhone(p) {
  return /^1[3-9]\d{9}$/.test((p || '').trim())
}

Page({
  data: {
    loading: false,
    pageStyle: '',
    agreed: false,
    loginMode: 'phone',
    phone: '',
    smsCode: '',
    smsCooldown: 0
  },

  smsTimer: null,

  onLoad() {
    this.applyTheme()
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo && userInfo.openid) {
      wx.navigateBack()
    }
  },

  onUnload() {
    if (this.smsTimer) {
      clearInterval(this.smsTimer)
      this.smsTimer = null
    }
  },

  onShow() {
    this.applyTheme()
  },

  applyTheme() {
    const theme = app.globalData.currentTheme || app.globalData.themes[0]
    this.setData({
      pageStyle: buildThemePageStyle(theme)
    })
  },

  onLoginModeTap(e) {
    const mode = e.currentTarget.dataset.mode
    if (!mode || mode === this.data.loginMode) return
    this.setData({ loginMode: mode })
  },

  onPhoneInput(e) {
    const raw = (e.detail.value || '').replace(/\D/g, '').slice(0, 11)
    this.setData({ phone: raw })
  },

  onSmsInput(e) {
    const raw = (e.detail.value || '').replace(/\D/g, '').slice(0, 6)
    this.setData({ smsCode: raw })
  },

  toggleAgree() {
    this.setData({ agreed: !this.data.agreed })
  },

  openLegal(e) {
    const type = e.currentTarget.dataset.type || 'user'
    wx.navigateTo({ url: `/pages/mine/legal?type=${type}` })
  },

  startSmsCooldown() {
    if (this.smsTimer) {
      clearInterval(this.smsTimer)
      this.smsTimer = null
    }
    this.setData({ smsCooldown: 60 })
    this.smsTimer = setInterval(() => {
      const n = this.data.smsCooldown - 1
      if (n <= 0) {
        clearInterval(this.smsTimer)
        this.smsTimer = null
        this.setData({ smsCooldown: 0 })
      } else {
        this.setData({ smsCooldown: n })
      }
    }, 1000)
  },

  ensureAgreeThen(next) {
    if (this.data.agreed) {
      next()
      return
    }
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

  onSendSms() {
    if (this.data.smsCooldown > 0) return
    const phone = (this.data.phone || '').trim()
    if (!isValidCnPhone(phone)) {
      wx.showToast({ title: '请输入11位手机号', icon: 'none' })
      return
    }
    this.ensureAgreeThen(() => {
      wx.showLoading({ title: '发送中…' })
      app.globalData.request
        .post('/user/sms/send', { phone })
        .then(res => {
          wx.hideLoading()
          if (!isApiSuccess(res)) {
            wx.showToast({ title: res.message || res.msg || '发送失败', icon: 'none' })
            return
          }
          wx.showToast({ title: '验证码已发送', icon: 'success' })
          this.startSmsCooldown()
        })
        .catch(() => {
          wx.hideLoading()
          wx.showToast({ title: '网络异常', icon: 'none' })
        })
    })
  },

  onPhoneLoginTap() {
    if (this.data.loading) return
    const phone = (this.data.phone || '').trim()
    const code = (this.data.smsCode || '').trim()
    if (!isValidCnPhone(phone)) {
      wx.showToast({ title: '请输入11位手机号', icon: 'none' })
      return
    }
    if (!code || code.length < 4) {
      wx.showToast({ title: '请输入验证码', icon: 'none' })
      return
    }
    this.ensureAgreeThen(() => this.doPhoneLogin(phone, code))
  },

  doPhoneLogin(phone, code) {
    this.setData({ loading: true })
    wx.showLoading({ title: '登录中…' })
    app.globalData.request
      .post('/user/sms/login', { phone, code })
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

  applyLoginResponse(res) {
    if (!isApiSuccess(res)) {
      wx.showToast({ title: res.message || res.msg || '登录失败', icon: 'none' })
      return
    }
    const u = res.data && res.data.user
    let storeInfo = mapServerUser(u)
    if (!storeInfo || !storeInfo.openid) {
      wx.showToast({ title: '登录数据异常', icon: 'none' })
      return
    }
    wx.showLoading({ title: '同步资料…' })
    pullUserFromServer(storeInfo.openid)
      .then(fresh => {
        wx.hideLoading()
        if (fresh) {
          storeInfo = fresh
        }
        wx.setStorageSync('userInfo', storeInfo)
        app.globalData.userInfo = storeInfo
        wx.showToast({ title: '登录成功', icon: 'success' })
        setTimeout(() => wx.navigateBack(), 800)
      })
      .catch(() => {
        wx.hideLoading()
        wx.setStorageSync('userInfo', storeInfo)
        app.globalData.userInfo = storeInfo
        wx.showToast({ title: '登录成功', icon: 'success' })
        setTimeout(() => wx.navigateBack(), 800)
      })
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
              success: r => {
                if (r.userInfo) this.doWechatLogin(r.userInfo)
              },
              fail: () => {
                wx.showToast({
                  title: TOAST_TAP_AGAIN,
                  icon: 'none',
                  duration: 3000
                })
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
        app.globalData.request
          .post('/user/login', {
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
