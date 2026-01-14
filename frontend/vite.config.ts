import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  server: {
    port: 3000,
    host: '0.0.0.0',
    hmr: false
  }
});
