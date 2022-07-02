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
import eslintPlugin from 'vite-plugin-eslint';
import Pages from 'vite-plugin-pages';
import { VitePWA } from 'vite-plugin-pwa';
import GenerateIcons from './scripts/vite-plugins/svg-sprite-map';
import { minifyHtml } from 'vite-plugin-html';

export default defineConfig({
  plugins: [
    vitedgePlugin(),
    eslintPlugin(),
    vue(),
    minifyHtml(),
    GenerateIcons({
      src: './src/assets/icons/*.svg',
      spriteDest: '/assets/svg/svg-sprite-map.generated.svg',
      linksDest: path.join(process.cwd(), 'src/generated/icons')
    }),
    VitePWA({
      includeAssets: [
        'favicon.svg',
        'favicon.ico',
        'robots.txt',
        'apple-touch-icon.png'
      ],
      manifest: {
        name: 'Vite Pokédex',
        short_name: 'Pokédex',
        description: 'Pokédex PWA made with Vite',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/assets/images/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/assets/images/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/assets/images/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    }),

    Pages({
      extensions: ['vue'],
      dirs: 'src/**/pages'
    }),

    vueI18n({
      include: path.resolve(__dirname, './src/locales/**'),
      compositionOnly: true
    }),

    Unocss({
      presets: [presetAttributify(), presetWind()],
      transformers: [transformerDirective()],
      safelist: ['[lt-sm~="-translate-x-full"]']
    }),

    Icons({
      customCollections: {
        pkmn: FileSystemIconLoader('./src/generated/icons', svg =>
          svg.replace(/^<svg /, '<svg fill="currentColor" ')
        )
      }
    }),

    Components({
      dts: 'src/typings/components.d.ts',
      dirs: ['./src/**/components'],
      directives: true,
      resolvers: [
        IconsResolver({
          customCollections: ['pkmn'],
          prefix: 'icon'
        })
      ]
    })
  ],
  resolve: {
    alias: {
      '@': `${__dirname}/src`
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['vitest.setup.ts']
  }
});
