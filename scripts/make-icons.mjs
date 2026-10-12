// Generates the WebWise shield icons as real PNG files with no external
// dependencies (Node's built-in zlib is enough to write a valid PNG).
//
// The shield is drawn by signed-distance-field rasterisation so it stays crisp
// at 16px and 128px without shipping an image library.
//
// Run: `npm run icons`
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'icons');
const SIZES = [16, 32, 48, 128];

/** Signed distance to a rounded rectangle centred on (0,0). */
function sdRoundRect(px, py, halfW, halfH, radius) {
  const qx = Math.abs(px) - (halfW - radius);
  const qy = Math.abs(py) - (halfH - radius);
  const outside = Math.hypot(Math.max(qx, 0), Math.max(qy, 0));
  return outside + Math.min(Math.max(qx, qy), 0) - radius;
}

/**
 * Signed distance to the WebWise shield outline in a normalised space where
 * the shield spans roughly x in [-0.42, 0.42] and y in [-0.5, 0.5].
 * Negative values are inside the shield.
 */
function sdShield(x, y) {
  const cx = 0.0;
  const top = -0.42;
  const bottom = 0.46;
  const halfW = 0.4;

  // Distance to the vertical sides (between the top corners and the taper).
  const sideDist = Math.abs(x - cx) - halfW;

  // The bottom tapers to a point, like a classic heraldic shield.
  const taper = Math.max(0, y - 0.06) / (bottom - 0.06);
  const taperHalfW = halfW * (1 - taper);
  const taperedSide = Math.abs(x - cx) - taperHalfW;

  // Vertical extent.
  const vertDist = Math.max(top - y, y - bottom);

  // Blend: use the taper only below the shoulder line.
  const effectiveSide = y > 0.06 ? taperedSide : sideDist;

  // Rounded bottom tip so 16px icons stay readable.
  const tip = sdRoundRect(x - cx, y - 0.36, taperHalfW * 0.6 + 0.02, 0.14, 0.06);

  const d = Math.max(effectiveSide, vertDist);
  return y > 0.3 ? Math.min(d, tip) : d;
}

/** Signed distance to a filled check-mark stroke (two capsules). */
function sdCheck(x, y) {
  const a = capsule(x, y, -0.2, 0.02, -0.03, 0.17, 0.062);
  const b = capsule(x, y, -0.03, 0.17, 0.24, -0.19, 0.062);
  return Math.min(a, b);
}

function capsule(px, py, ax, ay, bx, by, r) {
  const pax = px - ax;
  const pay = py - ay;
  const bax = bx - ax;
  const bay = by - ay;
  const h = Math.min(1, Math.max(0, (pax * bax + pay * bay) / (bax * bax + bay * bay)));
  return Math.hypot(pax - bax * h, pay - bay * h) - r;
}

function mix(a, b, t) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

/** Cover an anti-aliased shape given a signed distance (negative = inside). */
function coverage(d, aa) {
  return Math.min(1, Math.max(0, 0.5 - d / aa));
}

function renderIcon(size) {
  const SS = 4; // supersample factor
  const N = size * SS;
  const px = new Float32Array(N * N * 4);

  const bgA = [18, 42, 74];
  const bgB = [10, 24, 44];
  const white = [255, 255, 255];

  const aa = 2 / N; // distance in normalised units per pixel edge

  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      const x = (i + 0.5) / N - 0.5;
      const y = (j + 0.5) / N - 0.5;

      const tileD = sdRoundRect(x, y, 0.5, 0.5, size <= 20 ? 0.16 : 0.22);
      const tileCov = coverage(tileD, aa);
      if (tileCov <= 0) continue;

      const bgT = y + 0.5;
      let rgb = mix(bgA, bgB, bgT);

      const shieldD = sdShield(x, y);
      const shieldCov = coverage(shieldD, aa);
      if (shieldCov > 0) {
        const st = y + 0.5;
        const shieldColor = mix([26, 176, 176], [14, 120, 140], st);
        rgb = mix(rgb, shieldColor, shieldCov);
      }

      const checkD = sdCheck(x, y);
      const checkCov = coverage(checkD, aa);
      if (checkCov > 0) {
        rgb = mix(rgb, white, checkCov * Math.min(1, shieldCov + 0.15));
      }

      const o = (j * N + i) * 4;
      px[o] = rgb[0];
      px[o + 1] = rgb[1];
      px[o + 2] = rgb[2];
      px[o + 3] = 255 * tileCov;
    }
  }

  // Downsample (box filter) to the target size.
  const out = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const o = ((y * SS + sy) * N + (x * SS + sx)) * 4;
          r += px[o];
          g += px[o + 1];
          b += px[o + 2];
          a += px[o + 3];
        }
      }
      const n = SS * SS;
      const o = (y * size + x) * 4;
      out[o] = Math.round(r / n);
      out[o + 1] = Math.round(g / n);
      out[o + 2] = Math.round(b / n);
      out[o + 3] = Math.round(a / n);
    }
  }
  return out;
}

function encodePng(width, height, rgba) {
  const bytes = [];
  const push = (...b) => bytes.push(...b);

  push(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // colour type: RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  pushChunk(push, 'IHDR', ihdr);

  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0;
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  pushChunk(push, 'IDAT', deflateSync(raw, { level: 9 }));

  pushChunk(push, 'IEND', Buffer.alloc(0));

  return Buffer.from(bytes);
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function pushChunk(push, type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  push(...len, ...typeBuf, ...data, ...crcBuf);
}

mkdirSync(OUT_DIR, { recursive: true });
for (const size of SIZES) {
  const rgba = renderIcon(size);
  const png = encodePng(size, size, rgba);
  const file = join(OUT_DIR, `icon${size}.png`);
  writeFileSync(file, png);
  console.log(`wrote ${file} (${png.length} bytes)`);
}
console.log('WebWise icons generated.');
