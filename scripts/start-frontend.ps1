$root = Split-Path -Parent $PSScriptRoot
$web = Join-Path $root "web"
$cmd = "Set-Location '$web'; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $cmd | Out-Null
Write-Host "Frontend starting..."
