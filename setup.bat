@echo off
setlocal

echo ================== Consul =======================
echo Staring Docker container...
docker-compose -f consul/docker-compose.yml up -d --build

echo ================== Kafka =======================
echo Staring Docker containers...
docker-compose -f broker/docker-compose.yml up -d --build

echo Kafka Register...
cd broker/KafkaRegister || exit /b
call npm install
call node kafkaRegister.js
cd ..\..