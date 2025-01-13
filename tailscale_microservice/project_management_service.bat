@echo off

:: Health check for Project Management Service
echo Checking Project Management Service health...
set /a attempt=1
:healthcheck_project
echo Waiting for Project Management Service... Attempt %attempt%
curl -s http://localhost:8803/health-check | findstr /c:"Server is working!" >nul
if %errorlevel%==0 (
    echo Project Management Service is ready!
    echo Starting Tailscale for Project Management Service...
    start cmd /c "echo Project Management Service & tailscale serve --https=8803 localhost:8803"
    echo Tailscale for Project Management Service has completed.
    echo:
) else (
    if %attempt% geq 10 (
        echo Project Management Service health check failed!
        exit /b 1
    )
    timeout /t 4 /nobreak >nul
    set /a attempt+=1
    goto healthcheck_project
)

exit /b
