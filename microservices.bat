echo ================== Microservices =======================
echo Setup...
cd microservices\Setup || exit /b
call npm install
call node setup.js

echo Starting Docker containers...
cd ..\
docker-compose up --build -d

echo Registering servers...
call node Setup\serversRegister.js

echo Done!
pause