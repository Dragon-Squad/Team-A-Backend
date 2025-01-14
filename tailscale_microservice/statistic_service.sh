# Health check for Statistic Service
echo "Checking Statistic Service health..."
i=1
while true
do
    echo "Waiting for Statistic Service... Attempt $i"
    if curl -s http://localhost:8807/health-check | grep -q "Server is working!"; then
        echo "Statistic Service is ready!"
        # echo "Starting Tailscale for Statistic Service..."
        # start cmd /c "echo Statistic Service & tailscale serve --https=8807 localhost:8807"
        # echo "Tailscale for Statistic Service has completed."
        echo; exit 0
    else
        if [ $i -ge 10 ]; then
            echo "Statistic Service health check failed!"
            exit 1
        fi
        sleep 4
        i=$((i+1))
    fi
done

exit 1
