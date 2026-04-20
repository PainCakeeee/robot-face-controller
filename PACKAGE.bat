@echo off
REM 打包脚本 - 将程序打包成可部署的zip文件

setlocal enabledelayedexpansion

REM 获取当前目录
cd /d "%~dp0"

REM 定义颜色和变量
set PACKAGE_NAME=robot-face-controller-v1.0.0
set TIMESTAMP=%date:~10,4%%date:~4,2%%date:~7,2%-%time:~0,2%%time:~3,2%%time:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%
set OUTPUT_FILE=%PACKAGE_NAME%-%TIMESTAMP%.zip

echo.
echo ================================================
echo    Robot Face Controller - 打包工具
echo ================================================
echo.

REM 检查必要文件
echo 📋 检查必要文件...

if not exist "dist" (
    echo ❌ 错误：dist 文件夹不存在！
    echo 请先运行: npm run build
    pause
    exit /b 1
)
echo ✅ dist 文件夹 OK

if not exist "server.js" (
    echo ❌ 错误：server.js 不存在！
    pause
    exit /b 1
)
echo ✅ server.js OK

if not exist "RUN.bat" (
    echo ❌ 错误：RUN.bat 不存在！
    pause
    exit /b 1
)
echo ✅ RUN.bat OK

if not exist "package.json" (
    echo ❌ 错误：package.json 不存在！
    pause
    exit /b 1
)
echo ✅ package.json OK

REM 检查PowerShell
powershell -NoProfile -Command "exit" >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误：PowerShell 不可用
    pause
    exit /b 1
)
echo ✅ PowerShell OK

echo.
echo 📦 打包文件...
echo 输出文件: %OUTPUT_FILE%
echo.

REM 使用PowerShell创建zip文件
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  $compress = @{ ^
    Path = 'dist', 'server.js', 'RUN.bat', 'package.json', 'DEPLOYMENT_GUIDE.md', 'package-lock.json', 'node_modules'; ^
    DestinationPath = '%OUTPUT_FILE%'; ^
    CompressionLevel = 'Optimal'; ^
    Force = $true ^
  }; ^
  Compress-Archive @compress

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ 打包成功！
    echo.
    echo 📄 文件信息：
    for /f "usebackq" %%A in ('%OUTPUT_FILE%') do (
        set "FILE_SIZE=%%~zA"
    )
    if defined FILE_SIZE (
        set /a FILE_SIZE_MB=FILE_SIZE/1024/1024
        echo    文件大小: !FILE_SIZE_MB! MB
    )
    echo    文件名: %OUTPUT_FILE%
    echo    位置: %cd%
    echo.
    echo 📋 使用说明：
    echo    1. 将 %OUTPUT_FILE% 复制到目标电脑
    echo    2. 解压到任意文件夹
    echo    3. 双击 RUN.bat 运行
    echo.
    echo ================================================
    pause
) else (
    echo.
    echo ❌ 打包失败！
    pause
    exit /b 1
)
