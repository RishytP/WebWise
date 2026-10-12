import { describe, expect, it } from 'vitest';
import {
  analyseUrlHeuristics,
  buildPageContext,
  classifyPage,
  isIpv4,
  parseUrl,
  registrableDomain,
} from '../src/utils/url';

describe('parseUrl', () => {
  it('parses a normal https URL', () => {
    const p = parseUrl('https://news.example.com/article?id=1');
    expect(p.ok).toBe(true);
    expect(p.hostname).toBe('news.example.com');
    expect(p.origin).toBe('https://news.example.com');
    expect(p.isHttps).toBe(true);
  });

  it('handles a null URL without throwing', () => {
    const p = parseUrl(null);
    expect(p.ok).toBe(false);
    expect(p.hostname).toBeNull();
  });

  it('handles rubbish input without throwing', () => {
    expect(parseUrl('not a url').ok).toBe(false);
  });
});

describe('isIpv4', () => {
  it('accepts valid dotted addresses', () => {
    expect(isIpv4('192.168.0.1')).toBe(true);
    expect(isIpv4('8.8.8.8')).toBe(true);
  });

  it('rejects out-of-range and malformed addresses', () => {
    expect(isIpv4('256.1.1.1')).toBe(false);
    expect(isIpv4('1.2.3')).toBe(false);
    expect(isIpv4('example.com')).toBe(false);
  });
});

describe('classifyPage', () => {
  it('classifies normal web pages', () => {
    expect(classifyPage('https://example.com')).toBe('web');
    expect(classifyPage('http://example.com')).toBe('web');
  });

  it('classifies restricted browser pages', () => {
    expect(classifyPage('chrome://settings')).toBe('browser-internal');
    expect(classifyPage('chrome://newtab')).toBe('new-tab');
    expect(classifyPage('chrome-extension://abc/page.html')).toBe('extension-page');
    expect(classifyPage('file:///home/user/notes.txt')).toBe('file');
    expect(classifyPage('https://chrome.google.com/webstore')).toBe('web-store');
    expect(classifyPage('https://chromewebstore.google.com/detail/x')).toBe('web-store');
  });

  it('falls back to unsupported for anything else', () => {
    expect(classifyPage('ftp://example.com')).toBe('unsupported');
    expect(classifyPage(null)).toBe('unsupported');
    expect(classifyPage('')).toBe('unsupported');
  });
});

describe('buildPageContext', () => {
  it('gives a normal page a hostname label and no restriction reason', () => {
    const ctx = buildPageContext('https://www.example.com/path', 'Example');
    expect(ctx.kind).toBe('web');
    expect(ctx.label).toBe('www.example.com');
    expect(ctx.restrictionReason).toBeUndefined();
  });

  it('explains why a restricted page cannot be inspected', () => {
    const ctx = buildPageContext('chrome://settings');
    expect(ctx.kind).toBe('browser-internal');
    expect(ctx.restrictionReason).toBeTruthy();
    expect(ctx.restrictionReason).toContain('built-in browser page');
  });

  it('flags IP-address hosts', () => {
    const ctx = buildPageContext('http://192.168.1.1/admin');
    expect(ctx.isIpAddress).toBe(true);
  });
});

describe('analyseUrlHeuristics', () => {
  it('flags a number-substituted look-alike host', () => {
    const signals = analyseUrlHeuristics('https://paypa1-secure-login.example.com/verify');
    const ids = signals.map((s) => s.id);
    expect(ids).toContain('bait-word');
    expect(ids).toContain('long-host');
  });

  it('flags addresses with lots of dots', () => {
    const signals = analyseUrlHeuristics('https://login.secure.account.example.com/signin');
    expect(signals.map((s) => s.id)).toContain('many-subdomains');
  });

  it('flags a throwaway-looking ending', () => {
    const signals = analyseUrlHeuristics('https://free-prize.example.zip');
    expect(signals.map((s) => s.id)).toContain('cheap-tld');
  });

  it('flags plain http as not using a padlock', () => {
    const signals = analyseUrlHeuristics('http://example.com/login');
    expect(signals.map((s) => s.id)).toContain('no-https');
  });

  it('flags an IP-address host', () => {
    const signals = analyseUrlHeuristics('http://10.0.0.5/portal');
    expect(signals.map((s) => s.id)).toContain('ip-host');
  });

  it('flags punycode look-alike hosts', () => {
    const signals = analyseUrlHeuristics('https://xn--pypal-4ve.example');
    expect(signals.map((s) => s.id)).toContain('punycode');
  });

  it('produces few or no signals for a plain, ordinary address', () => {
    const signals = analyseUrlHeuristics('https://example.com');
    expect(signals.length).toBe(0);
  });

  it('never returns a verdict, only signals with explanations', () => {
    for (const signal of analyseUrlHeuristics('http://paypa1-secure.example.zip/login')) {
      expect(signal.explanation.length).toBeGreaterThan(20);
      expect(signal.label.length).toBeGreaterThan(5);
    }
  });
});

describe('registrableDomain', () => {
  it('reduces subdomains to the registrable part', () => {
    expect(registrableDomain('news.example.com')).toBe('example.com');
    expect(registrableDomain('.example.com')).toBe('example.com');
  });

  it('handles two-part public suffixes', () => {
    expect(registrableDomain('shop.example.co.uk')).toBe('example.co.uk');
  });

  it('leaves short hosts alone', () => {
    expect(registrableDomain('localhost')).toBe('localhost');
  });
});
