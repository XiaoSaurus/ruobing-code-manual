/**
 * 将简单 Markdown 转为 rich-text 可用的 HTML（type="html"）。
 * 支持：# / ## / ### 标题、- 列表、段落、**加粗**、`行内代码`
 */

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
  t = t.replace(/`([^`]+)`/g, '<code style="font-size:13px;background:#f0f2f5;padding:2px 6px;border-radius:4px;color:#333">$1</code>')
  return t
}

function markdownToHtml(md, accentColor) {
  const acc = accentColor || '#409EFF'
  if (!md || !String(md).trim()) {
    return '<p style="margin:0;line-height:1.65;font-size:14px;color:#999">暂无详情</p>'
  }
  const lines = String(md).replace(/\r\n/g, '\n').split('\n')
  const parts = []
  let i = 0
  let listOpen = false

  function closeList() {
    if (listOpen) {
      parts.push('</ul>')
      listOpen = false
    }
  }

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    if (trimmed === '') {
      closeList()
      i++
      continue
    }

    if (trimmed.startsWith('### ')) {
      closeList()
      parts.push(
        '<h3 style="font-size:15px;font-weight:bold;margin:10px 0 6px;color:' +
          acc +
          '">' +
          formatInline(trimmed.slice(4)) +
          '</h3>'
      )
      i++
      continue
    }
    if (trimmed.startsWith('## ')) {
      closeList()
      parts.push(
        '<h2 style="font-size:16px;font-weight:bold;margin:12px 0 8px;color:' +
          acc +
          '">' +
          formatInline(trimmed.slice(3)) +
          '</h2>'
      )
      i++
      continue
    }
    if (trimmed.startsWith('# ')) {
      closeList()
      parts.push(
        '<h1 style="font-size:17px;font-weight:bold;margin:12px 0 8px;color:#222">' +
          formatInline(trimmed.slice(2)) +
          '</h1>'
      )
      i++
      continue
    }
    if (/^\s*-\s+/.test(line)) {
      if (!listOpen) {
        parts.push(
          '<ul style="margin:8px 0 10px;padding-left:20px;list-style-type:disc;list-style-position:outside">'
        )
        listOpen = true
      }
      const itemText = line.replace(/^\s*-\s+/, '')
      parts.push(
        '<li style="margin:5px 0;line-height:1.65;font-size:14px;color:#555;display:list-item">' +
          formatInline(itemText) +
          '</li>'
      )
      i++
      continue
    }

    closeList()
    parts.push(
      '<p style="margin:6px 0;line-height:1.65;font-size:14px;color:#666">' +
        formatInline(trimmed) +
        '</p>'
    )
    i++
  }
  closeList()
  return parts.join('')
}

module.exports = {
  markdownToHtml
}
