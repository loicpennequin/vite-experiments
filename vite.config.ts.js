"use strict";

// vite.config.ts
import { defineConfig } from "vite";
import * as path2 from "path";
import vue from "@vitejs/plugin-vue";
import vitedgePlugin from "vitedge/plugin.js";
import Components from "unplugin-vue-components/vite";
import Icons from "unplugin-icons/vite";
import Unocss from "unocss/vite";
import presetWind from "@unocss/preset-wind";
import { presetAttributify } from "unocss";
import transformerDirective from "@unocss/transformer-directives";
import IconsResolver from "unplugin-icons/resolver";
import { FileSystemIconLoader } from "unplugin-icons/loaders";
import { vueI18n } from "@intlify/vite-plugin-vue-i18n";
import eslintPlugin from "vite-plugin-eslint";
import Pages from "vite-plugin-pages";
import { VitePWA } from "vite-plugin-pwa";

// scripts/vite-plugins/svg-sprite-map.ts
import glob from "glob-promise";
import fs from "fs-extra";
import path from "path";
import SvgSpriter from "svg-sprite";
import chokidar from "chokidar";
function generateSpriteMap({ filePaths, dest }) {
  const spriter = new SvgSpriter({
    dest,
    shape: {
      id: {
        generator: (_, file) => {
          return file.path.split("/").reverse()[0].replace(".svg", "");
        }
      }
    },
    mode: { symbol: true }
  });
  filePaths.forEach((filePath) => {
    spriter.add(filePath, null, fs.readFileSync(filePath, { encoding: "utf-8" }));
  });
  return new Promise((resolve2, reject) => {
    spriter.compile(function(error, result) {
      if (error)
        reject(error);
      resolve2(result.symbol.sprite.contents.toString());
    });
  });
}
function svg_sprite_map_default({
  src,
  spriteDest,
  linksDest
}) {
  const generate = async () => {
    const filePaths = await glob(src);
    const spriteMap = (await generateSpriteMap({
      filePaths,
      dest: spriteDest
    })).replace('<?xml version="1.0" encoding="utf-8"?>', "");
    const dest = path.join(process.cwd(), "public", spriteDest);
    const destDirectory = dest.split("/").reverse().slice(1, -1).reverse().join("/");
    fs.ensureFileSync(dest);
    fs.writeFileSync(dest, spriteMap);
    fs.ensureDirSync(linksDest);
    filePaths.forEach((filePath) => {
      const fileName = filePath.split("/").reverse()[0];
      const id = fileName.replace(".svg", "");
      fs.writeFileSync(path.join(linksDest, fileName), `<svg viewBox="0 0 100 100"><use xlink:href="${spriteDest}#${id}"></use></svg>`);
    });
  };
  return [
    {
      name: "vite-plugin-svg-sprite-map",
      enforce: "pre",
      async buildStart() {
        await generate();
      }
    },
    {
      name: "vite-plugin-svg-sprite-map:dev",
      enforce: "pre",
      apply: "serve",
      async buildStart() {
        const watcher = chokidar.watch(src, {
          ignored: /(^|[/\\])\../,
          persistent: true
        });
        watcher.on("change", generate).on("unlink", generate);
      }
    }
  ];
}

// vite.config.ts
import { createHtmlPlugin } from "vite-plugin-html";
var vite_config_default = defineConfig({
  plugins: [
    vitedgePlugin(),
    eslintPlugin(),
    vue(),
    createHtmlPlugin({
      minify: true
    }),
    svg_sprite_map_default({
      src: "./src/assets/icons/*.svg",
      spriteDest: "/assets/svg/svg-sprite-map.generated.svg",
      linksDest: path2.join(process.cwd(), "src/generated/icons")
    }),
    VitePWA({
      includeAssets: [
        "favicon.svg",
        "favicon.ico",
        "robots.txt",
        "apple-touch-icon.png"
      ],
      manifest: {
        name: "Vite Pok\xE9dex",
        short_name: "Pok\xE9dex",
        description: "Pok\xE9dex PWA made with Vite",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/assets/images/icon-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/assets/images/icon-512x512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "/assets/images/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ]
      }
    }),
    Pages({
      extensions: ["vue"],
      dirs: "src/**/pages"
    }),
    vueI18n({
      include: path2.resolve("/home/disruptual/projects/vite-experiments", "./src/locales/**"),
      compositionOnly: true
    }),
    Unocss({
      presets: [presetAttributify(), presetWind()],
      transformers: [transformerDirective()],
      safelist: ['[lt-sm~="-translate-x-full"]']
    }),
    Icons({
      customCollections: {
        pkmn: FileSystemIconLoader("./src/generated/icons", (svg) => svg.replace(/^<svg /, '<svg fill="currentColor" '))
      }
    }),
    Components({
      dts: "src/typings/components.d.ts",
      dirs: ["./src/**/components"],
      directives: true,
      resolvers: [
        IconsResolver({
          customCollections: ["pkmn"],
          prefix: "icon"
        })
      ]
    })
  ],
  resolve: {
    alias: {
      "@": `${"/home/disruptual/projects/vite-experiments"}/src`
    }
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["vitest.setup.ts"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic2NyaXB0cy92aXRlLXBsdWdpbnMvc3ZnLXNwcml0ZS1tYXAudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJztcbmltcG9ydCB2aXRlZGdlUGx1Z2luIGZyb20gJ3ZpdGVkZ2UvcGx1Z2luLmpzJztcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnO1xuaW1wb3J0IEljb25zIGZyb20gJ3VucGx1Z2luLWljb25zL3ZpdGUnO1xuaW1wb3J0IFVub2NzcyBmcm9tICd1bm9jc3Mvdml0ZSc7XG5pbXBvcnQgcHJlc2V0V2luZCBmcm9tICdAdW5vY3NzL3ByZXNldC13aW5kJztcbmltcG9ydCB7IHByZXNldEF0dHJpYnV0aWZ5IH0gZnJvbSAndW5vY3NzJztcbmltcG9ydCB0cmFuc2Zvcm1lckRpcmVjdGl2ZSBmcm9tICdAdW5vY3NzL3RyYW5zZm9ybWVyLWRpcmVjdGl2ZXMnO1xuaW1wb3J0IEljb25zUmVzb2x2ZXIgZnJvbSAndW5wbHVnaW4taWNvbnMvcmVzb2x2ZXInO1xuaW1wb3J0IHsgRmlsZVN5c3RlbUljb25Mb2FkZXIgfSBmcm9tICd1bnBsdWdpbi1pY29ucy9sb2FkZXJzJztcbmltcG9ydCB7IHZ1ZUkxOG4gfSBmcm9tICdAaW50bGlmeS92aXRlLXBsdWdpbi12dWUtaTE4bic7XG5pbXBvcnQgZXNsaW50UGx1Z2luIGZyb20gJ3ZpdGUtcGx1Z2luLWVzbGludCc7XG5pbXBvcnQgUGFnZXMgZnJvbSAndml0ZS1wbHVnaW4tcGFnZXMnO1xuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gJ3ZpdGUtcGx1Z2luLXB3YSc7XG5pbXBvcnQgR2VuZXJhdGVJY29ucyBmcm9tICcuL3NjcmlwdHMvdml0ZS1wbHVnaW5zL3N2Zy1zcHJpdGUtbWFwJztcbmltcG9ydCB7IGNyZWF0ZUh0bWxQbHVnaW4gfSBmcm9tICd2aXRlLXBsdWdpbi1odG1sJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHZpdGVkZ2VQbHVnaW4oKSxcbiAgICBlc2xpbnRQbHVnaW4oKSxcbiAgICB2dWUoKSxcbiAgICBjcmVhdGVIdG1sUGx1Z2luKHtcbiAgICAgIG1pbmlmeTogdHJ1ZVxuICAgIH0pLFxuICAgIEdlbmVyYXRlSWNvbnMoe1xuICAgICAgc3JjOiAnLi9zcmMvYXNzZXRzL2ljb25zLyouc3ZnJyxcbiAgICAgIHNwcml0ZURlc3Q6ICcvYXNzZXRzL3N2Zy9zdmctc3ByaXRlLW1hcC5nZW5lcmF0ZWQuc3ZnJyxcbiAgICAgIGxpbmtzRGVzdDogcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdzcmMvZ2VuZXJhdGVkL2ljb25zJylcbiAgICB9KSxcbiAgICBWaXRlUFdBKHtcbiAgICAgIGluY2x1ZGVBc3NldHM6IFtcbiAgICAgICAgJ2Zhdmljb24uc3ZnJyxcbiAgICAgICAgJ2Zhdmljb24uaWNvJyxcbiAgICAgICAgJ3JvYm90cy50eHQnLFxuICAgICAgICAnYXBwbGUtdG91Y2gtaWNvbi5wbmcnXG4gICAgICBdLFxuICAgICAgbWFuaWZlc3Q6IHtcbiAgICAgICAgbmFtZTogJ1ZpdGUgUG9rXHUwMEU5ZGV4JyxcbiAgICAgICAgc2hvcnRfbmFtZTogJ1Bva1x1MDBFOWRleCcsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnUG9rXHUwMEU5ZGV4IFBXQSBtYWRlIHdpdGggVml0ZScsXG4gICAgICAgIHRoZW1lX2NvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgIGljb25zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiAnL2Fzc2V0cy9pbWFnZXMvaWNvbi0xOTJ4MTkyLnBuZycsXG4gICAgICAgICAgICBzaXplczogJzE5MngxOTInLFxuICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZydcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogJy9hc3NldHMvaW1hZ2VzL2ljb24tNTEyeDUxMi5wbmcnLFxuICAgICAgICAgICAgc2l6ZXM6ICc1MTJ4NTEyJyxcbiAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6ICcvYXNzZXRzL2ltYWdlcy9pY29uLTUxMng1MTIucG5nJyxcbiAgICAgICAgICAgIHNpemVzOiAnNTEyeDUxMicsXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcbiAgICAgICAgICAgIHB1cnBvc2U6ICdhbnkgbWFza2FibGUnXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgfSksXG5cbiAgICBQYWdlcyh7XG4gICAgICBleHRlbnNpb25zOiBbJ3Z1ZSddLFxuICAgICAgZGlyczogJ3NyYy8qKi9wYWdlcydcbiAgICB9KSxcblxuICAgIHZ1ZUkxOG4oe1xuICAgICAgaW5jbHVkZTogcGF0aC5yZXNvbHZlKFwiL2hvbWUvZGlzcnVwdHVhbC9wcm9qZWN0cy92aXRlLWV4cGVyaW1lbnRzXCIsICcuL3NyYy9sb2NhbGVzLyoqJyksXG4gICAgICBjb21wb3NpdGlvbk9ubHk6IHRydWVcbiAgICB9KSxcblxuICAgIFVub2Nzcyh7XG4gICAgICBwcmVzZXRzOiBbcHJlc2V0QXR0cmlidXRpZnkoKSwgcHJlc2V0V2luZCgpXSxcbiAgICAgIHRyYW5zZm9ybWVyczogW3RyYW5zZm9ybWVyRGlyZWN0aXZlKCldLFxuICAgICAgc2FmZWxpc3Q6IFsnW2x0LXNtfj1cIi10cmFuc2xhdGUteC1mdWxsXCJdJ11cbiAgICB9KSxcblxuICAgIEljb25zKHtcbiAgICAgIGN1c3RvbUNvbGxlY3Rpb25zOiB7XG4gICAgICAgIHBrbW46IEZpbGVTeXN0ZW1JY29uTG9hZGVyKCcuL3NyYy9nZW5lcmF0ZWQvaWNvbnMnLCBzdmcgPT5cbiAgICAgICAgICBzdmcucmVwbGFjZSgvXjxzdmcgLywgJzxzdmcgZmlsbD1cImN1cnJlbnRDb2xvclwiICcpXG4gICAgICAgIClcbiAgICAgIH1cbiAgICB9KSxcblxuICAgIENvbXBvbmVudHMoe1xuICAgICAgZHRzOiAnc3JjL3R5cGluZ3MvY29tcG9uZW50cy5kLnRzJyxcbiAgICAgIGRpcnM6IFsnLi9zcmMvKiovY29tcG9uZW50cyddLFxuICAgICAgZGlyZWN0aXZlczogdHJ1ZSxcbiAgICAgIHJlc29sdmVyczogW1xuICAgICAgICBJY29uc1Jlc29sdmVyKHtcbiAgICAgICAgICBjdXN0b21Db2xsZWN0aW9uczogWydwa21uJ10sXG4gICAgICAgICAgcHJlZml4OiAnaWNvbidcbiAgICAgICAgfSlcbiAgICAgIF1cbiAgICB9KVxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogYCR7XCIvaG9tZS9kaXNydXB0dWFsL3Byb2plY3RzL3ZpdGUtZXhwZXJpbWVudHNcIn0vc3JjYFxuICAgIH1cbiAgfSxcbiAgdGVzdDoge1xuICAgIGdsb2JhbHM6IHRydWUsXG4gICAgZW52aXJvbm1lbnQ6ICdqc2RvbScsXG4gICAgc2V0dXBGaWxlczogWyd2aXRlc3Quc2V0dXAudHMnXVxuICB9XG59KTtcbiIsICJpbXBvcnQgeyBQbHVnaW4gfSBmcm9tICd2aXRlJztcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXRzLWNvbW1lbnRcbi8vIEB0cy1pZ25vcmVcbmltcG9ydCBnbG9iIGZyb20gJ2dsb2ItcHJvbWlzZSc7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10cy1jb21tZW50XG4vLyBAdHMtaWdub3JlXG5pbXBvcnQgZnMgZnJvbSAnZnMtZXh0cmEnO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9iYW4tdHMtY29tbWVudFxuLy8gQHRzLWlnbm9yZVxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgU3ZnU3ByaXRlciBmcm9tICdzdmctc3ByaXRlJztcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXRzLWNvbW1lbnRcbi8vIEB0cy1pZ25vcmVcbmltcG9ydCBjaG9raWRhciBmcm9tICdjaG9raWRhcic7XG5cbmV4cG9ydCB0eXBlIFBsdWdpbk9wdGlvbnMgPSB7XG4gIHNyYzogc3RyaW5nO1xuICBzcHJpdGVEZXN0OiBzdHJpbmc7XG4gIGxpbmtzRGVzdDogc3RyaW5nO1xufTtcblxudHlwZSBHZW5lcmF0ZVNwcml0ZU9wdGlvbnMgPSB7XG4gIGZpbGVQYXRoczogc3RyaW5nW107XG4gIGRlc3Q6IHN0cmluZztcbn07XG5cbmZ1bmN0aW9uIGdlbmVyYXRlU3ByaXRlTWFwKHsgZmlsZVBhdGhzLCBkZXN0IH06IEdlbmVyYXRlU3ByaXRlT3B0aW9ucykge1xuICBjb25zdCBzcHJpdGVyID0gbmV3IFN2Z1Nwcml0ZXIoe1xuICAgIGRlc3QsXG4gICAgc2hhcGU6IHtcbiAgICAgIGlkOiB7XG4gICAgICAgIGdlbmVyYXRvcjogKF8sIGZpbGUpID0+IHtcbiAgICAgICAgICByZXR1cm4gZmlsZS5wYXRoLnNwbGl0KCcvJykucmV2ZXJzZSgpWzBdLnJlcGxhY2UoJy5zdmcnLCAnJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIG1vZGU6IHsgc3ltYm9sOiB0cnVlIH1cbiAgfSk7XG4gIGZpbGVQYXRocy5mb3JFYWNoKGZpbGVQYXRoID0+IHtcbiAgICBzcHJpdGVyLmFkZChcbiAgICAgIGZpbGVQYXRoLFxuICAgICAgbnVsbCxcbiAgICAgIGZzLnJlYWRGaWxlU3luYyhmaWxlUGF0aCwgeyBlbmNvZGluZzogJ3V0Zi04JyB9KVxuICAgICk7XG4gIH0pO1xuXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgc3ByaXRlci5jb21waWxlKGZ1bmN0aW9uIChlcnJvciwgcmVzdWx0KSB7XG4gICAgICBpZiAoZXJyb3IpIHJlamVjdChlcnJvcik7XG5cbiAgICAgIHJlc29sdmUocmVzdWx0LnN5bWJvbC5zcHJpdGUuY29udGVudHMudG9TdHJpbmcoKSk7XG4gICAgfSk7XG4gIH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoe1xuICBzcmMsXG4gIHNwcml0ZURlc3QsXG4gIGxpbmtzRGVzdFxufTogUGx1Z2luT3B0aW9ucyk6IFBsdWdpbltdIHtcbiAgY29uc3QgZ2VuZXJhdGUgPSBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgZmlsZVBhdGhzID0gYXdhaXQgZ2xvYihzcmMpO1xuXG4gICAgY29uc3Qgc3ByaXRlTWFwID0gKFxuICAgICAgKGF3YWl0IGdlbmVyYXRlU3ByaXRlTWFwKHtcbiAgICAgICAgZmlsZVBhdGhzLFxuICAgICAgICBkZXN0OiBzcHJpdGVEZXN0XG4gICAgICB9KSkgYXMgc3RyaW5nXG4gICAgKS5yZXBsYWNlKCc8P3htbCB2ZXJzaW9uPVwiMS4wXCIgZW5jb2Rpbmc9XCJ1dGYtOFwiPz4nLCAnJyk7XG5cbiAgICBjb25zdCBkZXN0ID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdwdWJsaWMnLCBzcHJpdGVEZXN0KTtcbiAgICBjb25zdCBkZXN0RGlyZWN0b3J5ID0gZGVzdFxuICAgICAgLnNwbGl0KCcvJylcbiAgICAgIC5yZXZlcnNlKClcbiAgICAgIC5zbGljZSgxLCAtMSlcbiAgICAgIC5yZXZlcnNlKClcbiAgICAgIC5qb2luKCcvJyk7XG4gICAgZnMuZW5zdXJlRmlsZVN5bmMoZGVzdCk7XG4gICAgZnMud3JpdGVGaWxlU3luYyhkZXN0LCBzcHJpdGVNYXApO1xuXG4gICAgZnMuZW5zdXJlRGlyU3luYyhsaW5rc0Rlc3QpO1xuICAgIGZpbGVQYXRocy5mb3JFYWNoKGZpbGVQYXRoID0+IHtcbiAgICAgIGNvbnN0IGZpbGVOYW1lID0gZmlsZVBhdGguc3BsaXQoJy8nKS5yZXZlcnNlKClbMF07XG4gICAgICBjb25zdCBpZCA9IGZpbGVOYW1lLnJlcGxhY2UoJy5zdmcnLCAnJyk7XG4gICAgICBmcy53cml0ZUZpbGVTeW5jKFxuICAgICAgICBwYXRoLmpvaW4obGlua3NEZXN0LCBmaWxlTmFtZSksXG4gICAgICAgIGA8c3ZnIHZpZXdCb3g9XCIwIDAgMTAwIDEwMFwiPjx1c2UgeGxpbms6aHJlZj1cIiR7c3ByaXRlRGVzdH0jJHtpZH1cIj48L3VzZT48L3N2Zz5gXG4gICAgICApO1xuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBbXG4gICAge1xuICAgICAgbmFtZTogJ3ZpdGUtcGx1Z2luLXN2Zy1zcHJpdGUtbWFwJyxcbiAgICAgIGVuZm9yY2U6ICdwcmUnLFxuICAgICAgYXN5bmMgYnVpbGRTdGFydCgpIHtcbiAgICAgICAgYXdhaXQgZ2VuZXJhdGUoKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICd2aXRlLXBsdWdpbi1zdmctc3ByaXRlLW1hcDpkZXYnLFxuICAgICAgZW5mb3JjZTogJ3ByZScsXG4gICAgICBhcHBseTogJ3NlcnZlJyxcbiAgICAgIGFzeW5jIGJ1aWxkU3RhcnQoKSB7XG4gICAgICAgIGNvbnN0IHdhdGNoZXIgPSBjaG9raWRhci53YXRjaChzcmMsIHtcbiAgICAgICAgICBpZ25vcmVkOiAvKF58Wy9cXFxcXSlcXC4uLywgLy8gaWdub3JlIGRvdGZpbGVzXG4gICAgICAgICAgcGVyc2lzdGVudDogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICB3YXRjaGVyLm9uKCdjaGFuZ2UnLCBnZW5lcmF0ZSkub24oJ3VubGluaycsIGdlbmVyYXRlKTtcbiAgICAgIH1cbiAgICB9XG4gIF07XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDWkE7QUFHQTtBQUdBO0FBQ0E7QUFHQTtBQWFBLDJCQUEyQixFQUFFLFdBQVcsUUFBK0I7QUFDckUsUUFBTSxVQUFVLElBQUksV0FBVztBQUFBLElBQzdCO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTCxJQUFJO0FBQUEsUUFDRixXQUFXLENBQUMsR0FBRyxTQUFTO0FBQ3RCLGlCQUFPLEtBQUssS0FBSyxNQUFNLEdBQUcsRUFBRSxRQUFRLEVBQUUsR0FBRyxRQUFRLFFBQVEsRUFBRTtBQUFBLFFBQzdEO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLE1BQU0sRUFBRSxRQUFRLEtBQUs7QUFBQSxFQUN2QixDQUFDO0FBQ0QsWUFBVSxRQUFRLGNBQVk7QUFDNUIsWUFBUSxJQUNOLFVBQ0EsTUFDQSxHQUFHLGFBQWEsVUFBVSxFQUFFLFVBQVUsUUFBUSxDQUFDLENBQ2pEO0FBQUEsRUFDRixDQUFDO0FBRUQsU0FBTyxJQUFJLFFBQVEsQ0FBQyxVQUFTLFdBQVc7QUFDdEMsWUFBUSxRQUFRLFNBQVUsT0FBTyxRQUFRO0FBQ3ZDLFVBQUk7QUFBTyxlQUFPLEtBQUs7QUFFdkIsZUFBUSxPQUFPLE9BQU8sT0FBTyxTQUFTLFNBQVMsQ0FBQztBQUFBLElBQ2xELENBQUM7QUFBQSxFQUNILENBQUM7QUFDSDtBQUVlLGdDQUFVO0FBQUEsRUFDdkI7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEdBQzBCO0FBQzFCLFFBQU0sV0FBVyxZQUFZO0FBQzNCLFVBQU0sWUFBWSxNQUFNLEtBQUssR0FBRztBQUVoQyxVQUFNLFlBQ0gsT0FBTSxrQkFBa0I7QUFBQSxNQUN2QjtBQUFBLE1BQ0EsTUFBTTtBQUFBLElBQ1IsQ0FBQyxHQUNELFFBQVEsMENBQTBDLEVBQUU7QUFFdEQsVUFBTSxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksR0FBRyxVQUFVLFVBQVU7QUFDMUQsVUFBTSxnQkFBZ0IsS0FDbkIsTUFBTSxHQUFHLEVBQ1QsUUFBUSxFQUNSLE1BQU0sR0FBRyxFQUFFLEVBQ1gsUUFBUSxFQUNSLEtBQUssR0FBRztBQUNYLE9BQUcsZUFBZSxJQUFJO0FBQ3RCLE9BQUcsY0FBYyxNQUFNLFNBQVM7QUFFaEMsT0FBRyxjQUFjLFNBQVM7QUFDMUIsY0FBVSxRQUFRLGNBQVk7QUFDNUIsWUFBTSxXQUFXLFNBQVMsTUFBTSxHQUFHLEVBQUUsUUFBUSxFQUFFO0FBQy9DLFlBQU0sS0FBSyxTQUFTLFFBQVEsUUFBUSxFQUFFO0FBQ3RDLFNBQUcsY0FDRCxLQUFLLEtBQUssV0FBVyxRQUFRLEdBQzdCLCtDQUErQyxjQUFjLGtCQUMvRDtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFFQSxTQUFPO0FBQUEsSUFDTDtBQUFBLE1BQ0UsTUFBTTtBQUFBLE1BQ04sU0FBUztBQUFBLE1BQ1QsTUFBTSxhQUFhO0FBQ2pCLGNBQU0sU0FBUztBQUFBLE1BQ2pCO0FBQUEsSUFDRjtBQUFBLElBQ0E7QUFBQSxNQUNFLE1BQU07QUFBQSxNQUNOLFNBQVM7QUFBQSxNQUNULE9BQU87QUFBQSxNQUNQLE1BQU0sYUFBYTtBQUNqQixjQUFNLFVBQVUsU0FBUyxNQUFNLEtBQUs7QUFBQSxVQUNsQyxTQUFTO0FBQUEsVUFDVCxZQUFZO0FBQUEsUUFDZCxDQUFDO0FBRUQsZ0JBQVEsR0FBRyxVQUFVLFFBQVEsRUFBRSxHQUFHLFVBQVUsUUFBUTtBQUFBLE1BQ3REO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRjs7O0FEaEdBO0FBRUEsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsY0FBYztBQUFBLElBQ2QsYUFBYTtBQUFBLElBQ2IsSUFBSTtBQUFBLElBQ0osaUJBQWlCO0FBQUEsTUFDZixRQUFRO0FBQUEsSUFDVixDQUFDO0FBQUEsSUFDRCx1QkFBYztBQUFBLE1BQ1osS0FBSztBQUFBLE1BQ0wsWUFBWTtBQUFBLE1BQ1osV0FBVyxBQUFLLFdBQUssUUFBUSxJQUFJLEdBQUcscUJBQXFCO0FBQUEsSUFDM0QsQ0FBQztBQUFBLElBQ0QsUUFBUTtBQUFBLE1BQ04sZUFBZTtBQUFBLFFBQ2I7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsTUFDQSxVQUFVO0FBQUEsUUFDUixNQUFNO0FBQUEsUUFDTixZQUFZO0FBQUEsUUFDWixhQUFhO0FBQUEsUUFDYixhQUFhO0FBQUEsUUFDYixPQUFPO0FBQUEsVUFDTDtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFlBQ1AsTUFBTTtBQUFBLFVBQ1I7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxNQUFNO0FBQUEsVUFDUjtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxZQUNOLFNBQVM7QUFBQSxVQUNYO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUVELE1BQU07QUFBQSxNQUNKLFlBQVksQ0FBQyxLQUFLO0FBQUEsTUFDbEIsTUFBTTtBQUFBLElBQ1IsQ0FBQztBQUFBLElBRUQsUUFBUTtBQUFBLE1BQ04sU0FBUyxBQUFLLGNBQVEsOENBQThDLGtCQUFrQjtBQUFBLE1BQ3RGLGlCQUFpQjtBQUFBLElBQ25CLENBQUM7QUFBQSxJQUVELE9BQU87QUFBQSxNQUNMLFNBQVMsQ0FBQyxrQkFBa0IsR0FBRyxXQUFXLENBQUM7QUFBQSxNQUMzQyxjQUFjLENBQUMscUJBQXFCLENBQUM7QUFBQSxNQUNyQyxVQUFVLENBQUMsOEJBQThCO0FBQUEsSUFDM0MsQ0FBQztBQUFBLElBRUQsTUFBTTtBQUFBLE1BQ0osbUJBQW1CO0FBQUEsUUFDakIsTUFBTSxxQkFBcUIseUJBQXlCLFNBQ2xELElBQUksUUFBUSxVQUFVLDJCQUEyQixDQUNuRDtBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUVELFdBQVc7QUFBQSxNQUNULEtBQUs7QUFBQSxNQUNMLE1BQU0sQ0FBQyxxQkFBcUI7QUFBQSxNQUM1QixZQUFZO0FBQUEsTUFDWixXQUFXO0FBQUEsUUFDVCxjQUFjO0FBQUEsVUFDWixtQkFBbUIsQ0FBQyxNQUFNO0FBQUEsVUFDMUIsUUFBUTtBQUFBLFFBQ1YsQ0FBQztBQUFBLE1BQ0g7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEdBQUc7QUFBQSxJQUNWO0FBQUEsRUFDRjtBQUFBLEVBQ0EsTUFBTTtBQUFBLElBQ0osU0FBUztBQUFBLElBQ1QsYUFBYTtBQUFBLElBQ2IsWUFBWSxDQUFDLGlCQUFpQjtBQUFBLEVBQ2hDO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
