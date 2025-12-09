@echo off
echo ========================================
echo Testing Appointment Management System
echo ========================================
echo.
echo Checking Node.js version...
node --version
echo.
echo Checking npm version...
npm --version
echo.
echo Checking if react-scripts exists...
if exist "node_modules\.bin\react-scripts.cmd" (
    echo ✓ react-scripts found!
) else (
    echo ✗ react-scripts NOT found!
    exit /b 1
)
echo.
echo All checks passed! You can now run: npm start
echo.
echo ========================================
echo READY TO START!
echo ========================================
echo.
echo Run this command to start the app:
echo npm start
echo.
pause
