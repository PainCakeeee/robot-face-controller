# PowerShell脚本：压缩文件创建部署包

param(
    [string]$OutputFile = "RobotFaceController-Portable-v1.0.0.zip"
)

$BuildDir = "build"
$SourceFiles = @("dist", "server.js", "RUN.bat", "package.json", "package-lock.json", "node_modules", "1.ico")

# 检查文件是否存在
foreach ($file in $SourceFiles) {
    if (-not (Test-Path $file)) {
        Write-Host "❌ 错误: 找不到 $file" -ForegroundColor Red
        exit 1
    }
}

# 创建build目录
if (-not (Test-Path $BuildDir)) {
    New-Item -ItemType Directory -Path $BuildDir | Out-Null
}

$OutputPath = Join-Path $BuildDir $OutputFile

# 删除旧文件
if (Test-Path $OutputPath) {
    Remove-Item $OutputPath -Force
}

Write-Host "🔨 打包中..." -ForegroundColor Yellow

# 压缩文件
Compress-Archive -Path $SourceFiles -DestinationPath $OutputPath -CompressionLevel Optimal -Force

if (Test-Path $OutputPath) {
    $size = (Get-Item $OutputPath).Length / 1MB
    Write-Host "✅ 打包成功!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📄 输出信息:" -ForegroundColor Cyan
    Write-Host "   文件名: $OutputFile"
    Write-Host "   位置: $(Get-Location)\$BuildDir\"
    Write-Host "   大小: $([math]::Round($size, 1)) MB"
    Write-Host ""
    Write-Host "📋 使用说明:" -ForegroundColor Cyan
    Write-Host "   1. 将 $OutputFile 复制到目标电脑"
    Write-Host "   2. 用 Windows 资源管理器解压"
    Write-Host "   3. 双击 RUN.bat 启动程序"
    Write-Host "   ✨ 无需 Node.js，无需 npm install"
    Write-Host ""
} else {
    Write-Host "❌ 打包失败!" -ForegroundColor Red
    exit 1
}
