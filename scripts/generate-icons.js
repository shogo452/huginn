import sharp from 'sharp';
import { readFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const iconsDir = join(projectRoot, 'public', 'icons');
const svgPath = join(iconsDir, 'icon.svg');

// アイコンサイズ
const sizes = [192, 512];

async function generateIcons() {
  // SVGファイルを読み込み
  const svgBuffer = readFileSync(svgPath);

  for (const size of sizes) {
    const outputPath = join(iconsDir, `icon-${size}.png`);

    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);

    console.log(`Generated: icon-${size}.png`);
  }

  // favicon用の小さいサイズも生成
  const faviconPath = join(projectRoot, 'public', 'favicon.ico');
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(join(iconsDir, 'favicon-32.png'));
  console.log('Generated: favicon-32.png');

  console.log('All icons generated successfully!');
}

generateIcons().catch(console.error);
