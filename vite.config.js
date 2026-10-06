import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],

  build: {
    manifest: true,

    rollupOptions: {
      input: {
        main: path.resolve(process.cwd(), 'index.html'),

        admin: path.resolve(process.cwd(), 'admin.html'),

        articlePreview: path.resolve(process.cwd(), 'article-preview.html'),
      },
    },
  },

  ssr: {
    noExternal: ['react-helmet-async'],
  },

  server: {
    proxy: {
      '/api': 'http://127.0.0.1:8787',
    },
  },
});
