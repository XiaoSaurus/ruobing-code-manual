export function formatDateTime(input) {
  if (!input) return ''
  const date = new Date(input)
  if (Number.isNaN(date.getTime())) return String(input)
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

export function roleLabel(role) {
  const map = {
    admin: '管理员',
    editor: '编辑',
    app_user: '访客用户'
  }
  return map[role] || role || '-'
}
