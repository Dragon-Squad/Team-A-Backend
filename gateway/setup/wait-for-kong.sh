# Wait until Kong Admin API is reachable
until curl -s http://kong-gateway:8001 >/dev/null; do
    echo "Waiting for Kong Admin API to be ready..."
    sleep 5
done

echo "Kong Admin is ready. Executing command..."
exec node /usr/src/app/setup.js