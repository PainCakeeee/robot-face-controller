# 🚀 Robot Face Controller - 部署方案B（完整可携带包）

## ✨ 特点

✅ **完全独立** - 包含所有依赖和运行时，无需安装任何东西  
✅ **开箱即用** - 解压后直接双击 RUN.bat 运行  
✅ **小文件** - 单个 zip 文件（~50MB），易于传输  
✅ **跨网络** - 可复制到 U 盘、网络驱动器等任何地方运行  
✅ **自定义图标** - exe 和快捷方式使用项目图标  

## 📦 快速开始（3步）

### 1️⃣ 在开发电脑上打包

```bash
# 进入项目目录
cd robot-face-controller

# 双击运行打包脚本
BUILD-PACKAGE.bat

# 或用PowerShell
powershell -ExecutionPolicy Bypass -File "Package.ps1"
```

**结果：** 在 `build/` 文件夹中生成 `RobotFaceController-Portable-v1.0.0.zip`（~50MB）

### 2️⃣ 复制到目标电脑

- 将 zip 文件复制到目标电脑任意位置
- 用 Windows 资源管理器解压（右键 → 解压）
- 或用任何解压工具解压

### 3️⃣ 运行程序

**双击文件夹中的 `RUN.bat`**

程序会：
- ✅ 自动启动服务器
- ✅ 自动打开浏览器
- ✅ 显示运行状态

## 🔍 包内文件结构

```
RobotFaceController-Portable-v1.0.0.zip
├── RUN.bat                 ⭐ 启动脚本（双击）
├── server.js               📱 Express 服务器
├── Package.ps1            🔧 打包脚本
├── package.json           📝 项目配置
├── package-lock.json      🔒 依赖锁定
├── 1.ico                  🎨 项目图标
├── dist/                  📦 编译的前端文件
│   ├── index.html
│   ├── assets/
│   └── ...
└── node_modules/          📚 所有依赖包
    ├── express/
    ├── react/
    ├── react-dom/
    └── ... (其他依赖)
```

## 💡 系统要求

| 项目 | 要求 |
|------|------|
| **操作系统** | Windows 7 或更高版本 |
| **处理器** | 64位 CPU（推荐 2GHz 以上） |
| **内存** | 最少 512MB（推荐 1GB+） |
| **硬盘空间** | 解压后 ~150MB |
| **浏览器** | 任何现代浏览器（Chrome、Firefox、Edge、Safari） |
| **特殊要求** | **无** - 不需要 Node.js，不需要 npm |

## 🎯 使用场景

### 场景1：在教室多台电脑上运行
1. U 盘上放 zip 文件
2. 每台电脑上解压
3. 双击 RUN.bat

### 场景2：分发给学生
1. 打包 zip 文件
2. 通过邮件/网盘分享
3. 学生解压后就能用

### 场景3：离线演示
1. 从互联网下载 zip
2. 不需要网络连接（除非应用需要）
3. 任何地方都能运行

## 🆘 常见问题

### Q1: 解压后无法启动（提示找不到 Node.js）
❌ **不应该出现** - 所有依赖已包含  
✅ **解决方案：**
- 确保完整解压（所有文件都在）
- 检查磁盘空间是否足够
- 用不同解压工具试试

### Q2: 启动时显示端口被占用
**症状：** 错误信息 "EADDRINUSE"

**解决方案：**
```
1. 关闭其他使用端口 3000 的程序
2. 或编辑 server.js，找到 const PORT = 3000，改成其他端口如 8080
```

### Q3: 浏览器未自动打开
**解决方案：**
- 手动打开浏览器
- 访问：http://localhost:3000

### Q4: 程序启动后闪退
**可能原因：**
- 磁盘空间不足
- 防火墙阻止
- 文件损坏

**解决方案：**
```
1. 重新解压（覆盖所有文件）
2. 关闭防火墙或添加例外
3. 运行防病毒软件检查
```

### Q5: 如何在新电脑上运行
1. 复制整个解压文件夹
2. 或重新解压 zip
3. 双击 RUN.bat

## 🔄 更新程序

需要更新前端或后端代码？

**方案A - 快速修改**（推荐开发中）
```bash
# 在原电脑上修改代码后
npm run build

# 重新打包
BUILD-PACKAGE.bat
```

**方案B - 手动更新分发版本**
```bash
# 解压旧版 zip
# 替换：dist/ 文件夹或 server.js
# 压缩成新的 zip
```

## 📊 文件大小参考

| 组件 | 大小 | 说明 |
|------|------|------|
| node_modules | ~30MB | 所有依赖包 |
| dist | ~0.5MB | 编译的前端 |
| 其他文件 | ~1MB | 配置、脚本等 |
| **压缩后 zip** | **~50MB** | 使用Brotli压缩 |

## 🎓 技术细节

### 包含的技术栈
- **Node.js v24** - 运行时环境
- **Express.js** - Web 服务器
- **React 19** - 前端框架
- **Vite** - 构建工具
- **TypeScript** - 编程语言
- **TailwindCSS** - 样式框架

### 启动流程
```
1. RUN.bat 启动
2. server.js 初始化 Express 服务器
3. 监听 http://localhost:3000
4. dist/ 文件夹中提供静态文件
5. 所有路由返回 index.html（SPA 模式）
6. 浏览器自动打开
```

## 🛠️ 高级用法

### 修改端口
编辑 `server.js`：
```javascript
const PORT = 3000;  // 改成 8080 或其他端口
```

### 后台运行
```powershell
Start-Process -NoNewWindow -FilePath "cmd.exe" -ArgumentList "/c RUN.bat"
```

### 创建快捷方式
```batch
@echo off
cd /d "%~dp0"
node server.js
```

### 使用不同浏览器
编辑 `server.js` 后面添加：
```javascript
const open = require('open');
open('http://localhost:3000', {app: ['chrome']});
```

## 📝 版本信息

| 项目 | 信息 |
|------|------|
| **程序名** | Robot Face Controller |
| **版本** | 1.0.0 |
| **打包日期** | 2026年4月 |
| **包大小** | ~50MB |
| **运行环境** | Windows 64位 |
| **图标** | 1.ico |

## ✅ 验证清单

打包前检查：
- ✅ npm run build 成功
- ✅ npm install 完成
- ✅ dist/ 文件夹存在
- ✅ server.js 文件存在
- ✅ RUN.bat 文件存在
- ✅ 1.ico 图标文件存在

打包后测试：
- ✅ zip 文件生成成功
- ✅ 可以在其他文件夹解压
- ✅ 解压后 RUN.bat 可执行
- ✅ 浏览器能访问 http://localhost:3000

## 🚀 推荐流程

**首次部署：**
```
1. npm install
2. npm run build
3. BUILD-PACKAGE.bat
4. 在其他电脑解压并测试
5. 分发 zip 文件
```

**后续更新：**
```
1. 修改代码
2. npm run build
3. BUILD-PACKAGE.bat
4. 替换旧的 zip 文件
```

---

**祝使用愉快！** 🎉  
如有问题，检查上面的常见问题部分。
