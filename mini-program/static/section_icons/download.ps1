# 下载 section 头部图标 (火焰=热门，新=最新)
# 图标来源：iconfont.cn 精选 SVG

$outDir = $PSScriptRoot

# 火焰图标 - 热门推荐 (48x48)
$hotUrl = "https://img.tukuppt.com/png-simple/283024/1.283024.png!/fw/48/quality/90"
# 新品图标 - 最新更新 (48x48)
$newUrl = "https://img.tukuppt.com/png-simple/283024/1.283024.png!/fw/48/quality/90"

# 备用：使用 iconfont SVG 链接
# iconfont 火焰 svg
$hotSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ff6b35" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>'
$newSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4ecdc4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>'

function Convert-SvgToBase64Png($svg) {
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($svg)
    $b64 = [Convert]::ToBase64String($bytes)
    return "data:image/svg+xml;base64,$b64"
}

# 方法1: 尝试从网络下载PNG
try {
    Write-Host "尝试下载图标..."
    $hotPng = Invoke-WebRequest -Uri $hotUrl -UseBasicParsing -TimeoutSec 10
    $newPng = Invoke-WebRequest -Uri $newUrl -UseBasicParsing -TimeoutSec 10
    
    [System.IO.File]::WriteAllBytes("$outDir\section-hot.png", $hotPng.Content)
    [System.IO.File]::WriteAllBytes("$outDir\section-new.png", $newPng.Content)
    
    Write-Host "PNG 图标下载成功!"
} catch {
    Write-Host "PNG 下载失败，使用 SVG 方案..."
    
    # 方法2: 生成 SVG 文件（微信小程序支持 image 标签使用本地 svg）
    $hotSvg | Out-File -FilePath "$outDir\section-hot.svg" -Encoding UTF8
    $newSvg | Out-File -FilePath "$outDir\section-new.svg" -Encoding UTF8
    
    Write-Host "SVG 图标已生成 (section-hot.svg, section-new.svg)"
    Write-Host "提示：小程序 image 组件对 SVG 支持有限，建议转换为 PNG"
}

Write-Host "完成"
