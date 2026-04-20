@echo off
REM Robot Face Controller 启动脚本
REM 使用 PowerShell 运行启动脚本

setlocal enabledelayedexpansion

REM 获取当前脚本所在目录
cd /d "%~dp0"

REM 运行 PowerShell 脚本
powershell -NoProfile -ExecutionPolicy Bypass -File "start-robot.ps1"

pause
