/**
 * REAL browser integration check (not a unit test).
 *
 * Starts a tiny HTTP server that sets two cookies, loads the built WebWise
 * extension into headless Chromium, then talks to the extension's service
 * worker over the DevTools Protocol and calls the real `chrome.cookies` API.
 * This proves the extension installs, the service worker runs, and cookie
 * metadata is genuinely readable.
 *
 * Run: node scripts/integration-check.mjs   (after `npm run build`)
 */
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = 8791;
const DEBUG_PORT = 9333;
// Load THIS repo's build, resolved relative to the script, so the check always
// exercises the current working tree rather than some other copy on disk.
const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');

const server = createServer((req, res) => {
  res.setHeader('Set-Cookie', [
    'ww_session=abc123; Path=/; HttpOnly; SameSite=Lax',
    'ww_theme=dark; Path=/; Max-Age=86400; SameSite=Strict',
  ]);
  res.setHeader('Content-Type', 'text/html');
  res.end('<!doctype html><title>WebWise test page</title><h1>Integration test</h1>');
});

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function tryJson(path) {
  try {
    const res = await fetch(`http://127.0.0.1:${DEBUG_PORT}${path}`);
    if (res.ok) return await res.json();
  } catch {
    /* not up yet */
  }
  return null;
}

async function waitForServiceWorker() {
  for (let i = 0; i < 60; i++) {
    const list = await tryJson('/json/list');
    const sw = list?.find((t) => t.type === 'service_worker' && t.url.includes('background.js'));
    if (sw?.webSocketDebuggerUrl) return sw;
    await wait(300);
  }
  return null;
}

function makeSender(ws) {
  let id = 0;
  const pending = new Map();
  ws.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(JSON.stringify(msg.error)));
      else resolve(msg.result);
    }
  });
  return (method, params = {}) =>
    new Promise((resolve, reject) => {
      const msgId = ++id;
      pending.set(msgId, { resolve, reject });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
}

const profile = mkdtempSync(join(tmpdir(), 'webwise-it-'));
let chromium;
let exitCode = 0;

try {
  await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));
  console.log(`[it] test server listening on http://127.0.0.1:${PORT}`);

  chromium = spawn('chromium', [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    `--user-data-dir=${profile}`,
    `--load-extension=${DIST}`,
    `--remote-debugging-port=${DEBUG_PORT}`,
    '--remote-allow-origins=*',
    `http://127.0.0.1:${PORT}/`,
  ], { stdio: 'ignore' });

  const sw = await waitForServiceWorker();
  if (!sw) throw new Error('WebWise service worker target was not found');
  console.log(`[it] service worker live at ${sw.url}`);
  console.log(`[it] extension id: ${new URL(sw.url).host}`);

  const ws = new WebSocket(sw.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve);
    ws.addEventListener('error', reject);
  });
  const send = makeSender(ws);
  await send('Runtime.enable');

  // Call the real chrome.cookies API from inside the extension's own context.
  const { result } = await send('Runtime.evaluate', {
    expression: `chrome.cookies.getAll({ url: 'http://127.0.0.1:${PORT}/' }).then(cs => cs.map(c => ({ name: c.name, domain: c.domain, httpOnly: c.httpOnly, secure: c.secure, sameSite: c.sameSite, session: c.session })))`,
    awaitPromise: true,
    returnByValue: true,
  });

  const cookies = result.value ?? [];
  console.log(`[it] chrome.cookies.getAll returned ${cookies.length} cookie(s)`);
  for (const c of cookies) {
    console.log(
      `[it]   - ${c.name} domain=${c.domain} httpOnly=${c.httpOnly} secure=${c.secure} sameSite=${c.sameSite} session=${c.session}`,
    );
  }

  if (cookies.length < 2) throw new Error('Expected at least two cookies from the test page');
  const session = cookies.find((c) => c.name === 'ww_session');
  const theme = cookies.find((c) => c.name === 'ww_theme');
  if (!session?.httpOnly) throw new Error('ww_session should be reported as HttpOnly');
  if (theme?.session !== false) throw new Error('ww_theme has Max-Age and should not be a session cookie');

  // Exercise the real scripting path: find the tab and query a permission from
  // inside the page, exactly as the Permission Guide does.
  const probe = await send('Runtime.evaluate', {
    expression: `(async () => {
      const tabs = await chrome.tabs.query({});
      const t = tabs.find(x => x.url && x.url.includes('${PORT}'));
      if (!t) return { error: 'test tab not found' };
      const res = await chrome.scripting.executeScript({
        target: { tabId: t.id },
        world: 'ISOLATED',
        func: () => navigator.permissions.query({ name: 'geolocation' }).then(r => r.state).catch(() => 'unsupported'),
      });
      return { tabId: t.id, state: res[0].result };
    })()`,
    awaitPromise: true,
    returnByValue: true,
  });
  console.log(`[it] scripting probe result: ${JSON.stringify(probe.result.value)}`);
  if (!probe.result.value?.state) throw new Error('scripting.executeScript did not return a permission state');
  console.log('[it] PASS: real scripting path returned a live permission state');

  console.log('[it] PASS: extension installed, worker running, real cookie metadata read');
  ws.close();

  // ---- Render the popup itself and check the UI mounts cleanly --------------
  const extensionId = new URL(sw.url).host;
  const popupUrl = `chrome-extension://${extensionId}/index.html`;
  const popup = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/new?${encodeURIComponent(popupUrl)}`, {
    method: 'PUT',
  }).then((r) => r.json());

  const pws = new WebSocket(popup.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    pws.addEventListener('open', resolve);
    pws.addEventListener('error', reject);
  });
  const psend = makeSender(pws);
  const consoleErrors = [];
  pws.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Runtime.exceptionThrown') {
      consoleErrors.push(msg.params?.exceptionDetails?.text ?? 'exception');
    }
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params?.type === 'error') {
      consoleErrors.push((msg.params.args ?? []).map((a) => a.value ?? a.description).join(' '));
    }
  });
  await psend('Runtime.enable');
  await wait(1500);

  const { result: dom } = await psend('Runtime.evaluate', {
    expression: `document.body.innerText`,
    returnByValue: true,
  });
  const text = String(dom.value ?? '');
  console.log(`[it] popup rendered ${text.length} chars of text`);
  console.log('[it] ---- rendered popup text ----');
  console.log(text.split('\n').map((l) => `[it]   ${l}`).join('\n'));
  console.log('[it] ------------------------------');
  console.log(`[it] popup header present: ${text.includes('WebWise')}`);
  console.log(`[it] popup tagline present: ${text.includes('Browse with confidence')}`);
  console.log(`[it] popup console errors: ${consoleErrors.length === 0 ? 'none' : consoleErrors.join(' | ')}`);

  if (!text.includes('WebWise')) throw new Error('Popup did not render the WebWise header');
  if (consoleErrors.length > 0) throw new Error(`Popup produced console errors: ${consoleErrors.join(' | ')}`);
  console.log('[it] PASS: popup UI mounted with no console errors');

  // The popup must keep a real width even when Chrome's initial popup viewport
  // is tiny. Shrink the viewport and confirm #root does not collapse to a rod.
  await psend('Emulation.setDeviceMetricsOverride', {
    width: 60,
    height: 60,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await wait(300);
  const { result: box } = await psend('Runtime.evaluate', {
    expression: `(() => { const r = document.getElementById('root').getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height) }; })()`,
    returnByValue: true,
  });
  const w = box.value?.w ?? 0;
  console.log(`[it] popup #root size at a 60px viewport: ${w}x${box.value?.h}`);
  if (w < 320) throw new Error(`Popup collapsed to a thin rod (width ${w}px)`);
  console.log('[it] PASS: popup keeps a usable width when the viewport is narrow');

  // ---- Opt-in Coach progress memory ---------------------------------------
  await psend('Emulation.clearDeviceMetricsOverride');
  const coachEval = (expression) =>
    psend('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }).then((r) => r.result?.value);
  await coachEval(`[...document.querySelectorAll('.ww-nav__item')].find(x=>/coach/i.test(x.textContent||''))?.click()`);
  await wait(700);
  const initialSwitch = await coachEval(
    `document.querySelector('.ww-switch')?.classList.contains('ww-switch--on')`,
  );
  if (initialSwitch !== false) throw new Error('Progress memory should be off by default');

  await coachEval(`document.querySelector('.ww-switch')?.click()`);
  await wait(400);
  await coachEval(`document.querySelector('.ww-answer')?.click()`);
  await wait(400);
  const storedProgress = await coachEval(
    `chrome.storage.local.get('coachProgress').then(r => r.coachProgress ? r.coachProgress.scenarioIds.length : null)`,
  );
  console.log(`[it] coach progress saved to chrome.storage.local: ${storedProgress} scenario(s)`);
  if (!storedProgress) throw new Error('Opting in did not save progress to chrome.storage.local');

  await psend('Page.reload');
  await wait(1800);
  await coachEval(`[...document.querySelectorAll('.ww-nav__item')].find(x=>/coach/i.test(x.textContent||''))?.click()`);
  await wait(700);
  const restored = await coachEval(`/Picked up where you left off/.test(document.body.innerText)`);
  console.log(`[it] progress restored after popup reload: ${restored}`);
  if (!restored) throw new Error('Saved Coach progress was not restored after reload');

  await coachEval(`document.querySelector('.ww-switch')?.click()`);
  await wait(400);
  const afterOff = await coachEval(
    `chrome.storage.local.get(['coachProgress','coachProgressOptIn']).then(r => ({ p: r.coachProgress ?? null, o: r.coachProgressOptIn ?? null }))`,
  );
  if (afterOff?.p !== null || afterOff?.o !== null) throw new Error('Turning the toggle off did not forget saved progress');
  console.log('[it] PASS: opt-in progress memory saves, restores and forgets correctly');

  pws.close();
} catch (e) {
  console.error('[it] FAIL:', e.message);
  exitCode = 1;
} finally {
  chromium?.kill('SIGKILL');
  server.close();
  try {
    rmSync(profile, { recursive: true, force: true });
  } catch {
    /* best effort */
  }
}

process.exit(exitCode);
