@echo off
setlocal

echo ================== Consul =======================
echo Staring Docker container...
docker-compose -f consul/docker-compose.yml up -d --build

echo ================== Kafka =======================
echo Staring Docker containers...
docker-compose -f broker/docker-compose.yml up -d --build

echo Kafka Register...
cd broker/KafkaRegister || exit /b
call npm install
call node kafkaRegister.js
cd ..\..

echo ================== Microservices =======================
echo Setup...
cd microservices\Setup || exit /b
call npm install
call node setup.js

echo Starting Docker containers...
cd ..\
docker-compose up --build -d

:: Health check for the service at localhost:8007/crypt/test
echo Checking server health...
set /a attempt=1
:healthcheck
curl -s http://localhost:8807/crypt/test | findstr /c:"Server is working!" >nul
if %errorlevel%==0 (
    echo Server is ready!
) else (
    if %attempt% geq 10 (
        echo Server health check failed!
        exit /b 1
    )
    echo Waiting for server... Attempt %attempt%
    timeout /t 2 /nobreak >nul
    set /a attempt+=1
    goto healthcheck
)

echo Registering servers...
call node Setup\serversRegister.js

echo ================== Kong =======================
echo Starting Docker containers...
cd..\
docker-compose -f gateway/docker-compose.yml up -d

echo All tasks completed!
pause
