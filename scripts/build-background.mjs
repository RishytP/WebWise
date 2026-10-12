// Bundles the Manifest V3 service worker into a single self-contained file.
// Kept separate from Vite because the background script has no HTML entry
// point and must not be code-split.
import { build } from 'esbuild';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
mkdirSync(join(root, 'dist'), { recursive: true });

await build({
  entryPoints: [join(root, 'src', 'background', 'index.ts')],
  outfile: join(root, 'dist', 'background.js'),
  bundle: true,
  format: 'esm',
  target: 'chrome120',
  platform: 'browser',
  minify: false,
  sourcemap: false,
  logLevel: 'info',
});

console.log('WebWise background service worker bundled to dist/background.js');
