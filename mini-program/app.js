const { request } = require('./utils/request.js')

// 预设主题色板（共 12 种；首项「科技蓝」为默认）
const THEMES = [
  { id: 'blue',   name: '科技蓝',  color: '#66B1FF', light: '#E6F4FF', dark: '#409EFF' },
  { id: 'purple', name: '优雅紫',  color: '#B388FF', light: '#F3E8FF', dark: '#9C27B0' },
  { id: 'green',  name: '清新绿',  color: '#85CE61', light: '#E8F5E8', dark: '#67C23A' },
  { id: 'orange', name: '活力橙',  color: '#F0C78A', light: '#FFF7E6', dark: '#E6A23C' },
  { id: 'red',    name: '中国红',  color: '#F78989', light: '#FFE8E8', dark: '#F56C6C' },
  { id: 'pink',   name: '少女粉',  color: '#F4B8C5', light: '#FFEEF0', dark: '#E88A9C' },
  { id: 'cyan',   name: '天青色',  color: '#36CFC9', light: '#E6FFFB', dark: '#13C2C2' },
  { id: 'teal',   name: '松石绿',  color: '#3EB489', light: '#E8FFF4', dark: '#08979C' },
  { id: 'indigo', name: '靛青蓝',  color: '#7B95F6', light: '#EEF2FF', dark: '#5C6BC0' },
  { id: 'amber',  name: '暖阳黄',  color: '#F5A623', light: '#FFF8E6', dark: '#D48806' },
  { id: 'rose',   name: '蔷薇粉',  color: '#F472B6', light: '#FCE7F3', dark: '#DB2777' },
  { id: 'lilac',  name: '丁香紫',  color: '#B37FEB', light: '#F9F0FF', dark: '#9254DE' }
]

function normalizeSavedTheme(saved) {
  if (!saved || !saved.id) return THEMES[0]
  if (saved.id === 'white') return THEMES[0]
  const hit = THEMES.find(t => t.id === saved.id)
  if (hit) return hit
  return THEMES[0]
}

App({
  globalData: {
    // 线上后端服务
    apiBase: 'https://ruobing.site:4040/codemanual',
    // 本地后端服务
    // apiBase: 'http://localhost:4040/codemanual',
    userInfo: null,
    themes: THEMES,
    currentTheme: null,
    themeDirty: false,
    request: request
  },

  onLaunch() {
    const saved = wx.getStorageSync('theme')
    const theme = normalizeSavedTheme(saved)
    if (!saved || saved.id !== theme.id) {
      wx.setStorageSync('theme', theme)
    }
    this.setTheme(theme, false)
  },

  /** 获取存储的 accessToken */
  getToken() {
    return wx.getStorageSync('accessToken') || ''
  },

  /** 保存 accessToken */
  setToken(token) {
    if (token) {
      wx.setStorageSync('accessToken', token)
    } else {
      wx.removeStorageSync('accessToken')
    }
  },

  /** 清除登录态 */
  clearAuth() {
    wx.removeStorageSync('accessToken')
    wx.removeStorageSync('userInfo')
    this.globalData.userInfo = null
  },

  setTheme(theme, updateTabBarNow = false) {
    this.globalData.currentTheme = theme
    this.globalData.themeDirty = true
    wx.setStorageSync('theme', theme)
    this.applyThemeToPage(theme)
    if (updateTabBarNow) {
      this.updateTabBar(theme)
    }
  },

  applyThemeToPage(theme) {
    try {
      const pages = getCurrentPages()
      pages.forEach(page => {
        if (page && page.setData && page.applyTheme) {
          page.applyTheme()
        } else if (page && page.setData) {
          page.setData({
            themeClass: 'theme-' + theme.id,
            theme: theme
          })
        }
      })
    } catch (e) {
      console.log('applyThemeToPage error:', e)
    }
  },

  updateTabBar(theme) {
    if (!theme || !theme.id) return
    wx.setTabBarStyle({
      color: '#999999',
      selectedColor: theme.color,
      backgroundColor: '#ffffff',
      borderStyle: 'white'
    }).catch(() => {})
    const tabs = [
      { index: 0, name: 'home', text: '首页' },
      { index: 1, name: 'code', text: '网页设计' },
      { index: 2, name: 'school', text: '毕业设计' },
      { index: 3, name: 'mine', text: '我的' }
    ]
    tabs.forEach(tab => {
      wx.setTabBarItem({
        index: tab.index,
        text: tab.text,
        iconPath: `/static/tabbar/${tab.name}.png`,
        selectedIconPath: `/static/tabbar/${tab.name}-${theme.id}.png`
      }).catch(() => {})
    })
  }
})
