// npm run images
import { mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC_DIR = 'src/assets/images-src';
const OUT_DIR = 'src/assets/images';
const WIDTHS = [400, 800];
const FORMATS = [
  { ext: 'avif', format: 'avif', options: { quality: 50 } },
  { ext: 'webp', format: 'webp', options: { quality: 75 } },
  { ext: 'jpg', format: 'jpeg', options: { quality: 80, mozjpeg: true } },
];

await mkdir(OUT_DIR, { recursive: true });

const sources = (await readdir(SRC_DIR)).filter((file) => /\.(jpe?g|png)$/i.test(file));
const totals = { original: 0, avif: 0, webp: 0, jpg: 0 };

for (const file of sources) {
  const name = path.parse(file).name;
  const input = path.join(SRC_DIR, file);
  totals.original += (await stat(input)).size;

  for (const width of WIDTHS) {
    const resized = sharp(input).resize({ width });

    for (const { ext, format, options } of FORMATS) {
      const output = path.join(OUT_DIR, `${name}-${width}.${ext}`);
      await resized.clone().toFormat(format, options).toFile(output);
      totals[ext] += (await stat(output)).size;
    }
  }

  console.log(`✔ ${file}`);
}

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;
console.log('\nРозмір усіх зображень (сума по всіх ширинах):');
console.log(`  оригінали (JPEG): ${kb(totals.original)}`);
console.log(`  AVIF: ${kb(totals.avif)}  |  WebP: ${kb(totals.webp)}  |  JPEG: ${kb(totals.jpg)}`);
