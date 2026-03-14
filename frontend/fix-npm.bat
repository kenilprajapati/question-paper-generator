@echo off
echo Fixing npm install crash...

echo Step 1: Cleaning up old files...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo Step 2: Installing with legacy peer deps...
npm install --legacy-peer-deps --no-optional

echo Done!
pause
