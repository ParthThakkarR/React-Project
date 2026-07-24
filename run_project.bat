@echo off
TITLE Organic Food E-Commerce Store Launcher
CLS
ECHO ===================================================================
ECHO         ORGANIC FOOD E-COMMERCE FULL-STACK APPLICATION
ECHO ===================================================================
ECHO.

SET ROOT_DIR=%~dp0

ECHO [1/4] Checking and installing Backend dependencies...
CD /D "%ROOT_DIR%backend"
IF NOT EXIST node_modules (
    ECHO Installing backend packages...
    CALL npm install
) ELSE (
    ECHO Backend node_modules found.
)

ECHO.
ECHO [2/4] Checking and installing Frontend dependencies...
CD /D "%ROOT_DIR%React\First"
IF NOT EXIST node_modules (
    ECHO Installing frontend packages...
    CALL npm install
) ELSE (
    ECHO Frontend node_modules found.
)

ECHO.
ECHO [3/4] Launching Backend Server on http://localhost:5000 ...
START "Backend Server (Express + MongoDB)" cmd /k "cd /d "%ROOT_DIR%backend" && npm start"

ECHO.
ECHO [4/4] Launching Frontend Application on Vite ...
START "Frontend Client (React + Vite)" cmd /k "cd /d "%ROOT_DIR%React\First" && npm run dev"

ECHO.
ECHO ===================================================================
ECHO  SUCCESS! Both Backend and Frontend servers are starting up.
ECHO  - Backend API:  http://localhost:5000/api/products
ECHO  - Frontend App: http://localhost:5173
ECHO ===================================================================
ECHO.

TIMEOUT /T 3 >NUL
START http://localhost:5173

PAUSE
