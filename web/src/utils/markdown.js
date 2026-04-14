function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function formatInline(s) {
  let t = escapeHtml(s)
  t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  t = t.replace(/`([^`]+)`/g, '<code style="font-size:13px;background:#f3f4f6;padding:2px 6px;border-radius:4px;color:#111827">$1</code>')
  return t
}

export function markdownToHtml(md, accentColor = '#409eff') {
  if (!md || !String(md).trim()) {
    return '<p style="margin:0;line-height:1.7;color:#9ca3af">暂无内容</p>'
  }
  const lines = String(md).replace(/\r\n/g, '\n').split('\n')
  const parts = []
  let listOpen = false
  const closeList = () => {
    if (listOpen) {
      parts.push('</ul>')
      listOpen = false
    }
  }

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) {
      closeList()
      continue
    }
    if (trimmed.startsWith('### ')) {
      closeList()
      parts.push(`<h3 style="margin:12px 0 8px;font-size:16px;color:${accentColor}">${formatInline(trimmed.slice(4))}</h3>`)
      continue
    }
    if (trimmed.startsWith('## ')) {
      closeList()
      parts.push(`<h2 style="margin:14px 0 9px;font-size:18px;color:${accentColor}">${formatInline(trimmed.slice(3))}</h2>`)
      continue
    }
    if (trimmed.startsWith('# ')) {
      closeList()
      parts.push(`<h1 style="margin:14px 0 9px;font-size:20px;color:#111827">${formatInline(trimmed.slice(2))}</h1>`)
      continue
    }
    if (/^\s*-\s+/.test(line)) {
      if (!listOpen) {
        parts.push('<ul style="margin:8px 0 12px;padding-left:20px">')
        listOpen = true
      }
      parts.push(`<li style="margin:5px 0;line-height:1.7;color:#4b5563">${formatInline(line.replace(/^\s*-\s+/, ''))}</li>`)
      continue
    }
    closeList()
    parts.push(`<p style="margin:6px 0;line-height:1.75;color:#4b5563">${formatInline(trimmed)}</p>`)
  }
  closeList()
  return parts.join('')
}
