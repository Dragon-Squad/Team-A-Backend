echo "================== Microservices ======================="
echo ">> Setup..."
cd microservices/Setup || { echo "Setup directory not found!"; exit 1; }
npm install
node setup.js

echo ">> Starting Microservices Docker containers..."
cd ..
docker-compose up --build -d

echo ">> Registering servers..."
node microservices/Setup/serversRegister.js

echo "================== Kong ======================="
echo ">> Starting Kong Docker containers..."
docker-compose -f gateway/docker-compose.yml up -d --build

echo ">> Checking server health..."
for i in {1..10}; do
  if curl -s http://localhost:8003/health/check | grep -q "Server is working!"; then
    echo ">> Server is ready!"
    break
  fi
  echo "Waiting for server... Attempt $i"
  sleep 3
done

# If the server isn't ready after 10 attempts, exit with an error
if ! curl -s http://localhost:8003/health/check | grep -q "Server is working!"; then
  echo ">> Server health check failed!" >&2
  exit 1
fi

echo ">> Done!"