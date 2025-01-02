echo ================== Microservices =======================
echo Setup...
cd microservices\Setup || exit /b
call npm install
call node setup.js

echo Starting Docker containers...
cd ..\
docker-compose up --build -d

echo Registering servers...
call node Setup\serversRegister.js

echo ================== Kong =======================
echo Starting Docker containers...
cd..\
docker-compose -f gateway/docker-compose.yml up -d

:: Health check for the service at localhost:8007/crypt/test
echo Checking server health...
set /a attempt=1
:healthcheck
curl -s http://localhost:8803/health/check | findstr /c:"Server is working!" >nul
if %errorlevel%==0 (
    echo Server is ready!
) else (
    if %attempt% geq 10 (
        echo Server health check failed!
        exit /b 1
    )
    echo Waiting for server... Attempt %attempt%
    timeout /t 3 /nobreak >nul
    set /a attempt+=1
    goto healthcheck
)

echo Done!
pause
