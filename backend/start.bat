@REM Maven Wrapper startup script
@echo off
set MAVEN_OPTS=-Xmx512m
java -version >nul 2>&1
if errorlevel 1 (
    echo Java not found
    exit /b 1
)

set MVN=mvn.cmd
where %MVN% >nul 2>&1
if errorlevel 1 (
    echo Maven not found. Please install Maven first.
    echo Download: https://maven.apache.org/download.cgi
    exit /b 1
)

call mvn spring-boot:run -DskipTests
