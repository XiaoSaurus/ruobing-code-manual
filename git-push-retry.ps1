$ErrorActionPreference = "SilentlyContinue"
$maxAttempts = 10
$waitSec = 30

for ($i = 1; $i -le $maxAttempts; $i++) {
    Write-Host "[$i/$maxAttempts] Attempting git push..."
    git -C D:\AppData\QClaw\QClawData\workspace\ruobing-code-manual push origin main 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "SUCCESS! Push completed."
        exit 0
    }
    Write-Host "FAILED (exit $LASTEXITCODE). Waiting ${waitSec}s before retry..."
    Start-Sleep -Seconds $waitSec
}

Write-Host "MAX ATTEMPTS REACHED. Push failed."
exit 1
