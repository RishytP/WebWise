import type { PageContext, PageKind } from '../types';

/** Schemes Chrome will not let extensions inspect with content scripts. */
const INTERNAL_SCHEMES = new Set(['chrome', 'chrome-extension', 'edge', 'about', 'devtools', 'view-source']);
const FILE_SCHEMES = new Set(['file']);

export interface ParsedUrl {
  ok: boolean;
  scheme: string;
  hostname: string | null;
  origin: string | null;
  isIpAddress: boolean;
  isHttps: boolean;
}

const IPV4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;

export function isIpv4(host: string): boolean {
  const m = IPV4.exec(host);
  if (!m) return false;
  return m.slice(1).every((part) => {
    const n = Number(part);
    return n >= 0 && n <= 255 && String(n) === part.replace(/^0+(?=\d)/, '');
  });
}

/** Returns true for IPv4 or a bracketed IPv6 host. */
export function isIpAddressHost(host: string): boolean {
  if (!host) return false;
  if (host.startsWith('[') && host.endsWith(']')) return true; // IPv6
  return isIpv4(host);
}

export function parseUrl(raw: string | null | undefined): ParsedUrl {
  if (!raw) {
    return { ok: false, scheme: '', hostname: null, origin: null, isIpAddress: false, isHttps: false };
  }
  try {
    const u = new URL(raw);
    const scheme = u.protocol.replace(/:$/, '').toLowerCase();
    // file:// and chrome:// URLs have empty or odd hostnames.
    const hostname = u.hostname ? u.hostname.toLowerCase() : null;
    const origin = hostname ? `${scheme}://${u.host}` : null;
    return {
      ok: true,
      scheme,
      hostname,
      origin,
      isIpAddress: hostname ? isIpAddressHost(hostname) : false,
      isHttps: scheme === 'https',
    };
  } catch {
    return { ok: false, scheme: '', hostname: null, origin: null, isIpAddress: false, isHttps: false };
  }
}

export function classifyPage(rawUrl: string | null | undefined): PageKind {
  const parsed = parseUrl(rawUrl);
  if (!parsed.ok) return 'unsupported';

  if (parsed.scheme === 'chrome-extension') {
    // WebWise's own pages live here, as do other extensions' pages.
    return 'extension-page';
  }
  if (INTERNAL_SCHEMES.has(parsed.scheme)) {
    if (parsed.scheme === 'chrome' && parsed.hostname === 'newtab') return 'new-tab';
    return 'browser-internal';
  }
  if (FILE_SCHEMES.has(parsed.scheme)) return 'file';
  if (parsed.scheme === 'http' || parsed.scheme === 'https') {
    if (parsed.hostname === 'chrome.google.com' || parsed.hostname === 'chromewebstore.google.com') {
      return 'web-store';
    }
    return 'web';
  }
  return 'unsupported';
}

const RESTRICTION_TEXT: Record<Exclude<PageKind, 'web'>, string> = {
  'browser-internal':
    'This is a built-in browser page. Browsers block extensions from reading these pages, so WebWise cannot inspect it — that is a safety feature, not an error.',
  'extension-page':
    'This page belongs to a browser extension. Extensions are not allowed to inspect each other’s pages, so WebWise cannot look inside this one.',
  'new-tab':
    'This is the browser’s new-tab page. WebWise cannot inspect built-in browser pages.',
  'web-store':
    'This is the Chrome Web Store. Google blocks extensions from running here, so WebWise cannot inspect it.',
  file: 'This is a file on your computer rather than a website, so there are no website cookies or permissions to check.',
  unsupported:
    'WebWise does not recognise this kind of page, so it cannot inspect it. This is a limitation, not a problem with the page.',
};

/**
 * Build a PageContext from a raw URL. Pure function: no browser APIs, so it is
 * easy to unit test and impossible to accidentally leak data from.
 */
export function buildPageContext(rawUrl: string | null | undefined, title: string | null = null, favIconUrl: string | null = null): PageContext {
  const parsed = parseUrl(rawUrl);
  const kind = classifyPage(rawUrl);
  const hostname = parsed.hostname;

  let label: string;
  if (kind === 'web' && hostname) {
    label = hostname;
  } else if (kind === 'browser-internal' && parsed.ok) {
    label = `${parsed.scheme}://${rawUrl ? rawUrl.replace(/^[a-z-]+:\/\//, '').split(/[/?#]/)[0] : ''}`;
  } else if (kind === 'new-tab') {
    label = 'New tab';
  } else if (kind === 'web-store') {
    label = 'Chrome Web Store';
  } else if (kind === 'file') {
    label = 'Local file';
  } else if (kind === 'extension-page') {
    label = 'Extension page';
  } else {
    label = 'Unknown page';
  }

  return {
    kind,
    url: rawUrl ?? null,
    hostname,
    origin: parsed.origin,
    title,
    favIconUrl,
    isHttps: parsed.isHttps,
    isIpAddress: parsed.isIpAddress,
    label,
    restrictionReason: kind === 'web' ? undefined : RESTRICTION_TEXT[kind],
  };
}

/**
 * Heuristic checks for the Safety Coach's "is this URL suspicious?" exercise.
 * These are deliberately *signals*, not verdicts — the coach always teaches
 * that a signal is a reason to look closer, not proof of danger.
 */
export interface UrlSignal {
  id: string;
  label: string;
  explanation: string;
}

export function analyseUrlHeuristics(url: string): UrlSignal[] {
  const signals: UrlSignal[] = [];
  const parsed = parseUrl(url.startsWith('http') ? url : `https://${url}`);
  if (!parsed.ok || !parsed.hostname) return signals;

  const host = parsed.hostname;
  const labels = host.split('.');

  if (parsed.isIpAddress) {
    signals.push({
      id: 'ip-host',
      label: 'The address is a string of numbers',
      explanation: 'Real websites usually use names like example.com. A number address can be a sign that nobody set up a proper, verifiable name.',
    });
  }

  if (host.includes('xn--')) {
    signals.push({
      id: 'punycode',
      label: 'The address contains unusual encoded characters',
      explanation: 'Some addresses hide look-alike letters (for example a Cyrillic "а" that looks like an English "a"). This is called a homograph trick.',
    });
  }

  if (labels.length >= 4) {
    signals.push({
      id: 'many-subdomains',
      label: 'There are a lot of dots in the address',
      explanation: 'Extra words before the real name are a common way to make an address look like somewhere it is not. The real owner is the part just before the ending.',
    });
  }

  if (/-(secure|login|verify|account|update|signin|bank|support)\b/i.test(host) || /(secure|login|verify|account|update|signin|bank)-/i.test(host)) {
    signals.push({
      id: 'bait-word',
      label: 'The address contains a word like "secure" or "login"',
      explanation: 'Trustworthy sites rarely need to put words like these in their address to feel safe. It can be an attempt to look official.',
    });
  }

  if (parsed.scheme === 'http') {
    signals.push({
      id: 'no-https',
      label: 'The address does not use a padlock connection',
      explanation: 'Without https, what you send could be read or changed on the way. Never type a password on an http page.',
    });
  }

  if (host.length > 30) {
    signals.push({
      id: 'long-host',
      label: 'The address is unusually long',
      explanation: 'Long addresses can bury the important part so it is hard to spot the real name.',
    });
  }

  if (labels.length >= 2) {
    const tld = labels[labels.length - 1] ?? '';
    if (/^(zip|mov|top|xyz|click|link|work|gq|cf|tk|ml)$/i.test(tld)) {
      signals.push({
        id: 'cheap-tld',
        label: 'The address ends in an ending used by lots of throwaway sites',
        explanation: 'Some endings are popular for free, short-lived sites. That is not proof of harm on its own, but it is worth a second look.',
      });
    }
  }

  return signals;
}

/** Extract the registrable-ish domain (last two labels, three for common 2-part TLDs). */
export function registrableDomain(host: string): string {
  const clean = host.toLowerCase().replace(/^\./, '');
  const parts = clean.split('.');
  if (parts.length <= 2) return clean;
  const twoPartTlds = new Set(['co.uk', 'org.uk', 'gov.uk', 'ac.uk', 'com.au', 'co.jp', 'com.br', 'co.nz']);
  const lastTwo = parts.slice(-2).join('.');
  if (twoPartTlds.has(lastTwo) && parts.length >= 3) return parts.slice(-3).join('.');
  return lastTwo;
}
