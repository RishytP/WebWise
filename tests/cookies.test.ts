import { describe, expect, it } from 'vitest';
import {
  buildCookieInsights,
  classifyParty,
  explainCookieAttributes,
  sameSiteLabel,
  summariseCookies,
  toCookieRecord,
} from '../src/features/cookies/cookieLogic';
import type { CookieRecord } from '../src/types';

function makeChromeCookie(overrides: Partial<chrome.cookies.Cookie> = {}): chrome.cookies.Cookie {
  return {
    name: 'sid',
    value: 'SUPER-SECRET-VALUE',
    domain: 'example.com',
    path: '/',
    secure: true,
    httpOnly: true,
    sameSite: 'lax',
    session: true,
    hostOnly: false,
    storeId: '0',
    ...overrides,
  } as chrome.cookies.Cookie;
}

function makeRecord(overrides: Partial<CookieRecord> = {}): CookieRecord {
  return {
    name: 'sid',
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
    ...overrides,
  };
}

describe('toCookieRecord', () => {
  it('never copies the cookie value', () => {
    const record = toCookieRecord(makeChromeCookie({ value: 'TOPSECRET' }), 'example.com');
    expect(JSON.stringify(record)).not.toContain('TOPSECRET');
    expect(Object.keys(record)).not.toContain('value');
  });

  it('keeps the attributes we can explain', () => {
    const record = toCookieRecord(makeChromeCookie({ secure: false, httpOnly: false, session: false }), 'example.com');
    expect(record.secure).toBe(false);
    expect(record.httpOnly).toBe(false);
    expect(record.session).toBe(false);
  });
});

describe('classifyParty', () => {
  it('treats the site’s own domain as first-party', () => {
    expect(classifyParty('example.com', 'example.com')).toBe('first-party');
    expect(classifyParty('.example.com', 'news.example.com')).toBe('first-party');
  });

  it('treats a different domain as third-party', () => {
    expect(classifyParty('.adnetwork.test', 'example.com')).toBe('third-party');
  });

  it('returns unknown when there is no hostname', () => {
    expect(classifyParty('example.com', null)).toBe('unknown');
  });

  it('handles two-part public suffixes like co.uk', () => {
    expect(classifyParty('.example.co.uk', 'shop.example.co.uk')).toBe('first-party');
    expect(classifyParty('.other.co.uk', 'example.co.uk')).toBe('third-party');
  });
});

describe('summariseCookies', () => {
  it('counts the categories it reports', () => {
    const cookies = [
      makeRecord({ name: 'a', party: 'first-party', httpOnly: true, session: true, secure: true }),
      makeRecord({ name: 'b', party: 'third-party', domain: '.tracker.test', httpOnly: false, session: false, secure: false }),
      makeRecord({ name: 'c', party: 'third-party', domain: '.tracker.test', httpOnly: true, session: true, secure: true }),
    ];
    const s = summariseCookies(cookies);
    expect(s.total).toBe(3);
    expect(s.firstParty).toBe(1);
    expect(s.thirdParty).toBe(2);
    expect(s.httpOnly).toBe(2);
    expect(s.session).toBe(2);
    expect(s.persistent).toBe(1);
    expect(s.secure).toBe(2);
    expect(s.thirdPartyDomains).toEqual(['tracker.test']);
  });

  it('is empty for no cookies', () => {
    const s = summariseCookies([]);
    expect(s.total).toBe(0);
    expect(s.thirdPartyDomains).toEqual([]);
  });
});

describe('explainCookieAttributes', () => {
  it('explains HttpOnly honestly without over-claiming', () => {
    const attrs = explainCookieAttributes(makeRecord({ httpOnly: true }));
    const httpOnly = attrs.find((a) => a.attribute === 'HttpOnly');
    expect(httpOnly).toBeDefined();
    expect(httpOnly?.state).toBe('On');
    expect(httpOnly?.plain).toContain('does not make the cookie invulnerable');
  });

  it('explains the off state of Secure', () => {
    const attrs = explainCookieAttributes(makeRecord({ secure: false }));
    const secure = attrs.find((a) => a.attribute === 'Secure');
    expect(secure?.state).toBe('Off');
    expect(secure?.plain).toContain('unencrypted');
  });

  it('distinguishes session from stored cookies', () => {
    const session = explainCookieAttributes(makeRecord({ session: true })).find((a) => a.attribute === 'Lifetime');
    const stored = explainCookieAttributes(makeRecord({ session: false })).find((a) => a.attribute === 'Lifetime');
    expect(session?.state).toBe('Session');
    expect(stored?.state).toBe('Stored');
  });

  it('always returns an explanation for every attribute', () => {
    const attrs = explainCookieAttributes(makeRecord());
    for (const a of attrs) {
      expect(a.plain.length).toBeGreaterThan(20);
      expect(a.state.length).toBeGreaterThan(0);
    }
  });
});

describe('sameSiteLabel', () => {
  it('maps each browser value to a readable label', () => {
    expect(sameSiteLabel('no_restriction')).toBe('None');
    expect(sameSiteLabel('lax')).toBe('Lax');
    expect(sameSiteLabel('strict')).toBe('Strict');
    expect(sameSiteLabel('unspecified')).toBe('Not stated');
  });
});

describe('buildCookieInsights', () => {
  it('produces no insights when there are no cookies', () => {
    expect(buildCookieInsights(summariseCookies([]), 'example.com')).toEqual([]);
  });

  it('always includes the purpose caveat when cookies exist', () => {
    const insights = buildCookieInsights(summariseCookies([makeRecord()]), 'example.com');
    const purpose = insights.find((i) => i.id === 'purpose');
    expect(purpose).toBeDefined();
    expect(purpose?.meaning).toContain('cannot tell which');
  });

  it('notes third-party cookies when present', () => {
    const cookies = [makeRecord({ party: 'third-party', domain: '.tracker.test' })];
    const insights = buildCookieInsights(summariseCookies(cookies), 'example.com');
    expect(insights.some((i) => i.id === 'third-party')).toBe(true);
  });

  it('praises first-party-only setups without calling the site safe', () => {
    const insights = buildCookieInsights(summariseCookies([makeRecord()]), 'example.com');
    const first = insights.find((i) => i.id === 'first-party');
    expect(first).toBeDefined();
    const joined = insights.map((i) => `${i.found} ${i.meaning} ${i.action}`).join(' ').toLowerCase();
    expect(joined).not.toContain('this site is safe');
  });
});
