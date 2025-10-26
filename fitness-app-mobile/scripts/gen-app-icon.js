const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

(async () => {
  try {
    const root = path.resolve(__dirname, '..');
    const srcSvg = path.resolve(__dirname, '..', '..', 'fitness-app', 'build', 'layer-group-solid.svg');
    const outDir = path.resolve(root, 'assets', 'images');

    if (!fs.existsSync(srcSvg)) {
      throw new Error(`Source SVG not found at ${srcSvg}`);
    }

    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const svgContent = fs.readFileSync(srcSvg, 'utf-8');

  // Extract viewBox and path from the source SVG
  const viewBoxMatch = svgContent.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 576 512';
  const pathMatch = svgContent.match(/<path[^>]*\/>/);
  if (!pathMatch) throw new Error('Could not find <path /> element in source SVG');
  const pathTag = pathMatch[0].replace('<path ', '<path fill="url(#grad)" ');

    // Helper to render the gradient-filled stack icon at a given size (vertical gradient)
    const RECIPE_HEX = '#f59e0b'; // orange
    const EXERCISE_HEX = '#e285f4'; // purple
    const renderIcon = async (size) => {
      const gSvg = `<?xml version="1.0" encoding="UTF-8"?>
      <svg width="${size}" height="${size}" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="${RECIPE_HEX}"/>
            <stop offset="100%" stop-color="${EXERCISE_HEX}"/>
          </linearGradient>
        </defs>
        ${pathTag}
      </svg>`;
      const buf = Buffer.from(gSvg);
      return await sharp(buf)
        .toFormat('png')
        .toBuffer();
    };

    // App icon 1024x1024 with solid rounded-square background and gradient stack
    const ICON_SIZE = 1024;
    const ICON_INNER = Math.round(ICON_SIZE * 0.6); // 60% of canvas
    const BG_COLOR = '#0f172a'; // slate-900
    const radius = 200;

    // Create rounded-rect solid background via SVG so edges are smooth
    const bgSvg = `<?xml version="1.0" encoding="UTF-8"?>
    <svg width="${ICON_SIZE}" height="${ICON_SIZE}" viewBox="0 0 ${ICON_SIZE} ${ICON_SIZE}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${ICON_SIZE}" height="${ICON_SIZE}" rx="${radius}" ry="${radius}" fill="${BG_COLOR}" />
    </svg>`;

    const base = await sharp(Buffer.from(bgSvg))
      .toFormat('png')
      .toBuffer();

    const whiteIcon = await renderIcon(ICON_INNER);
    const offset = Math.round((ICON_SIZE - ICON_INNER) / 2);

    const appIcon = await sharp(base)
      .composite([{ input: whiteIcon, top: offset, left: offset }])
      .png()
      .toBuffer();

    const appIconPath = path.resolve(outDir, 'app-icon.png');
    fs.writeFileSync(appIconPath, appIcon);

  // Android adaptive icon pieces (foreground gradient + background solid)
    const ANDR_SIZE = 432; // typical adaptive size
    const FG_INNER = Math.round(ANDR_SIZE * 0.66);
    const fgIcon = await renderIcon(FG_INNER);
    const fgOffset = Math.round((ANDR_SIZE - FG_INNER) / 2);

    const transparentBase = await sharp({ create: { width: ANDR_SIZE, height: ANDR_SIZE, channels: 4, background: { r:0, g:0, b:0, alpha:0 } } })
      .png()
      .toBuffer();

    const androidForeground = await sharp(transparentBase)
      .composite([{ input: fgIcon, top: fgOffset, left: fgOffset }])
      .png()
      .toBuffer();

    // Background as solid color (no rounded corners for adaptive)
    const androidBackground = await sharp({ create: { width: ANDR_SIZE, height: ANDR_SIZE, channels: 4, background: BG_COLOR } })
      .png()
      .toBuffer();

    const androidMonochrome = androidForeground; // white symbol on transparent

    fs.writeFileSync(path.resolve(outDir, 'android-icon-foreground.png'), androidForeground);
    fs.writeFileSync(path.resolve(outDir, 'android-icon-background.png'), androidBackground);
    fs.writeFileSync(path.resolve(outDir, 'android-icon-monochrome.png'), androidMonochrome);

    console.log('Generated app and android adaptive icons.');
  } catch (e) {
    console.error('Failed to generate icons:', e);
    process.exit(1);
  }
})();
