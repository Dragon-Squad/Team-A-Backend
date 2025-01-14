# Health check for Email Service
echo "Checking Email Service health..."
i=1
while true
do
    echo "Waiting for Email Service... Attempt $i"
    if curl -s http://localhost:8802/health-check | grep -q "Server is working!"; then
        echo "Email Service is ready!"
        # echo "Starting Tailscale for Email Service..."
        # start cmd /c "echo Email Service & tailscale serve --https=8802 localhost:8802"
        # echo "Tailscale for Email Service has completed."
        echo; exit 0
    else
        if [ $i -ge 10 ]; then
            echo "Email Service health check failed!"
            exit 1
        fi
        sleep 4
        i=$((i+1))
    fi
done

exit 1
