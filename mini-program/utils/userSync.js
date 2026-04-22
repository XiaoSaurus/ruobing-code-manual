const { request } = require('./request.js')

/** 新后端 code:0 为成功 */
function isApiSuccess(res) {
  if (!res || res.code === undefined || res.code === null) return false
  const c = res.code
  return c === 0 || c === 200 || c === '0' || c === '200'
}

function buildRegionDisplay(province, city, district) {
  const parts = [province, city, district].filter(Boolean)
  return parts.length ? parts.join(' ') : ''
}

/**
 * 后端 User → 小程序本地 userInfo 结构
 */
function mapServerUser(u) {
  if (!u || typeof u !== 'object') return null
  const p = u.province || ''
  const c = u.city || ''
  const d = u.district || ''
  const regionValue = p || c || d ? [p, c || '', d || ''] : []
  const regionDisplayText = buildRegionDisplay(p, c, d)
  let gender = 0
  if (typeof u.gender === 'number' && !Number.isNaN(u.gender)) {
    gender = u.gender
  } else if (u.gender != null && u.gender !== '') {
    const n = parseInt(String(u.gender), 10)
    gender = Number.isNaN(n) ? 0 : n
  }
  // 微信临时文件路径（wxfile://）已过期，过滤为空以显示默认头像
  const rawAvatar = u.avatar || ''
  const avatarUrl = (rawAvatar.startsWith && rawAvatar.startsWith('wxfile://')) ? '' : rawAvatar
  return {
    id: u.id,
    openid: u.openid || '',
    phone: u.phone || '',
    nickName: u.nickname || '',
    avatarUrl,
    gender,
    province: p,
    city: c || '',
    district: d || '',
    regionValue,
    regionDisplayText,
    loginTime: Date.now()
  }
}

/**
 * GET /auth/userinfo — 用 Token 拉取最新用户信息
 */
function pullUserFromServer() {
  const token = wx.getStorageSync('accessToken') || ''
  if (!token) return Promise.resolve(null)
  return request.get('/auth/userinfo')
    .then(res => {
      if (!isApiSuccess(res)) return null
      const u = res.data
      if (!u) return null
      return mapServerUser(u)
    })
    .catch(() => null)
}

module.exports = {
  mapServerUser,
  pullUserFromServer,
  buildRegionDisplay,
  isApiSuccess
}
