const { request } = require('./utils/request.js')

// 预设主题色板 - 使用更浅的颜色
const THEMES = [
  { id: 'blue',   name: '科技蓝',   color: '#66B1FF', selectedColor: '#66B1FF', light: '#E6F4FF', dark: '#409EFF' },
  { id: 'purple', name: '优雅紫',   color: '#B388FF', selectedColor: '#B388FF', light: '#F3E8FF', dark: '#9C27B0' },
  { id: 'green',  name: '清新绿',   color: '#85CE61', selectedColor: '#85CE61', light: '#E8F5E8', dark: '#67C23A' },
  { id: 'orange', name: '活力橙',   color: '#F0C78A', selectedColor: '#F0C78A', light: '#FFF7E6', dark: '#E6A23C' },
  { id: 'red',    name: '中国红',   color: '#F78989', selectedColor: '#F78989', light: '#FFE8E8', dark: '#F56C6C' },
  { id: 'pink',   name: '少女粉',   color: '#F4B8C5', selectedColor: '#F4B8C5', light: '#FFEEF0', dark: '#E88A9C' },
  { id: 'dark',   name: '极客黑',   color: '#67C23A', selectedColor: '#67C23A', light: '#1E2A3A', dark: '#409EFF' }
]

App({
  globalData: {
    apiBase: 'https://www.ruobing.site:4001/api',
    userInfo: null,
    themes: THEMES,
    currentTheme: null
  },

  onLaunch() {
    const saved = wx.getStorageSync('theme')
    const theme = saved || THEMES[0]
    this.setTheme(theme)
  },

  setTheme(theme) {
    this.globalData.currentTheme = theme
    wx.setStorageSync('theme', theme)
    
    // 应用主题到当前页面
    this.applyThemeToPage(theme)
    
    // 更新 tabBar
    this.updateTabBarStyle(theme)
  },

  // 应用主题到页面
  applyThemeToPage(theme) {
    try {
      const pages = getCurrentPages()
      pages.forEach(page => {
        if (page && page.setData) {
          page.setData({
            themeClass: 'theme-' + theme.id,
            theme: theme
          })
        }
      })
      
      // 同时更新 app.wxss 中的 CSS 变量
      const currentPages = getCurrentPages()
      if (currentPages.length > 0) {
        const currentPage = currentPages[currentPages.length - 1]
        const pageInstance = currentPage
        pageInstance.setData({
          themeClass: 'theme-' + theme.id,
          theme: theme
        })
      }
    } catch (e) {
      console.log('applyThemeToPage error:', e)
    }
  },

  // 更新 TabBar 样式
  updateTabBarStyle(theme) {
    wx.setTabBarStyle({
      color: '#999999',
      selectedColor: theme.color,
      backgroundColor: '#ffffff',
      borderStyle: 'white'
    })
    
    // 更新选中图标颜色（重新生成主题色图标）
    this.updateTabBarIcons(theme)
  },

  // 更新 TabBar 图标
  updateTabBarIcons(theme) {
    // 获取当前主题对应的图标（图标已经是红色的，需要根据主题色生成）
    // 这里我们只需要更新 tabBarItem 的选中颜色
    // 由于图标是静态的，主要靠 selectedColor 来显示选中状态
    
    // 设置每个 tab 的选中颜色
    for (let i = 0; i < 4; i++) {
      wx.setTabBarItem({
        index: i,
        selectedIconColor: theme.color
      }).catch(() => {}) // 忽略可能的错误
    }
  }
})
