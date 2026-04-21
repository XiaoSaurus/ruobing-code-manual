const app = getApp()
const { mapServerUser, pullUserFromServer, isApiSuccess } = require('../../utils/userSync.js')
const { buildThemePageStyle } = require('../../utils/themeUi.js')

/** 协议弹窗：仅一处换行（部分机型需 \r\n）；getUserProfile 失败用 toast，勿用二次确认弹窗 */
const MODAL_AGREE_TIP =
  '请先勾选「登录即表示同意《用户协议》和《隐私政策》」\r\n是否同意并继续？'
const TOAST_TAP_AGAIN = '请再次点击\n「微信授权登录」'

function pickLoginUser(res) {
  if (!res || typeof res !== 'object') return null
  const data = res.data
  if (!data || typeof data !== 'object') return null
  // 兼容多种后端结构：{data:{user}}, {data:{result}}, {data:{...userFields}}
  return data.user || data.result || data.profile || data
}

function normalizeUserShape(u) {
  if (!u || typeof u !== 'object') return null
  const openid = u.openid || u.openId || u.open_id || ''
  if (!openid) return null
  return {
    ...u,
    openid,
    nickname: u.nickname || u.nickName || '',
    avatar: u.avatar || u.avatarUrl || ''
  }
}

Page({
  data: {
    loading: false,
    pageStyle: '',
    agreed: false
  },

  onLoad() {
    this.applyTheme()
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo && userInfo.openid) {
      wx.navigateBack()
    }
  },

  onUnload() {},

  onShow() {
    this.applyTheme()
  },

  applyTheme() {
    const theme = app.globalData.currentTheme || app.globalData.themes[0]
    this.setData({
      pageStyle: buildThemePageStyle(theme)
    })
  },

  toggleAgree() {
    this.setData({ agreed: !this.data.agreed })
  },

  openLegal(e) {
    const type = e.currentTarget.dataset.type || 'user'
    wx.navigateTo({ url: `/pages/mine/legal?type=${type}` })
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

  applyLoginResponse(res) {
    if (!isApiSuccess(res)) {
      wx.showToast({ title: res.message || res.msg || '登录失败', icon: 'none' })
      return
    }
    const rawUser = pickLoginUser(res)
    const dataRoot = res && res.data && typeof res.data === 'object' ? res.data : {}
    // 后端兜底：允许 openid 挂在 data 根节点，避免 user 对象缺字段时误判登录失败
    const mergedUser = rawUser && typeof rawUser === 'object'
      ? { ...rawUser, openid: rawUser.openid || rawUser.openId || rawUser.open_id || dataRoot.openid }
      : rawUser
    let storeInfo = mapServerUser(normalizeUserShape(mergedUser))
    if (!storeInfo || !storeInfo.openid) {
      wx.showToast({ title: '登录数据异常', icon: 'none' })
      console.error('登录返回数据不符合预期:', res)
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
