# GitHub SSH Push 脚本
# 远程已切换为 git@github.com:XiaoSaurus/ruobing-code-manual.git
# SSH key: id_ed25519_github
# 需要公钥已添加到 GitHub 才能使用

$ErrorActionPreference = "SilentlyContinue"
$attempt = 0
$waitSec = 15

while ($true) {
    $attempt++
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Attempt #$attempt ..."

    $result = git -C D:\AppData\QClaw\QClawData\workspace\ruobing-code-manual push origin main 2>&1
    Write-Host $result

    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================"
        Write-Host " SUCCESS! All commits pushed!" -ForegroundColor Green
        Write-Host "========================================"
        break
    } else {
        Write-Host "FAILED. Retrying in ${waitSec}s..." -ForegroundColor Yellow
        Start-Sleep -Seconds $waitSec
    }
}
