# Health check for Donation Service
echo "Checking Donation Service health..."
i=1
while true
do
    echo "Waiting for Donation Service... Attempt $i"
    if curl -s http://localhost:8804/health-check | grep -q "Server is working!"; then
        echo "Donation Service is ready!"
        # echo "Starting Tailscale for Donation Service..."
        # start cmd /c "echo Donation Service & tailscale serve --https=8804 localhost:8804"
        # echo "Tailscale for Donation Service has completed."
        echo; exit 0
    else
        if [ $i -ge 10 ]; then
            echo "Donation Service health check failed!"
            exit 1
        fi
        sleep 4
        i=$((i+1))
    fi
done

exit 1
