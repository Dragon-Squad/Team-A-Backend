echo "================== Microservices ======================="
echo ">> Setup..."
cd microservices/Setup || { echo "Setup directory not found!"; exit 1; }
npm install
node setup.js

echo ">> Starting Docker containers..."
cd ../
docker-compose docker-compose.yml up -d --build

echo ">> Registering servers..."
node Setup/serversRegister.js

echo ">> Done!"