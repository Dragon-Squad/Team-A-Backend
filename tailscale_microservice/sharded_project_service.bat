@echo off

:: Health check for Sharded Service
echo Checking Sharded Project Service health...
set /a attempt=1
:healthcheck_sharded
echo Waiting for Sharded Project Service... Attempt %attempt%
curl -s http://localhost:8805/health-check | findstr /c:"Server is working!" >nul
if %errorlevel%==0 (
    echo Sharded Project Service is ready!
    echo Starting Tailscale for Sharded Project Service...
    start cmd /c "echo Sharded Project Service & tailscale serve --https=8805 localhost:8805"
    echo Tailscale for Sharded Project Service has completed.
    echo:
) else (
    if %attempt% geq 10 (
        echo Sharded Project Service health check failed!
        exit /b 1
    )
    timeout /t 4 /nobreak >nul
    set /a attempt+=1
    goto healthcheck_sharded
)

exit /b
