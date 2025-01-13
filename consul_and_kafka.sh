echo "================== Consul ======================="
echo ">> Starting Consul Docker container..."
docker-compose -f consul/docker-compose.yml up -d --build

echo "================== Kafka ======================="
echo ">> Starting Kafka Docker containers..."
docker-compose -f broker/docker-compose.yml up -d --build

echo ">> Kafka Register..."
cd broker/KafkaRegister || { echo "KafkaRegister directory not found!"; exit 1; }
npm install
node kafkaRegister.js
cd ../..

echo ">> Done!"
read -n 1 -s -r -p "Press any key to continue..."
echo
