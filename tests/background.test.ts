import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { PageContext } from '../src/types';

/**
 * These tests exercise the background worker's report builders against a
 * *mocked* chrome API. They prove the empty, unsupported and error paths
 * behave, and that a thrown chrome error never crashes the worker.
 *
 * They are deliberately separated from real-browser testing, which is
 * described in the README — a mock cannot prove Chrome's behaviour.
 */

type Cookie = chrome.cookies.Cookie;

interface ChromeMock {
  cookies: { getAll: ReturnType<typeof vi.fn> };
  scripting: { executeScript: ReturnType<typeof vi.fn> };
  tabs: { get: ReturnType<typeof vi.fn> };
  runtime: { onMessage: { addListener: ReturnType<typeof vi.fn> } };
}

function installChromeMock(overrides: Partial<ChromeMock> = {}): ChromeMock {
  const mock: ChromeMock = {
    cookies: { getAll: vi.fn().mockResolvedValue([]) },
    scripting: { executeScript: vi.fn().mockRejectedValue(new Error('Cannot access contents of the page')) },
    tabs: { get: vi.fn().mockResolvedValue({ id: 1, url: 'https://example.com', title: 'Example' }) },
    runtime: { onMessage: { addListener: vi.fn() } },
    ...overrides,
  };
  (globalThis as unknown as { chrome: unknown }).chrome = mock;
  return mock;
}

const WEB_CONTEXT: PageContext = {
  kind: 'web',
  tabId: 1,
  url: 'https://example.com/page',
  hostname: 'example.com',
  origin: 'https://example.com',
  title: 'Example',
  favIconUrl: null,
  isHttps: true,
  isIpAddress: false,
  label: 'example.com',
};

const INTERNAL_CONTEXT: PageContext = {
  kind: 'browser-internal',
  tabId: 1,
  url: 'chrome://settings',
  hostname: null,
  origin: null,
  title: 'Settings',
  favIconUrl: null,
  isHttps: false,
  isIpAddress: false,
  label: 'chrome://settings',
  restrictionReason: 'This is a built-in browser page.',
};

function cookie(overrides: Partial<Cookie> = {}): Cookie {
  return {
    name: 'sid',
    value: 'SECRET',
    domain: 'example.com',
    path: '/',
    secure: true,
    httpOnly: true,
    sameSite: 'lax',
    session: true,
    hostOnly: false,
    storeId: '0',
    ...overrides,
  } as Cookie;
}

async function loadWorker() {
  // Fresh module each time so the top-level listener registration uses the mock.
  vi.resetModules();
  return import('../src/background/index');
}

describe('background worker: cookie reports', () => {
  beforeEach(() => {
    installChromeMock();
  });
  afterEach(() => {
    vi.resetModules();
  });

  it('returns an ok report with real metadata and no values', async () => {
    const mock = installChromeMock();
    mock.cookies.getAll.mockResolvedValue([cookie(), cookie({ name: 'theme', domain: '.tracker.test', httpOnly: false })]);

    const { getCookieReport } = await loadWorker();
    const report = await getCookieReport(WEB_CONTEXT);

    expect(report.status).toBe('ok');
    expect(report.summary.total).toBe(2);
    expect(report.summary.thirdParty).toBe(1);
    expect(JSON.stringify(report)).not.toContain('SECRET');
  });

  it('returns a helpful empty report when there are no cookies', async () => {
    const mock = installChromeMock();
    mock.cookies.getAll.mockResolvedValue([]);

    const { getCookieReport } = await loadWorker();
    const report = await getCookieReport(WEB_CONTEXT);

    expect(report.status).toBe('ok');
    expect(report.summary.total).toBe(0);
    expect(report.insights).toEqual([]);
    expect(report.limitations.length).toBeGreaterThan(0);
  });

  it('handles a thrown chrome error gracefully', async () => {
    const mock = installChromeMock();
    mock.cookies.getAll.mockRejectedValue(new Error('Permission denied'));

    const { getCookieReport } = await loadWorker();
    const report = await getCookieReport(WEB_CONTEXT);

    expect(report.status).toBe('error');
    expect(report.message).toContain('not allowed');
  });

  it('marks restricted pages as unsupported without calling the cookies API', async () => {
    const mock = installChromeMock();

    const { getCookieReport } = await loadWorker();
    const report = await getCookieReport(INTERNAL_CONTEXT);

    expect(report.status).toBe('unsupported');
    expect(mock.cookies.getAll).not.toHaveBeenCalled();
    expect(report.message).toContain('built-in browser page');
  });
});

describe('background worker: permission reports', () => {
  beforeEach(() => {
    installChromeMock();
  });
  afterEach(() => {
    vi.resetModules();
  });

  it('reads real statuses from the injected probe', async () => {
    const mock = installChromeMock();
    mock.scripting.executeScript.mockResolvedValue([
      { result: { geolocation: 'prompt', camera: 'granted', microphone: 'denied' } },
    ]);

    const { getPermissionReport } = await loadWorker();
    const report = await getPermissionReport(WEB_CONTEXT);

    expect(report.status).toBe('ok');
    const geo = report.findings.find((f) => f.name === 'geolocation');
    expect(geo?.state).toBe('prompt');
    const cam = report.findings.find((f) => f.name === 'camera');
    expect(cam?.state).toBe('granted');
  });

  it('falls back to unavailable statuses when injection is blocked', async () => {
    const mock = installChromeMock();
    mock.scripting.executeScript.mockRejectedValue(new Error('Cannot access contents of the page'));

    const { getPermissionReport } = await loadWorker();
    const report = await getPermissionReport(WEB_CONTEXT);

    expect(report.status).toBe('ok');
    expect(report.findings.every((f) => f.state === 'unsupported')).toBe(true);
    expect(report.message).toContain('could not run its permission check');
  });

  it('marks restricted pages as unsupported without injecting', async () => {
    const mock = installChromeMock();

    const { getPermissionReport } = await loadWorker();
    const report = await getPermissionReport(INTERNAL_CONTEXT);

    expect(report.status).toBe('unsupported');
    expect(mock.scripting.executeScript).not.toHaveBeenCalled();
  });

  it('never claims usage, only status', async () => {
    const mock = installChromeMock();
    mock.scripting.executeScript.mockResolvedValue([{ result: { geolocation: 'granted' } }]);

    const { getPermissionReport } = await loadWorker();
    const report = await getPermissionReport(WEB_CONTEXT);
    const geo = report.findings.find((f) => f.name === 'geolocation');
    expect(geo?.stateMeaning).toContain('does not tell us whether the site has actually used it');
  });
});
