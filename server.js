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
