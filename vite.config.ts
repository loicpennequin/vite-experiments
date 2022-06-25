import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vitedgePlugin from 'vitedge/plugin.js';
import Components from 'unplugin-vue-components/vite';
import Icons from 'unplugin-icons/vite';
import Unocss from 'unocss/vite';
import presetWind from '@unocss/preset-wind';
import { presetAttributify } from 'unocss';
import transformerDirective from '@unocss/transformer-directives';
import IconsResolver from 'unplugin-icons/resolver';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';

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
      dirs: ['./src/components'],
      directives: true,
      resolvers: [
        IconsResolver({
          customCollections: ['pkmn'],
          prefix: 'icon'
        })
      ]
    }),
    Icons({
      customCollections: {
        pkmn: FileSystemIconLoader('./src/assets/icons', svg =>
          svg.replace(/^<svg /, '<svg fill="currentColor" ')
        )
      }
    })
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['vitest.setup.ts']
  }
});
