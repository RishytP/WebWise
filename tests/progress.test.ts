import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  COACH_PROGRESS_KEY,
  PROGRESS_OPT_IN_KEY,
  clearCoachProgress,
  isCoachProgress,
  isProgressOptedIn,
  loadCoachProgress,
  saveCoachProgress,
  setProgressOptedIn,
} from '../src/services/progressService';
import type { CoachProgress } from '../src/types';

/**
 * These tests exercise the opt-in progress memory against a *mocked*
 * chrome.storage.local. They prove the important guarantees: nothing is stored
 * unless the learner opts in, turning it off forgets the data, and anything
 * read back is validated before it reaches the UI.
 */

function installStorageMock() {
  const store = new Map<string, unknown>();
  const area = {
    get: vi.fn(async (key: string) => (store.has(key) ? { [key]: store.get(key) } : {})),
    set: vi.fn(async (items: Record<string, unknown>) => {
      for (const [k, v] of Object.entries(items)) store.set(k, v);
    }),
    remove: vi.fn(async (keys: string | string[]) => {
      for (const k of Array.isArray(keys) ? keys : [keys]) store.delete(k);
    }),
  };
  (globalThis as unknown as { chrome: unknown }).chrome = { storage: { local: area } };
  return { store, area };
}

const VALID: CoachProgress = {
  version: 1,
  savedAt: 1_700_000_000_000,
  roundNumber: 3,
  roundId: 'round-1',
  scenarioIds: ['suspicious-url', 'typo-address'],
  index: 1,
  attempts: { 'suspicious-url': { answerId: 'b', correct: true } },
  bestStreak: 2,
};

let store: Map<string, unknown>;

beforeEach(() => {
  store = installStorageMock().store;
});

afterEach(() => {
  delete (globalThis as unknown as { chrome?: unknown }).chrome;
});

describe('opt-in flag', () => {
  it('is off by default', async () => {
    expect(await isProgressOptedIn()).toBe(false);
  });

  it('is only on when explicitly set to true', async () => {
    await setProgressOptedIn(true);
    expect(await isProgressOptedIn()).toBe(true);
  });

  it('turning it off forgets any saved progress', async () => {
    await setProgressOptedIn(true);
    await saveCoachProgress(VALID);
    expect(store.has(COACH_PROGRESS_KEY)).toBe(true);

    await setProgressOptedIn(false);
    expect(await isProgressOptedIn()).toBe(false);
    expect(store.has(COACH_PROGRESS_KEY)).toBe(false);
    expect(store.has(PROGRESS_OPT_IN_KEY)).toBe(false);
  });

  it('does not treat a non-true value as opted in', async () => {
    store.set(PROGRESS_OPT_IN_KEY, 'yes');
    expect(await isProgressOptedIn()).toBe(false);
  });
});

describe('save and load', () => {
  it('round-trips a valid record', async () => {
    await saveCoachProgress(VALID);
    expect(await loadCoachProgress()).toEqual(VALID);
  });

  it('returns null when nothing is stored', async () => {
    expect(await loadCoachProgress()).toBeNull();
  });

  it('can be cleared', async () => {
    await saveCoachProgress(VALID);
    await clearCoachProgress();
    expect(await loadCoachProgress()).toBeNull();
  });
});

describe('validation of stored data', () => {
  it('accepts a well-formed record', () => {
    expect(isCoachProgress(VALID)).toBe(true);
  });

  it('rejects anything that is not the current shape', () => {
    const cases: unknown[] = [
      null,
      undefined,
      42,
      'nope',
      [],
      {},
      { ...VALID, version: 2 },
      { ...VALID, savedAt: 'soon' },
      { ...VALID, roundNumber: NaN },
      { ...VALID, scenarioIds: 'suspicious-url' },
      { ...VALID, scenarioIds: [1, 2] },
      { ...VALID, attempts: null },
      { ...VALID, attempts: { x: { answerId: 1, correct: 'yes' } } },
    ];
    for (const c of cases) {
      expect(isCoachProgress(c), JSON.stringify(c)).toBe(false);
    }
  });

  it('ignores a corrupt record read back from storage instead of crashing', async () => {
    store.set(COACH_PROGRESS_KEY, { version: 1, roundId: 9 });
    expect(await loadCoachProgress()).toBeNull();
  });
});

describe('storage failures are survivable', () => {
  it('degrades gracefully when chrome.storage is missing', async () => {
    delete (globalThis as unknown as { chrome?: unknown }).chrome;
    expect(await isProgressOptedIn()).toBe(false);
    expect(await loadCoachProgress()).toBeNull();
    await expect(saveCoachProgress(VALID)).resolves.toBeUndefined();
    await expect(setProgressOptedIn(true)).resolves.toBeUndefined();
    await expect(clearCoachProgress()).resolves.toBeUndefined();
  });

  it('never throws when the storage API itself rejects', async () => {
    (globalThis as unknown as { chrome: unknown }).chrome = {
      storage: {
        local: {
          get: vi.fn().mockRejectedValue(new Error('quota')),
          set: vi.fn().mockRejectedValue(new Error('quota')),
          remove: vi.fn().mockRejectedValue(new Error('quota')),
        },
      },
    };
    expect(await isProgressOptedIn()).toBe(false);
    expect(await loadCoachProgress()).toBeNull();
    await expect(saveCoachProgress(VALID)).resolves.toBeUndefined();
    await expect(setProgressOptedIn(true)).resolves.toBeUndefined();
  });
});
