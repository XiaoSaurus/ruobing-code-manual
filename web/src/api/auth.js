import request from '../utils/request'

export const authApi = {
  /** 管理员 SysUser */
  login: (data) => request.post('/auth/login', data),
  register: (data) => request.post('/auth/register', data),
  forgotPassword: (data) => request.post('/auth/forgot-password', data),
  getMe: () => request.get('/auth/me'),
  updateMyProfile: (data) => request.put('/auth/me/profile', data),
  getMenus: () => request.get('/auth/menus'),

  /** Web C 端 user 表 */
  sendAppSms: (data) => request.post('/auth/app/sms/send', data),
  loginAppSms: (data) => request.post('/auth/app/sms/login', data),
  getAppMe: () => request.get('/auth/app/me'),
  updateAppMeProfile: (data) => request.put('/auth/app/me/profile', data),
  getWechatAuthorizeUrl: () => request.get('/auth/wechat/authorize-url'),
  exchangeOAuthTicket: (data) => request.post('/auth/oauth/ticket', data)
}
