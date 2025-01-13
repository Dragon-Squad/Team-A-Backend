@echo off

echo ================== Microservices =======================
echo ^>^> Setup...
cd microservices\Setup || ( echo Setup directory not found! & exit /b 1 )
call npm install
call node setup.js

echo ^>^> Starting Docker containers...
cd ..
docker-compose up -d --build

echo ^>^> Registering servers...
call node Setup\serversRegister.js

echo ^>^> Serving Microservices through Tailscale...
cd ..\tailscale_microservice || ( echo Tailscale Setup directory not found! & exit /b 1 )

:: Call project_management_service.bat and wait for it to finish
call project_management_service.bat
if %errorlevel% neq 0 (
    echo ^>^> Project Management Service failed!
    exit /b 1
)

:: Call email_service.bat and wait for it to finish
call email_service.bat
if %errorlevel% neq 0 (
    echo ^>^> Email Service failed!
    exit /b 1
)

:: Call donation_service.bat and wait for it to finish
call donation_service.bat
if %errorlevel% neq 0 (
    echo ^>^> Donation Service failed!
    exit /b 1
)

:: Call sharded_project_service.bat and wait for it to finish
call sharded_project_service.bat
if %errorlevel% neq 0 (
    echo ^>^> Sharded Project Service failed!
    exit /b 1
)

:: Call statistic_service.bat and wait for it to finish
call statistic_service.bat
if %errorlevel% neq 0 (
    echo ^>^> Statistic Service failed!
    exit /b 1
)

echo ^>^> All services are ready!
pause
