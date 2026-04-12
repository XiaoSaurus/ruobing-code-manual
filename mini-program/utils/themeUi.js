/**
 * 「我的」用户卡 / 切换主题预览：浅色底 theme.light → 白（不显中间色阶，避免偏深）
 */
function buildUserCardGradient(theme) {
  if (!theme || !theme.id) {
    return 'linear-gradient(175deg, #E6F4FF 0%, #ffffff 100%)'
  }
  return `linear-gradient(175deg, ${theme.light} 0%, #ffffff 100%)`
}

function isUserCardLightMode() {
  return true
}

function buildThemePageStyle(theme) {
  if (!theme) return ''
  return `--theme-color: ${theme.color}; --theme-light: ${theme.light}; --theme-dark: ${theme.dark};`
}

module.exports = {
  buildUserCardGradient,
  isUserCardLightMode,
  buildThemePageStyle
}
