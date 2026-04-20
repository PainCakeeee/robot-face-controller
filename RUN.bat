@echo off
REM Robot Face Controller - 一键启动脚本（打包版）
REM 此脚本用于运行打包后的程序

setlocal enabledelayedexpansion

REM 获取当前脚本所在目录
cd /d "%~dp0"

REM 设置窗口标题
title Robot Face Controller

REM 检查 Node.js 是否安装
echo.
echo ================================================
echo    Robot Face Controller - 启动
echo ================================================
echo.
echo 📋 检查环境...

node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误：Node.js 未安装
    echo.
    echo 请访问以下网址安装 Node.js:
    echo https://nodejs.org/ （下载 LTS 版本）
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js 已安装: %NODE_VERSION%

REM 检查dist文件夹
if not exist "dist" (
    echo.
    echo ❌ 错误：找不到dist文件夹！
    echo 程序文件损坏，请重新解压。
    pause
    exit /b 1
)
echo ✅ 程序文件正常

REM 启动服务器
echo.
echo 🚀 启动服务器中...
echo.
node server.js

REM 如果服务器异常退出
if errorlevel 1 (
    echo.
    echo ❌ 服务器启动失败！
    pause
)

exit /b 0
