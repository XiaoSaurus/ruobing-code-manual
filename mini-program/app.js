const { request } = require('./utils/request.js')

// 预设主题色板 - 使用更浅的颜色
const THEMES = [
  { id: 'blue',   name: '科技蓝',   color: '#66B1FF', light: '#E6F4FF', dark: '#409EFF' },
  { id: 'purple', name: '优雅紫',   color: '#B388FF', light: '#F3E8FF', dark: '#9C27B0' },
  { id: 'green',  name: '清新绿',   color: '#85CE61', light: '#E8F5E8', dark: '#67C23A' },
  { id: 'orange', name: '活力橙',   color: '#F0C78A', light: '#FFF7E6', dark: '#E6A23C' },
  { id: 'red',    name: '中国红',   color: '#F78989', light: '#FFE8E8', dark: '#F56C6C' },
  { id: 'pink',   name: '少女粉',   color: '#F4B8C5', light: '#FFEEF0', dark: '#E88A9C' },
  { id: 'dark',   name: '极客黑',   color: '#409EFF', light: '#1E2A3A', dark: '#66B1FF' }
]

App({
  globalData: {
    // apiBase: 'https://www.ruobing.site:4001/api',
    apiBase: 'http://localhost:4001/api',
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
    
    // 更新 tabBar 样式和图标
    this.updateTabBar(theme)
  },

  // 应用主题到页面
  applyThemeToPage(theme) {
    try {
      const pages = getCurrentPages()
      pages.forEach(page => {
        if (page && page.setData && page.applyTheme) {
          page.applyTheme()
        } else if (page && page.setData) {
          // 对于没有 applyTheme 方法的页面，直接设置 themeClass
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

  // 更新 TabBar 样式和图标
  updateTabBar(theme) {
    console.log('updateTabBar called with theme:', theme)
    
    if (!theme || !theme.id) {
      console.error('Invalid theme:', theme)
      return
    }

    // 更新样式（选中文字颜色）
    wx.setTabBarStyle({
      color: '#999999',
      selectedColor: theme.color,
      backgroundColor: '#ffffff',
      borderStyle: 'white'
    }).then(() => {
      console.log('setTabBarStyle success, color:', theme.color)
    }).catch(err => {
      console.error('setTabBarStyle error:', err)
    })

    // 更新每个 Tab 的图标
    const tabs = [
      { index: 0, name: 'home', text: '首页' },
      { index: 1, name: 'code', text: '网页设计' },
      { index: 2, name: 'school', text: '毕业设计' },
      { index: 3, name: 'mine', text: '我的' }
    ]

    tabs.forEach(tab => {
      const iconPath = `/static/tabbar/${tab.name}.png`
      const selectedIconPath = `/static/tabbar/${tab.name}-${theme.id}.png`
      console.log(`Setting tab ${tab.index}: ${iconPath} / ${selectedIconPath}`)
      
      wx.setTabBarItem({
        index: tab.index,
        text: tab.text,
        iconPath: iconPath,
        selectedIconPath: selectedIconPath
      }).then(() => {
        console.log(`setTabBarItem ${tab.name} success`)
      }).catch(err => {
        console.error(`setTabBarItem ${tab.name} error:`, err)
      })
    })
  }
})
