# 🚀 Robot Face Controller - 快速启动指南

## 第一次使用（创建快捷方式）

### 步骤 1：打开 PowerShell（管理员模式）
- 右键点击开始菜单 → Windows PowerShell (管理员)
- 或按 `Win + X` 然后选择 Windows PowerShell (管理员)

### 步骤 2：运行快捷方式创建脚本
在 PowerShell 中运行以下命令（一行一行输入）：

```powershell
cd "d:\Programming\robot-face-controller"
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope CurrentUser
.\create-shortcut.ps1
```

或者更简单的方式，直接运行：
```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "d:\Programming\robot-face-controller\create-shortcut.ps1"
```

### 步骤 3：检查桌面
如果一切正常，你会在桌面上看到一个新的快捷方式：`Robot Face Controller`

---

## 日常使用

只需 **双击桌面上的 "Robot Face Controller"** 快捷方式，脚本会自动：

1. ✅ 检查 Node.js 是否安装
2. ✅ 自动安装/更新依赖（首次运行）
3. ✅ 启动开发服务器
4. ✅ 自动打开两个浏览器窗口：
   - Display 页面：http://localhost:3000/display
   - Control 页面：http://localhost:3000/control

---

## 其他方法

### 方法 1：直接运行批处理文件
在项目目录中，双击 `start-robot.bat` 文件

### 方法 2：使用命令行
```bash
cd d:\Programming\robot-face-controller
npm install  # 首次需要
npm run dev
```

然后手动在浏览器中打开：
- http://localhost:3000/display
- http://localhost:3000/control

---

## 停止服务器

按 `Ctrl + C` 停止开发服务器

---

## 如果遇到问题

### PowerShell 执行策略错误
运行以下命令允许脚本执行：
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope CurrentUser
```

### Node.js 未安装
从 https://nodejs.org 下载并安装 LTS 版本，然后重试

### 端口 3000 被占用
1. 找到占用 3000 端口的进程：`netstat -ano | findstr :3000`
2. 关闭该进程或修改 vite.config.ts 中的端口号

---

## 快捷方式位置修改

如果你想自定义快捷方式的位置（比如放在特定文件夹），可以编辑 `create-shortcut.ps1` 文件中的这一行：

```powershell
$desktopPath = [Environment]::GetFolderPath("Desktop")  # 改这里
```

修改为你想要的路径，例如：
```powershell
$desktopPath = "C:\Users\YourUsername\Downloads"  # 放在下载文件夹
```

---

享受开发！🎉
