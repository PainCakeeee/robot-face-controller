@echo off
REM Robot Face Controller - 完整包打包脚本
REM 包含: dist文件、server.js、package.json、node_modules、RUN.bat

setlocal enabledelayedexpansion

cd /d "%~dp0"

echo.
echo ================================================
echo    Robot Face Controller - 完整包打包
echo ================================================
echo.

REM 检查必要文件和文件夹
echo 📋 检查必要文件...

if not exist "dist" (
    echo ❌ dist 文件夹不存在！
    echo 请先运行: npm run build
    pause
    exit /b 1
)
echo ✅ dist

if not exist "server.js" (
    echo ❌ server.js 不存在！
    pause
    exit /b 1
)
echo ✅ server.js

if not exist "RUN.bat" (
    echo ❌ RUN.bat 不存在！
    pause
    exit /b 1
)
echo ✅ RUN.bat

if not exist "node_modules" (
    echo ❌ node_modules 不存在！
    echo 请先运行: npm install
    pause
    exit /b 1
)
echo ✅ node_modules

if not exist "package.json" (
    echo ❌ package.json 不存在！
    pause
    exit /b 1
)
echo ✅ package.json

REM 清理旧包
if exist "build" (
    echo 🗑️  清理旧文件...
    rmdir /s /q build
)

echo.
echo 运行打包脚本...
powershell -NoProfile -ExecutionPolicy Bypass -File "Package.ps1"

pause
