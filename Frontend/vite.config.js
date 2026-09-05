import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const devPort = Number(env.VITE_DEV_PORT || 5173);

  return {
    server: {
      port: devPort,
      proxy: {
        '/api': env.VITE_PROXY || 'http://localhost:5000',
      },
    },
    plugins: [react()],
  };
});