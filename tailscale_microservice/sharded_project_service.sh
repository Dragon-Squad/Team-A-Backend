# Health check for Sharded Project Service
echo "Checking Sharded Project Service health..."
i=1
while true
do
    echo "Waiting for Sharded Project Service... Attempt $i"
    if curl -s http://localhost:8805/health-check | grep -q "Server is working!"; then
        echo "Sharded Project Service is ready!"
        echo "Starting Tailscale for Sharded Project Service..."
        # start cmd /c "echo Sharded Project Service & tailscale serve --https=8805 localhost:8805"
        echo "Tailscale for Sharded Project Service has completed."
        echo; exit 0
    else
        if [ $i -ge 10 ]; then
            echo "Sharded Project Service health check failed!"
            exit 1
        fi
        sleep 4
        i=$((i+1))
    fi
done

exit 1
