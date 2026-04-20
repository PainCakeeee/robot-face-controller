# ⚡ 快速修复指南 - 针对已解压的用户

如果你已经解压了旧版本并遇到 `require is not defined` 错误，可以用两种方式修复：

---

## 方式 A: 快速修复（仅替换 server.js）⭐ 推荐

### 步骤 1: 获取修复后的 server.js
选择其中一种方式获取新的 server.js：

**选项1：下载新版 zip**
- 下载 `RobotFaceController-Portable-v1.0.0.zip`（已修复版）
- 从中提取 `server.js` 文件

**选项2：手动修改现有 server.js**
打开 `server.js` 文件，将第一行改为：

```javascript
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
```

替换掉原来的：
```javascript
const express = require('express');
const path = require('path');
const fs = require('fs');
```

然后将最后一行也改成 `import` 风格（或使用新版本中的完整 server.js）

### 步骤 2: 运行程序
修改后直接双击 `RUN.bat` 应该可以正常运行 ✅

---

## 方式 B: 完整重新安装（推荐新手）

### 步骤 1: 备份旧版本
```
1. 旧文件夹: F:\Robot\RobotFaceController-Portable-v1.0.0
2. 改名: RobotFaceController-Portable-v1.0.0-old
3. 保存备份
```

### 步骤 2: 解压新版本
```
1. 下载新 zip: RobotFaceController-Portable-v1.0.0.zip
2. 解压到相同位置
3. 会得到新的 RobotFaceController-Portable-v1.0.0 文件夹
```

### 步骤 3: 运行
```
1. 双击 RUN.bat
2. 或运行快捷方式创建脚本：
   powershell -ExecutionPolicy Bypass -File "create-shortcut.ps1"
3. 双击生成的 Robot Face Controller.lnk 快捷方式
```

---

## 🎯 修改关键代码部分

如果你选择手动修改，这是 server.js 需要改的地方：

### 顶部导入部分
```javascript
// ❌ 旧的（会报错）
const express = require('express');
const path = require('path');
const fs = require('fs');

// ✅ 新的（正确）
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
```

### 其余代码保持不变
其他部分不需要改，只需要把 `require()` 改成 `import`

---

## 📋 完整修复的 server.js

完整的正确版本已在项目中准备好，可以直接复制使用：

**位置：** `server.js` （在修复版 zip 中）

```javascript
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const distPath = path.join(__dirname, 'dist');

// 检查dist文件夹是否存在
if (!fs.existsSync(distPath)) {
  console.error('❌ 错误：找不到dist文件夹！');
  console.error('请先运行: npm run build');
  process.exit(1);
}

// 提供静态文件
app.use(express.static(distPath));

// SPA路由配置 - 所有未知路由都返回index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// 启动服务器
app.listen(PORT, '0.0.0.0', () => {
  console.log('================================================');
  console.log('   🚀 Robot Face Controller 已启动');
  console.log('================================================');
  console.log('');
  console.log('📱 打开浏览器访问:');
  console.log(`   👉 http://localhost:${PORT}`);
  console.log('');
  console.log('💡 提示：');
  console.log('   - 按 Ctrl+C 停止服务器');
  console.log('   - 关闭此窗口将停止程序运行');
  console.log('');
  console.log('================================================');
});

// 处理服务器错误
process.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ 端口 ${PORT} 已被占用！`);
    console.error('请关闭占用该端口的其他程序后重试');
  } else {
    console.error('服务器错误:', err);
  }
  process.exit(1);
});
```

直接复制替换即可 ✅

---

## ✅ 快速检查清单

修复后验证：

- [ ] 打开 server.js
- [ ] 确认第 1 行是 `import express from 'express'`
- [ ] 确认有 `const __dirname = path.dirname(__filename)` 这一行
- [ ] 双击 RUN.bat
- [ ] 应该看到 "🚀 Robot Face Controller 已启动" 的信息
- [ ] 浏览器自动打开 http://localhost:3000

---

## 🎉 图标快捷方式

修复后，如果想用自定义图标启动：

```powershell
powershell -ExecutionPolicy Bypass -File "create-shortcut.ps1"
```

这会在文件夹中创建 `Robot Face Controller.lnk` 快捷方式，使用 1.ico 图标 ✨

---

## 📞 如果还是有问题

1. **确认 dist 文件夹存在** - 应该有 index.html
2. **检查磁盘空间** - 至少需要 150MB
3. **关闭防火墙或添加例外** - 可能阻止了 3000 端口
4. **重新解压 zip** - 确保文件完整

---

**现在就试试吧！应该能正常运行了。** 🚀
