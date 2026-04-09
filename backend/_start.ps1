$env:JAVA_HOME = "E:\Java\JDK\jdk-17"
$env:PATH = "E:\Java\JDK\jdk-17\bin;E:\Java\Maven\apache-maven-3.9.6\bin;" + $env:PATH
Set-Location "D:\AppData\QClaw\QClawData\workspace\ruobing-code-manual\backend"
& mvn.cmd spring-boot:run -DskipTests
