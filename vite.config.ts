import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vitedgePlugin from 'vitedge/plugin.js';
import Components from 'unplugin-vue-components/vite';
import Unocss from 'unocss/vite';
import { presetAttributify } from 'unocss';
import presetWind from '@unocss/preset-wind';
import transformerDirective from '@unocss/transformer-directives';

export default defineConfig({
  plugins: [
    vitedgePlugin(),
    vue(),
    Unocss({
      presets: [presetAttributify(), presetWind()],
      transformers: [transformerDirective()]
    }),
    Components({
      dts: 'src/typings/components.d.ts',
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      directives: true
    })
  ],
  test: {
    globals: true,
    environment: 'jsdom'
  }
});
