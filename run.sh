#!/bin/bash

# Exit on any error
set -e

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

echo "================== Microservices ======================="
echo ">> Setup..."
cd microservices/Setup || { echo "Setup directory not found!"; exit 1; }
npm install
node setup.js

echo ">> Starting Microservices Docker containers..."
cd ..
docker-compose up --build -d

# Health check for the service at localhost:8007/crypt/test
echo ">> Checking server health..."
for i in {1..10}; do
  if curl -s http://localhost:8007/crypt/test | grep -q "Server is working!"; then
    echo ">> Server is ready!"
    break
  fi
  echo "Waiting for server... Attempt $i"
  sleep 2
done

# If the server isn't ready after 10 attempts, exit with an error
if ! curl -s http://localhost:8007/crypt/test | grep -q "Server is working!"; then
  echo ">> Server health check failed!" >&2
  exit 1
fi

echo ">> Registering servers..."
node microservices/Setup/serversRegister.js

echo "================== Kong ======================="
echo ">> Starting Kong Docker containers..."
docker-compose -f gateway/docker-compose.yml up -d

echo ">> All tasks completed!"
