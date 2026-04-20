# 测试脚本
$process = Start-Process -FilePath "node" -ArgumentList "server.js" -PassThru -NoNewWindow

Start-Sleep -Seconds 3

if ($process.HasExited) {
    Write-Host "❌ 服务器启动失败" -ForegroundColor Red
    exit 1
} else {
    Write-Host "✅ 服务器启动成功！" -ForegroundColor Green
    Write-Host "   PID: $($process.Id)"
    Write-Host "   状态: 运行中..."
    $process | Stop-Process -Force
    Write-Host "   已停止测试"
}
