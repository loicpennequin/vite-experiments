import { Plugin } from 'vite';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import glob from 'glob-promise';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import fs from 'fs-extra';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import path from 'path';
import SvgSpriter from 'svg-sprite';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import chokidar from 'chokidar';

export type PluginOptions = {
  src: string;
  spriteDest: string;
  linksDest: string;
};

type GenerateSpriteOptions = {
  filePaths: string[];
  dest: string;
};

function generateSpriteMap({ filePaths, dest }: GenerateSpriteOptions) {
  const spriter = new SvgSpriter({
    dest,
    shape: {
      id: {
        generator: (_, file) => {
          return file.path.split('/').reverse()[0].replace('.svg', '');
        }
      }
    },
    mode: { symbol: true }
  });
  filePaths.forEach(filePath => {
    spriter.add(
      filePath,
      null,
      fs.readFileSync(filePath, { encoding: 'utf-8' })
    );
  });

  return new Promise((resolve, reject) => {
    spriter.compile(function (error, result) {
      if (error) reject(error);

      resolve(result.symbol.sprite.contents.toString());
    });
  });
}

export default function ({
  src,
  spriteDest,
  linksDest
}: PluginOptions): Plugin[] {
  const generate = async () => {
    const filePaths = await glob(src);

    const spriteMap = (
      (await generateSpriteMap({
        filePaths,
        dest: spriteDest
      })) as string
    ).replace('<?xml version="1.0" encoding="utf-8"?>', '');

    const dest = path.join(process.cwd(), 'public', spriteDest);
    fs.ensureDirSync(dest);
    fs.writeFileSync(dest, spriteMap);

    fs.ensureDirSync(linksDest);
    filePaths.forEach(filePath => {
      const fileName = filePath.split('/').reverse()[0];
      const id = fileName.replace('.svg', '');
      fs.writeFileSync(
        path.join(linksDest, fileName),
        `<svg viewBox="0 0 100 100"><use xlink:href="${spriteDest}#${id}"></use></svg>`
      );
    });
  };

  return [
    {
      name: 'vite-plugin-svg-sprite-map',
      enforce: 'pre',
      async buildStart() {
        await generate();
      }
    },
    {
      name: 'vite-plugin-svg-sprite-map:dev',
      enforce: 'pre',
      apply: 'serve',
      async buildStart() {
        const watcher = chokidar.watch(src, {
          ignored: /(^|[/\\])\../, // ignore dotfiles
          persistent: true
        });

        watcher.on('change', generate).on('unlink', generate);
      }
    }
  ];
}
