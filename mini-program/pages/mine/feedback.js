const { request } = require('../../utils/request.js')
Page({
  data: { content: '', contact: '' },
  onContentInput(e) { this.setData({ content: e.detail.value }) },
  onContactInput(e) { this.setData({ contact: e.detail.value }) },
  submit() {
    if (!this.data.content) {
      wx.showToast({ title: '请输入反馈内容', icon: 'none' })
      return
    }
    request('/feedback', {
      method: 'POST',
      data: { content: this.data.content, contact: this.data.contact }
    }).then(() => {
      wx.showToast({ title: '提交成功', icon: 'success' })
      setTimeout(() => wx.navigateBack(), 1500)
    })
  }
})
