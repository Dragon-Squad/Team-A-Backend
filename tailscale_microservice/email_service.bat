@echo off

:: Health check for Email Service
echo Checking Email Service health...
set /a attempt=1
:healthcheck_email
echo Waiting for Email Service... Attempt %attempt%
curl -s http://localhost:8802/health-check | findstr /c:"Server is working!" >nul
if %errorlevel%==0 (
    echo Email Service is ready!
    echo Starting Tailscale for Email Service...
    start cmd /c "echo Email Service & tailscale serve --https=8802 localhost:8802"
    echo Tailscale for Email Service has completed.
    echo:
) else (
    if %attempt% geq 10 (
        echo Email Service health check failed!
        exit /b 1
    )
    timeout /t 4 /nobreak >nul
    set /a attempt+=1
    goto healthcheck_email
)

exit /b
