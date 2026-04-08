@echo off
set "JAVA_HOME=E:\Java\JDK\jdk-17"
set "PATH=%JAVA_HOME%\bin;E:\Java\Maven\apache-maven-3.9.6\bin;%PATH%"
cd /d "D:\AppData\QClaw\QClawData\workspace\ruobing-code-manual\backend"
call mvn spring-boot:run -DskipTests
