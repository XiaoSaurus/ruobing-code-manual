param([int]$Port = 4001)
$conn = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
if (-not $conn) { Write-Host "No backend process on port $Port"; exit 0 }
$ids = $conn | Select-Object -ExpandProperty OwningProcess -Unique
foreach ($id in $ids) { Stop-Process -Id $id -Force -ErrorAction SilentlyContinue; Write-Host "Stopped backend PID $id" }
