# Auto Git Push Retry (SSH) - ruobing-code-manual
# SSH key: id_ed25519_github
# Add SSH pubkey to GitHub once at https://github.com/settings/keys

$repo = "D:\AppData\QClaw\QClawData\workspace\ruobing-code-manual"
$branch = "main"
$wait = 30
$max = 999

git -C $repo config remote.origin.url "git@github.com:XiaoSaurus/ruobing-code-manual.git"
Write-Host "Remote: $(git -C $repo remote get-url origin)"
Write-Host "Pending commits:"
git -C $repo log origin/$branch..HEAD --oneline
Write-Host ""

for ($i = 1; $i -le $max; $i++) {
    $ts = Get-Date -Format "HH:mm:ss"
    Write-Host "[$ts] Attempt #$i ..."
    $out = git -C $repo push origin main 2>&1
    Write-Host $out

    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================"
        Write-Host "  SUCCESS! Pushed after $i attempt(s)" -ForegroundColor Green
        Write-Host "========================================"
        git -C $repo log origin/$branch..HEAD --oneline
        break
    }

    Write-Host "FAILED. Retry in ${wait}s..." -ForegroundColor Yellow
    Start-Sleep -Seconds $wait
}
