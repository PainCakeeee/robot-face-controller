# 创建快捷方式脚本
# 运行此脚本可在项目文件夹和桌面创建"Robot Face Controller"启动快捷方式

$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$batFile = Join-Path $projectPath "RUN.bat"
$icoFile = Join-Path $projectPath "1.ico"
$desktopPath = [Environment]::GetFolderPath("Desktop")
$shortcutPathDesktop = Join-Path $desktopPath "Robot Face Controller.lnk"
$shortcutPathProject = Join-Path $projectPath "Robot Face Controller.lnk"

# 验证文件存在
if (-not (Test-Path $batFile)) {
    Write-Host "❌ 错误：RUN.bat 不存在！" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $icoFile)) {
    Write-Host "❌ 错误：1.ico 不存在！" -ForegroundColor Red
    exit 1
}

# 创建快捷方式对象
$WshShell = New-Object -ComObject WScript.Shell

# 1. 在项目文件夹中创建快捷方式
$shortcut = $WshShell.CreateShortcut($shortcutPathProject)
$shortcut.TargetPath = $batFile
$shortcut.WorkingDirectory = $projectPath
$shortcut.Description = "Robot Face Controller - 双击启动程序"
$shortcut.IconLocation = $icoFile
$shortcut.WindowStyle = 1
$shortcut.Save()
Write-Host "✅ 项目文件夹快捷方式已创建：$shortcutPathProject" -ForegroundColor Green

# 2. 在桌面创建快捷方式
$shortcut2 = $WshShell.CreateShortcut($shortcutPathDesktop)
$shortcut2.TargetPath = $batFile
$shortcut2.WorkingDirectory = $projectPath
$shortcut2.Description = "Robot Face Controller - 双击启动程序"
$shortcut2.IconLocation = $icoFile
$shortcut2.WindowStyle = 1
$shortcut2.Save()
Write-Host "✅ 桌面快捷方式已创建：$shortcutPathDesktop" -ForegroundColor Green

Write-Host ""
Write-Host "📌 现在您可以：" -ForegroundColor Cyan
Write-Host "   1. 双击项目文件夹中的 'Robot Face Controller.lnk' 启动程序"
Write-Host "   2. 双击桌面上的 'Robot Face Controller.lnk' 启动程序"
Write-Host "   3. 快捷方式使用了自定义图标 (1.ico)"
Write-Host ""
Write-Host "💡 如果快捷方式图标显示不正确，尝试按 F5 刷新文件夹"
