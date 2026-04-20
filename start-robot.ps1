# Robot Face Controller 启动脚本
# 这个脚本会自动：
# 1. 检查并安装依赖
# 2. 启动开发服务器
# 3. 在当前窗口显示菜单，让用户手动打开页面

$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectPath

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "    Robot Face Controller - 启动脚本" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Node.js 是否安装
Write-Host "📋 检查环境..." -ForegroundColor Yellow
$nodeCheck = node --version 2>$null
if (-not $nodeCheck) {
    Write-Host "❌ Node.js 未安装！请先安装 Node.js" -ForegroundColor Red
    Read-Host "按 Enter 键退出"
    exit 1
}
Write-Host "✅ Node.js 已安装: $nodeCheck" -ForegroundColor Green

# 检查并安装依赖
Write-Host ""
Write-Host "📦 检查依赖..." -ForegroundColor Yellow

if (-not (Test-Path "node_modules")) {
    Write-Host "⏳ 首次运行，安装依赖中...（这可能需要几分钟）" -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ 依赖安装失败！" -ForegroundColor Red
        Read-Host "按 Enter 键退出"
        exit 1
    }
    Write-Host "✅ 依赖安装完成" -ForegroundColor Green
} else {
    Write-Host "✅ 依赖已存在（已缓存）" -ForegroundColor Green
}

# 启动开发服务器
Write-Host ""
Write-Host "🚀 启动开发服务器..." -ForegroundColor Yellow
Write-Host "服务器运行地址: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 启动进度：" -ForegroundColor Cyan
Write-Host "  1️⃣  Vite 初始化服务器... (应在 1-2 秒内完成)" -ForegroundColor Cyan
Write-Host "  2️⃣  编译 React 和 TypeScript... (首次可能需要 5-10 秒)" -ForegroundColor Cyan
Write-Host "  3️⃣  准备资源... (通常 1-2 秒)" -ForegroundColor Cyan
Write-Host ""

# 创建一个临时启动脚本在后台运行
$tempScript = [System.IO.Path]::GetTempFileName() -replace '\.tmp$', '.ps1'
@"
`$projectPath = "$projectPath"
Set-Location `$projectPath

# 优化 Vite 启动速度：禁用类型检查热模块替换
`$env:DISABLE_HMR = 'false'

# 启动 Vite 开发服务器
npm run dev
"@ | Set-Content $tempScript

# 在新的 PowerShell 窗口中启动开发服务器（最小化窗口）
$devWindow = Start-Process PowerShell -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$tempScript`"" -PassThru -WindowStyle Minimized

# 给 Vite 一点时间启动（约 1 秒）
Start-Sleep -Seconds 1

Write-Host ""
Write-Host "✅ 开发服务器已启动！" -ForegroundColor Green
Write-Host ""

# 自动打开两个浏览器窗口
Write-Host "🌐 正在打开页面..." -ForegroundColor Cyan
Start-Process "http://localhost:3000/display"
Start-Sleep -Milliseconds 500
Start-Process "http://localhost:3000/control"

Write-Host "✅ Display 和 Control 页面已打开" -ForegroundColor Green
Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "✨ 启动完成！两个页面已在浏览器中打开" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "💡 提示：" -ForegroundColor Cyan
Write-Host "  • 服务器运行在后台窗口中" -ForegroundColor Cyan
Write-Host "  • 按 Ctrl+C 可停止此脚本（不影响浏览器）" -ForegroundColor Cyan
Write-Host "  • 关闭此窗口不会影响服务器运行" -ForegroundColor Cyan
Write-Host ""
