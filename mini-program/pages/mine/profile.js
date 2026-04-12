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
    // 每次进入刷新，防止其他页面改了资料
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

  // 更换头像
  changeAvatar() {
    wx.chooseAvatar({
      success: res => {
        const tempFilePath = res.avatarUrl
        this.setData({ 'form.avatarUrl': tempFilePath })
        // 头像改了直接保存（不依赖用户点保存）
        this.saveToBackend({ avatar: tempFilePath })
      }
    })
  },

  // 编辑昵称
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

  // 选择性别
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

  // 保存（本地 + 后端同步）
  saveProfile() {
    if (this.data.saving) return
    const form = this.data.form
    if (!form.nickName || !form.nickName.trim()) {
      wx.showToast({ title: '请设置昵称', icon: 'none' })
      return
    }
    this.setData({ saving: true })
    const nickname = form.nickName.trim()

    // 1. 先更新本地
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

    // 2. 同步后端
    app.request.put('/user/info', {
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
      // 即使后端失败，本地已保存，提示用户
      wx.showToast({ title: '本地已保存，后端同步失败', icon: 'none' })
      setTimeout(() => wx.navigateBack(), 800)
    })
  }
})
