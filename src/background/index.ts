import type {
  CookieRecord,
  CookieReport,
  PageContext,
  PermissionFinding,
  PermissionName,
  PermissionReport,
  PermissionState,
} from '../types';
import { buildPageContext } from '../utils/url';
import {
  buildCookieInsights,
  cookieLimitations,
  summariseCookies,
  toCookieRecord,
} from '../features/cookies/cookieLogic';
import {
  interpretPermission,
  permissionLimitations,
  sortFindings,
} from '../features/permissions/permissionLogic';
import { isWorkerRequest, type WorkerRequest } from '../services/messaging';

/**
 * WebWise background service worker.
 *
 * This is the only place in the extension that calls privileged Chrome APIs.
 * It never stores, logs or transmits anything: each request is answered from
 * live browser data and then discarded.
 */

/* -------------------------------------------------------------------------- */
/* Cookie inspection                                                          */
/* -------------------------------------------------------------------------- */

const EMPTY_SUMMARY = {
  total: 0,
  firstParty: 0,
  thirdParty: 0,
  session: 0,
  persistent: 0,
  secure: 0,
  httpOnly: 0,
  thirdPartyDomains: [] as string[],
};

export async function getCookieReport(context: PageContext): Promise<CookieReport> {
  if (context.kind !== 'web' || !context.url || !context.hostname) {
    return {
      status: 'unsupported',
      cookies: [],
      summary: EMPTY_SUMMARY,
      insights: [],
      limitations: cookieLimitations(),
      hostname: context.hostname,
      message: context.restrictionReason ?? 'Cookies cannot be inspected on this page.',
    };
  }

  try {
    const raw = await chrome.cookies.getAll({ url: context.url });
    const cookies: CookieRecord[] = raw.map((c) => toCookieRecord(c, context.hostname));
    const summary = summariseCookies(cookies);
    return {
      status: 'ok',
      cookies,
      summary,
      insights: buildCookieInsights(summary, context.hostname),
      limitations: cookieLimitations(),
      hostname: context.hostname,
    };
  } catch (e) {
    return {
      status: 'error',
      cookies: [],
      summary: EMPTY_SUMMARY,
      insights: [],
      limitations: cookieLimitations(),
      hostname: context.hostname,
      message: describeError(e, 'cookies'),
    };
  }
}

function describeError(e: unknown, what: string): string {
  const msg = e instanceof Error ? e.message : String(e);
  if (/permission/i.test(msg) || /denied/i.test(msg)) {
    return `WebWise was not allowed to read ${what} here. Check the extension’s permissions on the chrome://extensions page.`;
  }
  return `Something went wrong while reading ${what}: ${msg}`;
}

/* -------------------------------------------------------------------------- */
/* Permission inspection                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Permissions we attempt to check. These are the ones the Permissions API
 * exposes to a page context in current Chrome. Everything else is honestly
 * reported as unsupported rather than guessed.
 */
const CHECKABLE: PermissionName[] = [
  'geolocation',
  'camera',
  'microphone',
  'notifications',
  'clipboard-read',
  'midi',
];

/**
 * Injected into the inspected page via chrome.scripting.executeScript.
 *
 * IMPORTANT: Chrome serialises this function and runs it in the page. It must
 * be fully self-contained — no closures over outer variables, no imports.
 * It only reads `navigator.permissions` state strings and returns them.
 */
function runPermissionProbe(names: PermissionName[]): Promise<Record<string, string>> {
  return (async () => {
    const out: Record<string, string> = {};
    for (const name of names) {
      try {
        const query = (navigator as unknown as {
          permissions: { query(d: { name: string }): Promise<{ state: string }> };
        }).permissions.query({ name });
        const res = await query;
        out[name] = res && typeof res.state === 'string' ? res.state : 'unknown';
      } catch {
        out[name] = 'unsupported';
      }
    }
    return out;
  })();
}

export async function getPermissionReport(context: PageContext): Promise<PermissionReport> {
  const base = {
    origin: context.origin,
    hostname: context.hostname,
    limitations: permissionLimitations(),
  };

  if (context.kind !== 'web' || !context.url || !context.origin || context.tabId === undefined) {
    return {
      ...base,
      status: 'unsupported',
      findings: CHECKABLE.map((n) => interpretPermission(n, null, false)),
      message: context.restrictionReason ?? 'Permissions cannot be checked on this page.',
    };
  }

  const raw: Partial<Record<PermissionName, PermissionState>> = {};
  let injected = false;

  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId: context.tabId, allFrames: false },
      world: 'ISOLATED',
      func: runPermissionProbe,
      args: [CHECKABLE],
    });
    const first = results[0]?.result as Record<string, string> | undefined;
    if (first) {
      injected = true;
      for (const [k, v] of Object.entries(first)) {
        raw[k as PermissionName] = normaliseState(v);
      }
    }
  } catch {
    injected = false;
  }

  const findings: PermissionFinding[] = CHECKABLE.map((name) => {
    const value = raw[name];
    const supported = injected && value !== undefined && value !== 'unsupported';
    return interpretPermission(name, value ?? null, supported);
  });

  return {
    ...base,
    status: 'ok',
    findings: sortFindings(findings),
    message: injected
      ? undefined
      : 'WebWise could not run its permission check on this page (the browser blocked it, or the page is protected). Statuses below are shown as unavailable rather than guessed.',
  };
}

function normaliseState(value: string): PermissionState {
  if (value === 'granted' || value === 'denied' || value === 'prompt') return value;
  if (value === 'unsupported') return 'unsupported';
  return 'unknown';
}

/* -------------------------------------------------------------------------- */
/* Message wiring                                                             */
/* -------------------------------------------------------------------------- */

async function handleMessage(request: WorkerRequest): Promise<unknown> {
  // Re-derive the page context from the live tab rather than trusting the
  // popup's copy, which may be stale if the user switched tabs.
  let context: PageContext;
  try {
    const tab = await chrome.tabs.get(request.tabId);
    context = buildPageContext(tab.url ?? null, tab.title ?? null, tab.favIconUrl ?? null);
  } catch {
    context = buildPageContext(request.url, null, null);
  }
  context.tabId = request.tabId;

  if (request.type === 'GET_COOKIE_REPORT') {
    return { ok: true, cookieReport: await getCookieReport(context) };
  }
  return { ok: true, permissionReport: await getPermissionReport(context) };
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!isWorkerRequest(message)) {
    // Ignore anything that is not a well-formed WebWise request.
    return false;
  }
  handleMessage(message)
    .then(sendResponse)
    .catch((e: unknown) => {
      sendResponse({ ok: false, error: e instanceof Error ? e.message : String(e) });
    });
  return true; // keep the channel open for the async response
});
