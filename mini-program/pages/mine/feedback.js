const { request } = require('../../utils/request.js')

Page({
  data: {
    content: '',
    contact: '',
    submitting: false
  },

  onContentInput(e) {
    this.setData({ content: e.detail.value })
  },

  onContactInput(e) {
    this.setData({ contact: e.detail.value })
  },

  submit() {
    if (!this.data.content.trim()) {
      wx.showToast({ title: '请输入反馈内容', icon: 'none' })
      return
    }
    this.setData({ submitting: true })
    request('/feedback', {
      method: 'POST',
      data: {
        content: this.data.content.trim(),
        contact: this.data.contact.trim()
      }
    }).then(res => {
      this.setData({ submitting: false })
      if (res.code === 200 || res.code === 0) {
        wx.showToast({ title: '提交成功，感谢您的反馈！', icon: 'success' })
        setTimeout(() => wx.navigateBack(), 1500)
      } else {
        wx.showToast({ title: res.message || '提交失败', icon: 'none' })
      }
    }).catch(() => {
      this.setData({ submitting: false })
      wx.showToast({ title: '网络错误，请重试', icon: 'none' })
    })
  }
})
