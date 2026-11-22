import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import vituum from 'vituum';
import pug from '@vituum/vite-plugin-pug';

// Пояснення:
// 1) base '/landing-keepsake-vite/' потрібен лише для збірки й preview (GitHub Pages);
//    у dev-режимі base = '/', інакше dev-сервер не відкриває сторінку.
// 2) Плагін bundle-picture-srcset: Vite не бачить зображень у srcset, які згенерував Pug,
//    тому ми самі додаємо їх у dist/assets і підставляємо хешовані шляхи.
//    Також перейменовуємо index.pug.html -> index.html.
export default defineConfig(({ command, isPreview }) => {
  const base = command === 'build' || isPreview ? '/landing-keepsake-vite/' : '/';

  return {
    base,
    preview: { host: true },
    plugins: [
      vituum({
        imports: { paths: [] },
        pages: { dir: './src/pages', root: './src', normalizeBasePath: true },
      }),
      pug({ root: './src' }),
      {
        name: 'bundle-picture-srcset',
        enforce: 'post',
        generateBundle(_, bundle) {
          for (const file of Object.values(bundle)) {
            if (file.fileName.endsWith('.pug.html')) {
              file.fileName = file.fileName.replace(/\.pug\.html$/, '.html');
            }

            if (file.fileName.endsWith('.html') && typeof file.source === 'string') {
              file.source = file.source.replace(
                /\/src\/assets\/images\/([a-zA-Z0-9._-]+)/g,
                (match, imgName) => {
                  const fullPath = path.resolve('src/assets/images', imgName);
                  if (!fs.existsSync(fullPath)) return match;

                  const refId = this.emitFile({
                    type: 'asset',
                    name: imgName,
                    source: fs.readFileSync(fullPath),
                  });
                  return `${base}${this.getFileName(refId)}`;
                },
              );
            }
          }
        },
      },
    ],
  };
});
