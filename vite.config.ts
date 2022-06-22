import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vitedgePlugin from 'vitedge/plugin.js';

export default defineConfig({
  plugins: [vitedgePlugin(), vue()]
});
