@echo off
setlocal

cd initDB
call npm install
call node scripts.js
cd ../

pause
