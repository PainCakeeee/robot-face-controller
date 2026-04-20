import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',      // 优化开发服务器启动速度
      middlewareMode: false,
      // 预优化依赖，加快首次加载
      preTransformRequests: ['/src/App.tsx', '/src/main.tsx'],
    },
    // 优化构建配置
    optimizeDeps: {
      // 预编译这些依赖以加快启动
      include: ['react', 'react-dom', 'react-router-dom', 'motion/react'],    },
  };
});
