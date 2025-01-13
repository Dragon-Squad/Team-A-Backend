echo "================== Microservices ======================="
echo ">> Setup..."
cd microservices/Setup || { echo "Setup directory not found!"; exit 1; }
npm install
node setup.js

echo ">> Starting Docker containers..."
cd ..
docker-compose up -d --build

echo ">> Registering servers..."
node Setup/serversRegister.js

echo ">> Serving Microservices through Tailscale..."
cd ../tailscale_microservice || { echo "Tailscale directory not found!"; exit 1; }

# Call project_management_service.sh and wait for it to finish
./project_management_service.sh
if [ $? -ne 0 ]; then
    echo ">> Project Management Service failed!"
    exit 1
fi

# Call email_service.sh and wait for it to finish
./email_service.sh
if [ $? -ne 0 ]; then
    echo ">> Email Service failed!"
    exit 1
fi

# Call donation_service.sh and wait for it to finish
./donation_service.sh
if [ $? -ne 0 ]; then
    echo ">> Donation Service failed!"
    exit 1
fi

# Call sharded_project_service.sh and wait for it to finish
./sharded_project_service.sh
if [ $? -ne 0 ]; then
    echo ">> Sharded Project Service failed!"
    exit 1
fi

# Call statistic_service.sh and wait for it to finish
./statistic_service.sh
if [ $? -ne 0 ]; then
    echo ">> Statistic Service failed!"
    exit 1
fi

echo ">> All services are ready!"
read -n 1 -s -r -p "Press any key to continue..."
echo
