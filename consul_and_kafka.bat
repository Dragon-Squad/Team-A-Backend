@echo off

echo ================== Consul =======================
echo ^>^> Starting Consul Docker container...
docker-compose -f consul/docker-compose.yml up -d --build

echo ================== Kafka =======================
echo ^>^> Staring Docker containers...
docker-compose -f broker/docker-compose.yml up -d --build

echo ^>^> Kafka Register...
cd broker/KafkaRegister || ( echo KafkaRegister directory not found! & exit /b 1 )
call npm install
call node kafkaRegister.js
cd ..\..

echo ^>^> Done!
pause
