@echo off

:: Health check for Statistic Service
echo Checking Statistic Service health...
set /a attempt=1
:healthcheck_statistic
echo Waiting for Statistic Service... Attempt %attempt%
curl -s http://localhost:8807/health-check | findstr /c:"Server is working!" >nul
if %errorlevel%==0 (
    echo Statistic Service is ready!
    echo Starting Tailscale for Statistic Service...
    start cmd /c "echo Statistic Service & tailscale serve --https=8807 localhost:8807"
    echo Tailscale for Statistic Service has completed.
    echo:
) else (
    if %attempt% geq 10 (
        echo Statistic Service health check failed!
        exit /b 1
    )
    timeout /t 4 /nobreak >nul
    set /a attempt+=1
    goto healthcheck_statistic
)

exit /b
