import { describe, expect, it } from 'vitest';
import { MESSAGE_SOURCE, MESSAGE_TARGET, isWorkerRequest } from '../src/services/messaging';

const valid = {
  source: MESSAGE_SOURCE,
  target: MESSAGE_TARGET,
  type: 'GET_COOKIE_REPORT' as const,
  tabId: 1,
  url: 'https://example.com',
  hostname: 'example.com',
};

describe('isWorkerRequest', () => {
  it('accepts a well-formed request', () => {
    expect(isWorkerRequest(valid)).toBe(true);
  });

  it('rejects a request from an unknown source', () => {
    expect(isWorkerRequest({ ...valid, source: 'some-web-page' })).toBe(false);
  });

  it('rejects a request aimed elsewhere', () => {
    expect(isWorkerRequest({ ...valid, target: 'other-worker' })).toBe(false);
  });

  it('rejects an unknown message type', () => {
    expect(isWorkerRequest({ ...valid, type: 'DELETE_EVERYTHING' })).toBe(false);
  });

  it('rejects a non-numeric tab id', () => {
    expect(isWorkerRequest({ ...valid, tabId: '1' })).toBe(false);
    expect(isWorkerRequest({ ...valid, tabId: Number.NaN })).toBe(false);
  });

  it('rejects null and primitives', () => {
    expect(isWorkerRequest(null)).toBe(false);
    expect(isWorkerRequest('hello')).toBe(false);
    expect(isWorkerRequest(42)).toBe(false);
    expect(isWorkerRequest(undefined)).toBe(false);
  });

  it('rejects a url that is not a string or null', () => {
    expect(isWorkerRequest({ ...valid, url: 123 })).toBe(false);
  });

  it('accepts a null url and hostname', () => {
    expect(isWorkerRequest({ ...valid, url: null, hostname: null })).toBe(true);
  });
});
