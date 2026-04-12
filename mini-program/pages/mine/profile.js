const app = getApp()

Page({
  data: {
    form: {
      avatarUrl: '',
      nickName: '',
      gender: 0,
      province: '',
      city: ''
    },
    genderText: '未设置'
  },

  onLoad() {
    this.loadProfile()
  },

  loadProfile() {
    const userInfo = wx.getStorageSync('userInfo') || {}
    const genderMap = { 0: '未设置', 1: '男', 2: '女' }
    this.setData({
      form: userInfo,
      genderText: genderMap[userInfo.gender] || '未设置'
    })
  },

  // 更换头像（调起微信头像选择）
  changeAvatar() {
    wx.chooseAvatar({
      success: res => {
        // 微信 chooseAvatar 返回临时文件路径
        const tempFilePath = res.avatarUrl
        this.setData({ 'form.avatarUrl': tempFilePath })
      }
    })
  },

  // 编辑昵称
  editNickname() {
    const current = this.data.form.nickName || ''
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

  // 保存
  saveProfile() {
    const form = this.data.form
    if (!form.nickName || !form.nickName.trim()) {
      wx.showToast({ title: '请设置昵称', icon: 'none' })
      return
    }
    const userInfo = { ...form, nickName: form.nickName.trim() }
    wx.setStorageSync('userInfo', userInfo)
    app.globalData.userInfo = userInfo
    wx.showToast({ title: '保存成功', icon: 'success' })
    setTimeout(() => wx.navigateBack(), 800)
  },

})
