# GitHub Push 无限重试脚本
# 会一直运行直到成功或被手动终止

$ErrorActionPreference = "SilentlyContinue"
$attempt = 0
$baseWait = 20  # 基础等待秒数

Write-Host "=== GitHub Push Retry Script ===" -ForegroundColor Cyan
Write-Host "Repo: https://github.com/XiaoSaurus/ruobing-code-manual"
Write-Host "Waiting for network connectivity..." -ForegroundColor Yellow
Write-Host ""

while ($true) {
    $attempt++
    $wait = $baseWait + (Get-Random -Minimum 0 -Maximum 30)
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Attempt #$attempt ..."

    git -C D:\AppData\QClaw\QClawData\workspace\ruobing-code-manual push origin main 2>&1 | Tee-Object -Variable result

    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host " SUCCESS! All commits pushed!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        break
    } else {
        Write-Host "FAILED (exit $LASTEXITCODE). Retrying in ${wait}s..." -ForegroundColor Red
        Start-Sleep -Seconds $wait
        # 每次失败后等久一点，避免无限循环消耗资源
        $baseWait = [Math]::Min($baseWait + 5, 120)
    }
}
