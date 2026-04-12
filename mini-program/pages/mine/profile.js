const app = getApp()
const { buildRegionDisplay, pullUserFromServer, isApiSuccess } = require('../../utils/userSync.js')
const { buildThemePageStyle } = require('../../utils/themeUi.js')

Page({
  data: {
    form: {
      id: '',
      openid: '',
      avatarUrl: '',
      nickName: '',
      gender: 0,
      province: '',
      city: '',
      district: ''
    },
    regionValue: [],
    regionDisplayText: '',
    genderText: '未设置',
    saving: false,
    pageStyle: ''
  },

  onLoad() {
    this.applyTheme()
    this.loadProfile()
  },

  onShow() {
    this.applyTheme()
    const openid = (wx.getStorageSync('userInfo') || {}).openid
    if (!openid) {
      this.loadProfile()
      return
    }
    pullUserFromServer(openid).then(fresh => {
      if (fresh) {
        wx.setStorageSync('userInfo', fresh)
        app.globalData.userInfo = fresh
      }
      this.loadProfile()
    })
  },

  loadProfile() {
    const userInfo = wx.getStorageSync('userInfo') || {}
    const genderMap = { 0: '未设置', 1: '男', 2: '女' }

    let regionValue = userInfo.regionValue
    if (!regionValue || !Array.isArray(regionValue) || regionValue.length !== 3) {
      const p = userInfo.province || ''
      const c = userInfo.city || ''
      const d = userInfo.district || ''
      regionValue = p ? [p, c || '', d || ''] : []
    }

    const regionDisplayText =
      userInfo.regionDisplayText ||
      buildRegionDisplay(
        userInfo.province || (regionValue[0] || ''),
        userInfo.city || (regionValue[1] || ''),
        userInfo.district || (regionValue[2] || '')
      )

    const g =
      userInfo.gender !== undefined && userInfo.gender !== null ? userInfo.gender : 0

    this.setData({
      form: {
        id: userInfo.id || '',
        openid: userInfo.openid || '',
        avatarUrl: userInfo.avatarUrl || '',
        nickName: userInfo.nickName || '',
        gender: g,
        province: userInfo.province || '',
        city: userInfo.city || '',
        district: userInfo.district || ''
      },
      regionValue,
      regionDisplayText,
      genderText: genderMap[g] || '未设置'
    })
  },

  applyTheme() {
    const theme = app.globalData.currentTheme || app.globalData.themes[0]
    this.setData({
      pageStyle: buildThemePageStyle(theme)
    })
  },

  /**
   * 微信官方头像选择（button open-type="chooseAvatar"）
   * @see https://developers.weixin.qq.com/miniprogram/dev/component/button.html
   */
  onChooseAvatar(e) {
    const url = e.detail && e.detail.avatarUrl
    if (url) {
      this.setData({ 'form.avatarUrl': url })
    }
  },

  editNickname() {
    wx.showModal({
      title: '修改昵称',
      editable: true,
      placeholderText: '请输入昵称',
      success: res => {
        if (res.confirm && res.content && res.content.trim()) {
          this.setData({ 'form.nickName': res.content.trim() })
        }
      }
    })
  },

  editGender() {
    wx.showActionSheet({
      itemList: ['未设置', '男', '女'],
      success: res => {
        const gender = res.tapIndex
        const genderMap = { 0: '未设置', 1: '男', 2: '女' }
        this.setData({
          'form.gender': gender,
          genderText: genderMap[gender]
        })
      }
    })
  },

  /** 省市区（原生 picker，无需定位权限） */
  onRegionChange(e) {
    const val = e.detail.value || []
    const [province = '', city = '', district = ''] = val
    const regionDisplayText = buildRegionDisplay(province, city, district)
    this.setData({
      regionValue: val,
      regionDisplayText,
      'form.province': province,
      'form.city': city,
      'form.district': district
    })
  },

  saveProfile() {
    if (this.data.saving) return
    const form = this.data.form
    if (!form.nickName || !form.nickName.trim()) {
      wx.showToast({ title: '请设置昵称', icon: 'none' })
      return
    }
    this.setData({ saving: true })
    const nickname = form.nickName.trim()

    const userInfo = {
      ...wx.getStorageSync('userInfo'),
      id: form.id,
      openid: form.openid,
      avatarUrl: form.avatarUrl,
      nickName: nickname,
      gender: form.gender,
      province: form.province,
      city: form.city,
      district: form.district,
      regionValue: this.data.regionValue,
      regionDisplayText: this.data.regionDisplayText
    }
    wx.setStorageSync('userInfo', userInfo)
    app.globalData.userInfo = userInfo

    app.globalData.request
      .put('/user/info', {
        openid: form.openid,
        nickname: nickname,
        avatar: form.avatarUrl,
        gender: form.gender,
        phone: form.phone || '',
        email: form.email || '',
        province: form.province || '',
        city: form.city || '',
        district: form.district || ''
      })
      .then(res => {
        this.setData({ saving: false })
        if (!isApiSuccess(res)) {
          wx.showToast({
            title: res.message || res.msg || '保存失败，请检查网络与登录状态',
            icon: 'none'
          })
          return
        }
        return pullUserFromServer(form.openid).then(fresh => {
          if (fresh) {
            wx.setStorageSync('userInfo', fresh)
            app.globalData.userInfo = fresh
          }
          wx.showToast({ title: '保存成功', icon: 'success' })
          setTimeout(() => wx.navigateBack(), 800)
        })
      })
      .catch(() => {
        this.setData({ saving: false })
        wx.showToast({ title: '网络异常，请检查后端是否启动', icon: 'none' })
      })
  }
})
