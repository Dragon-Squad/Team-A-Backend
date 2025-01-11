echo ================== Kong =======================
echo Starting Kong Docker containers...
docker-compose -f gateway/docker-compose.yml up -d --build

echo ">> Done!"