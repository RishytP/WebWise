/**
 * LOCAL UI PREVIEW ONLY — not part of the extension.
 *
 * Serves the built popup (`dist/`) in a normal browser tab and injects a tiny
 * stand-in for the handful of `chrome.*` APIs the popup talks to, so you can
 * look at and click through the real UI without loading the extension.
 *
 * The values it returns are clearly DEMO data (see DEMO_CONTEXT / DEMO_* below).
 * They are NOT a live inspection of anything. Real data comes only from the
 * extension's own service worker, which this shim replaces.
 *
 * Usage:
 *   npm run build
 *   node scripts/preview-server.mjs          # http://127.0.0.1:12000
 *   PREVIEW_PORT=3000 node scripts/preview-server.mjs
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = Number(process.env.PREVIEW_PORT ?? 12000);
const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');

if (!existsSync(join(DIST, 'index.html'))) {
  console.error(`[preview] No build found at ${DIST}. Run "npm run build" first.`);
  process.exit(1);
}

/* -- Clearly-labelled DEMO data (never a real inspection) ------------------ */

const DEMO_CONTEXT = {
  url: 'https://example.com/reading/cookies-explained',
  hostname: 'example.com',
  title: 'Cookies Explained (demo page)',
  favIconUrl: null,
};

const DEMO_COOKIES = {
  status: 'ok',
  hostname: 'example.com',
  cookies: [
    {
      name: 'session_id',
      domain: 'example.com',
      path: '/',
      secure: true,
      httpOnly: true,
      sameSite: 'lax',
      session: true,
      expirationDate: null,
      hostOnly: false,
      storeId: '0',
      party: 'first-party',
    },
    {
      name: 'theme',
      domain: 'example.com',
      path: '/',
      secure: true,
      httpOnly: false,
      sameSite: 'strict',
      session: false,
      expirationDate: Math.floor(Date.now() / 1000) + 604800,
      hostOnly: false,
      storeId: '0',
      party: 'first-party',
    },
    {
      name: 'ad_id',
      domain: '.ads-tracker.example',
      path: '/',
      secure: true,
      httpOnly: false,
      sameSite: 'none',
      session: false,
      expirationDate: Math.floor(Date.now() / 1000) + 2592000,
      hostOnly: false,
      storeId: '0',
      party: 'third-party',
    },
  ],
  summary: {
    total: 3,
    firstParty: 2,
    thirdParty: 1,
    session: 1,
    persistent: 2,
    secure: 3,
    httpOnly: 1,
    thirdPartyDomains: ['ads-tracker.example'],
  },
  insights: [
    {
      id: 'httpOnly',
      found: '1 cookie is marked HttpOnly.',
      meaning:
        'HttpOnly helps stop ordinary page scripts from reading a cookie — often used to protect login sessions.',
      action: 'Nothing you need to do. It is a normal, sensible setting for a login cookie.',
      tone: 'good',
    },
    {
      id: 'third-party',
      found: '1 cookie comes from a different company than this site.',
      meaning:
        'Third-party cookies are set by content embedded in the page, like a video player or advert. They are often used to measure or personalise what you see.',
      action: 'You can usually block third-party cookies in your browser settings if you want to.',
      tone: 'note',
    },
  ],
  limitations: [
    'Only cookies that apply to this page are shown — not every cookie in your browser.',
    'We can see a cookie’s settings, but not what the site actually uses it for.',
    'Cookie values are never read or displayed.',
  ],
};

const DEMO_PERMISSIONS = {
  status: 'ok',
  origin: 'https://example.com',
  hostname: 'example.com',
  findings: [
    {
      name: 'geolocation',
      label: 'Location',
      state: 'prompt',
      stateLabel: 'Ask first',
      whatItAllows: 'Lets the site find roughly where you are, using Wi-Fi and network clues.',
      whyAsk: 'A maps or weather site needs this to be useful.',
      stateMeaning:
        'This website may ask for your location, but this status alone does not tell us whether it has accessed your location.',
      evidence: { kind: 'observed', note: 'Read from the browser permission store for this page.' },
    },
    {
      name: 'notifications',
      label: 'Notifications',
      state: 'granted',
      stateLabel: 'Allowed',
      whatItAllows: 'Lets the site send you pop-up messages even when it is not open.',
      whyAsk: 'Some sites use it for reminders, but it is also a common way to send adverts.',
      stateMeaning:
        'This site is allowed to send notifications. That does not mean it has, or how often it will.',
      evidence: { kind: 'observed', note: 'Read from the browser permission store for this page.' },
    },
    {
      name: 'camera',
      label: 'Camera',
      state: 'denied',
      stateLabel: 'Blocked',
      whatItAllows: 'Lets the site see through your camera.',
      whyAsk: 'Video calls and photo uploads need this.',
      stateMeaning: 'This site is not allowed to use the camera. You blocked it, or it never asked.',
      evidence: { kind: 'observed', note: 'Read from the browser permission store for this page.' },
    },
    {
      name: 'microphone',
      label: 'Microphone',
      state: 'unsupported',
      stateLabel: 'Not available',
      whatItAllows: 'Lets the site hear through your microphone.',
      whyAsk: 'Voice chat and recording need this.',
      stateMeaning: 'The browser would not tell us this one, so we are not guessing.',
      evidence: { kind: 'unknown' },
    },
  ],
  limitations: [
    'A permission status shows what a site may use — not whether it actually has.',
    'Only some permissions can be checked at all; the rest show as not available.',
  ],
  message: 'The microphone check was not available on this page.',
};

/* -- Tiny chrome.* shim ---------------------------------------------------- */

const SHIM = `<script>
(function () {
  const ctx = ${JSON.stringify(DEMO_CONTEXT)};
  const cookies = ${JSON.stringify(DEMO_COOKIES)};
  const perms = ${JSON.stringify(DEMO_PERMISSIONS)};
  const noop = function () {};
  window.chrome = window.chrome || {};
  window.chrome.runtime = {
    lastError: undefined,
    sendMessage: function (msg, cb) {
      const respond = function (r) { if (typeof cb === 'function') cb(r); };
      setTimeout(function () {
        if (msg && msg.type === 'GET_COOKIE_REPORT') respond({ ok: true, cookieReport: cookies });
        else if (msg && msg.type === 'GET_PERMISSION_REPORT') respond({ ok: true, permissionReport: perms });
        else respond({ ok: false, error: 'preview shim: unknown request' });
      }, 220);
    },
  };
  window.chrome.tabs = {
    query: function () {
      return Promise.resolve([{ id: 1, url: ctx.url, title: ctx.title, favIconUrl: ctx.favIconUrl }]);
    },
  };
  window.__WE_WISE_PREVIEW__ = true;
})();
</script>`;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
};

const server = createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent((req.url ?? '/').split('?')[0]);
    let filePath = normalize(join(DIST, urlPath === '/' ? 'index.html' : urlPath));
    if (!filePath.startsWith(DIST)) {
      res.writeHead(403).end('Forbidden');
      return;
    }
    let body = await readFile(filePath);
    if (extname(filePath) === '.html') {
      body = Buffer.from(
        body.toString('utf8').replace('</head>', `${SHIM}</head>`),
        'utf8',
      );
    }
    res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[preview] WebWise UI preview (DEMO data) on http://127.0.0.1:${PORT}`);
});
