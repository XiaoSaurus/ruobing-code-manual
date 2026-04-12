const { request } = require('./request.js')

/** 与后端 Result.code 兼容（数字或字符串） */
function isApiSuccess(res) {
  if (!res || res.code === undefined || res.code === null) return false
  const c = res.code
  return c === 200 || c === 0 || c === '200' || c === '0'
}

function buildRegionDisplay(province, city, district) {
  const parts = [province, city, district].filter(Boolean)
  return parts.length ? parts.join(' ') : ''
}

/**
 * 后端 User（nickname/avatar 等）→ 小程序本地 userInfo 结构
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
  return {
    id: u.id,
    openid: u.openid,
    nickName: u.nickname || '',
    avatarUrl: u.avatar || '',
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
 * GET /user/info 拉取数据库中的最新资料（登录后、进入「我的」等场景使用）
 */
function pullUserFromServer(openid) {
  if (!openid) return Promise.resolve(null)
  return request
    .get('/user/info', { openid })
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
