import { defineConfig } from 'vite';

// Relative base so the built site works from any path (e.g. static hosts / subfolders).
export default defineConfig({
  base: './',
  server: {
    host: true,
    port: 5173,
  },
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
  },
});
