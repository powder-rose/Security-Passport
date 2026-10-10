import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

import { resolveRegulationRegistryPath } from './shared/regulations/registry-path.js';

const regulationRegistry = resolveRegulationRegistryPath({
  projectRoot: process.cwd(),
});

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@regulations-registry': regulationRegistry,
    },
  },

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
    host: '0.0.0.0',
  },
});
