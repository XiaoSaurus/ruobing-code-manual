const { request } = require('./utils/request.js')

// 预设主题色板
const THEMES = [
  { id: 'blue',   name: '科技蓝',   color: '#409EFF', selectedColor: '#409EFF' },
  { id: 'purple', name: '优雅紫',   color: '#9c27b0', selectedColor: '#9c27b0' },
  { id: 'green',  name: '清新绿',   color: '#67C23A', selectedColor: '#67C23A' },
  { id: 'orange', name: '活力橙',   color: '#E6A23C', selectedColor: '#E6A23C' },
  { id: 'red',    name: '中国红',   color: '#F56C6C', selectedColor: '#F56C6C' },
  { id: 'dark',   name: '极客黑',   color: '#303133', selectedColor: '#409EFF' }
]

App({
  globalData: {
    apiBase: 'http://192.168.56.1:8080/api',
    userInfo: null,
    themes: THEMES,
    currentTheme: null
  },

  onLaunch() {
    // 加载主题
    const saved = wx.getStorageSync('theme')
    const theme = saved || THEMES[0]
    this.setTheme(theme)
  },

  setTheme(theme) {
    this.globalData.currentTheme = theme
    wx.setStorageSync('theme', theme)
    // 更新 tabBar 颜色
    if (typeof this.updateTabBarStyle === 'function') {
      this.updateTabBarStyle(theme)
    }
  },

  updateTabBarStyle(theme) {
    wx.setTabBarStyle({
      color: theme.color,
      selectedColor: theme.selectedColor,
      backgroundColor: '#ffffff',
      borderStyle: 'black',
      success: () => {
        wx.setTabBarItem({
          index: 0,
          iconPath: 'static/tabbar/home.png',
          selectedIconPath: 'static/tabbar/home-active.png'
        })
        wx.setTabBarItem({
          index: 1,
          iconPath: 'static/tabbar/code.png',
          selectedIconPath: 'static/tabbar/code-active.png'
        })
        wx.setTabBarItem({
          index: 2,
          iconPath: 'static/tabbar/school.png',
          selectedIconPath: 'static/tabbar/school-active.png'
        })
        wx.setTabBarItem({
          index: 3,
          iconPath: 'static/tabbar/mine.png',
          selectedIconPath: 'static/tabbar/mine-active.png'
        })
      }
    })
  }
})
