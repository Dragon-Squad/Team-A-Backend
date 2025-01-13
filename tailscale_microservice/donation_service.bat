@echo off

:: Health check for Donation Service
echo Checking Donation Service health...
set /a attempt=1
:healthcheck_donation
echo Waiting for Donation Service... Attempt %attempt%
curl -s http://localhost:8804/health-check | findstr /c:"Server is working!" >nul
if %errorlevel%==0 (
    echo Donation Service is ready!
    echo Starting Tailscale for Donation Service...
    start cmd /c "echo Donation Service & tailscale serve --https=8804 localhost:8804"
    echo Tailscale for Donation Service has completed.
    echo:
) else (
    if %attempt% geq 10 (
        echo Donation Service health check failed!
        exit /b 1
    )
    timeout /t 4 /nobreak >nul
    set /a attempt+=1
    goto healthcheck_donation
)

exit /b
