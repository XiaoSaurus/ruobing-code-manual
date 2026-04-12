const app = getApp()

Page({
  data: {
    form: {
      id: '',
      openid: '',
      avatarUrl: '',
      nickName: '',
      gender: 0,
      province: '',
      city: ''
    },
    genderText: '未设置',
    saving: false
  },

  onLoad() {
    this.loadProfile()
  },

  onShow() {
    this.loadProfile()
  },

  loadProfile() {
    const userInfo = wx.getStorageSync('userInfo') || {}
    const genderMap = { 0: '未设置', 1: '男', 2: '女' }
    this.setData({
      form: {
        id: userInfo.id || '',
        openid: userInfo.openid || '',
        avatarUrl: userInfo.avatarUrl || '',
        nickName: userInfo.nickName || '',
        gender: userInfo.gender || 0,
        province: userInfo.province || '',
        city: userInfo.city || ''
      },
      genderText: genderMap[userInfo.gender] || '未设置'
    })
  },

  // 微信按钮选择头像（button open-type="chooseAvatar" 方式）
  onChooseAvatar(e) {
    const tempFilePath = e.detail.avatarUrl
    this.setData({ 'form.avatarUrl': tempFilePath })
    // 头像选了直接保存
    this.saveProfile()
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

  editRegion() {
    wx.chooseLocation({
      success: res => {
        const address = res.address || ''
        // 地址格式：省 市 区/县 详情地址
        const parts = address.split(/省|市/)
        let province = '', city = ''
        if (parts.length >= 2) {
          province = parts[0] + (address.includes('省') ? '省' : '')
          city = parts[1] ? (parts[1] + (address.includes('市') ? '市' : '')) : ''
        } else {
          province = address
        }
        this.setData({
          'form.province': province,
          'form.city': city
        })
      },
      fail: () => {
        // 用户取消不提示
      }
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
      city: form.city
    }
    wx.setStorageSync('userInfo', userInfo)
    app.globalData.userInfo = userInfo

    app.globalData.request.put('/user/info', {
      openid: form.openid,
      nickname: nickname,
      avatar: form.avatarUrl,
      gender: form.gender,
      phone: form.phone || '',
      email: form.email || ''
    }).then(res => {
      this.setData({ saving: false })
      if (res.code === 200 || res.code === 0) {
        wx.showToast({ title: '保存成功', icon: 'success' })
        setTimeout(() => wx.navigateBack(), 800)
      } else {
        wx.showToast({ title: (res.message || '保存失败'), icon: 'none' })
      }
    }).catch(err => {
      this.setData({ saving: false })
      wx.showToast({ title: '本地已保存，后端同步失败', icon: 'none' })
      setTimeout(() => wx.navigateBack(), 800)
    })
  }
})
