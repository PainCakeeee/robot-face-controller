@echo off
REM 打包脚本 - 打包成独立exe文件（包含Node.js运行时）

setlocal enabledelayedexpansion

REM 获取当前目录
cd /d "%~dp0"

echo.
echo ================================================
echo    Robot Face Controller - EXE 打包工具
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

if not exist "1.ico" (
    echo ❌ 错误：1.ico 图标文件不存在！
    pause
    exit /b 1
)
echo ✅ 1.ico 图标 OK

if not exist "package.json" (
    echo ❌ 错误：package.json 不存在！
    pause
    exit /b 1
)
echo ✅ package.json OK

REM 检查pkg是否安装
pkg --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误：pkg 未安装！
    echo 正在全局安装 pkg...
    npm install -g pkg
    if errorlevel 1 (
        echo ❌ pkg 安装失败！
        pause
        exit /b 1
    )
)
echo ✅ pkg 已安装

REM 创建输出目录
if exist "build" (
    echo 🗑️  清理旧文件...
    rmdir /s /q build
)
mkdir build
echo ✅ 输出目录准备完毕

echo.
echo 🔨 开始打包（这可能需要 2-5 分钟，请耐心等待）...
echo.

REM 使用pkg打包
pkg . --targets win-x64 --output "build/RobotFaceController.exe" --icon "1.ico"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ 打包成功！
    echo.
    echo 📄 输出文件信息：
    echo    文件名: RobotFaceController.exe
    echo    位置: %cd%\build\
    
    if exist "build\RobotFaceController.exe" (
        for /f "usebackq" %%A in ('build\RobotFaceController.exe') do (
            set "FILE_SIZE=%%~zA"
        )
        if defined FILE_SIZE (
            set /a FILE_SIZE_MB=FILE_SIZE/1024/1024
            echo    大小: !FILE_SIZE_MB! MB
        )
    )
    
    echo.
    echo 📋 使用说明：
    echo    1. 将 RobotFaceController.exe 复制到目标电脑
    echo    2. 直接双击运行（无需安装，无需Node.js）
    echo    3. 程序会自动打开浏览器
    echo.
    echo ♻️  清理临时文件...
    
    REM 打包完成后可选择保留或清理源文件
    echo.
    echo ✨ 打包完成！
    echo.
    pause
) else (
    echo.
    echo ❌ 打包失败！
    echo 请检查：
    echo   - Node.js 版本是否兼容
    echo   - 磁盘空间是否充足
    echo   - 防火墙是否阻止了 pkg
    echo.
    pause
    exit /b 1
)
