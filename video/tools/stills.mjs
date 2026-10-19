// Render many stills in one browser session: node tools/stills.mjs 150 230 400 ...
// Frames can also be given as seconds with an "s" suffix (e.g. 12.5s).
import { bundle } from '@remotion/bundler';
import { openBrowser, renderStill, selectComposition } from '@remotion/renderer';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);
const frames = args.map((a) => (a.endsWith('s') ? Math.round(parseFloat(a) * 30) : parseInt(a, 10)));

const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts') });
const browser = await openBrowser('chrome', { chromiumOptions: { gl: 'angle' } });
const composition = await selectComposition({ serveUrl, id: 'Kov4Explainer', puppeteerInstance: browser });
for (const frame of frames) {
  const output = path.join(root, 'out/stills', `f${String(frame).padStart(4, '0')}.png`);
  await renderStill({ composition, serveUrl, frame, output, puppeteerInstance: browser, chromiumOptions: { gl: 'angle' } });
  console.log('rendered', frame, output);
}
await browser.close({ silent: true });
