@echo off
setlocal

echo ================== Consul =======================
echo Staring Docker container...
docker-compose -f consul/docker-compose.yml up -d --build