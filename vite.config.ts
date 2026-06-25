import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('lucide-react')) return 'icons';
          if (id.includes('react') || id.includes('scheduler')) return 'react-vendor';
          return 'vendor';
        }
      }
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://127.0.0.1:4000'
    }
  }
});
