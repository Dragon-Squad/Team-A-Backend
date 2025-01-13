# Health check for Project Management Service
echo "Checking Project Management Service health..."
i=1
while true
do
    echo "Waiting for Project Management Service... Attempt $i"
    if curl -s http://localhost:8803/health-check | grep -q "Server is working!"; then
        echo "Project Management Service is ready!"
        echo "Starting Tailscale for Project Management Service..."
        # start cmd /c "echo Project Management Service & tailscale serve --https=8803 localhost:8803"
        echo "Tailscale for Project Management Service has completed."
        echo; exit 0
    else
        if [ $i -ge 10 ]; then
            echo "Project Management Service health check failed!"
            exit 1
        fi
        sleep 4
        i=$((i+1))
    fi
done

exit 1
