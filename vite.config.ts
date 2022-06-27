import { defineConfig } from 'vite';
import * as path from 'path';
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
import { vueI18n } from '@intlify/vite-plugin-vue-i18n';
import Pages from 'vite-plugin-pages';

export default defineConfig({
  plugins: [
    vitedgePlugin(),
    vue(),
    Pages({
      extensions: ['vue']
    }),
    vueI18n({
      include: path.resolve(__dirname, './src/locales/**'),
      compositionOnly: true
    }),
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
