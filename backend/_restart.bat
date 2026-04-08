@echo off
setlocal enabledelayedexpansion
set "JAVA_HOME=E:\Java\JDK\jdk-17"
set "PATH=E:\Java\JDK\jdk-17\bin;E:\Java\Maven\apache-maven-3.9.6\bin;%PATH%"
cd /d "D:\AppData\QClaw\QClawData\workspace\ruobing-code-manual\backend"
mvn spring-boot:run -DskipTests
