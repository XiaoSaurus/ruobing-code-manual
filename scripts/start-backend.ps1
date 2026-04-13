$root = Split-Path -Parent $PSScriptRoot
$backend = Join-Path $root "backend"
$mvn = Join-Path $env:TEMP "apache-maven-3.9.6\bin\mvn.cmd"
if (-not (Test-Path $mvn)) { throw "Maven not found: $mvn" }
$cmd = "$env:JAVA_HOME='E:\Java\JDK\jdk-17'; `$env:PATH='E:\Java\JDK\jdk-17\bin;' + `$env:PATH; Set-Location '$backend'; & '$mvn' -q -DskipTests spring-boot:run"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $cmd | Out-Null
Write-Host "Backend starting..."
