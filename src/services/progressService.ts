import type { CoachAttemptRecord, CoachProgress } from '../types';

/**
 * Opt-in local memory for Safety Coach progress.
 *
 * Everything here is off unless the learner switches it on. When it is on we
 * store one small record in chrome.storage.local, which never leaves the
 * device and is never sent anywhere. We store no personal data, no URLs and no
 * browsing history — only which invented scenarios were answered and the round
 * they belonged to.
 */

export const PROGRESS_OPT_IN_KEY = 'coachProgressOptIn';
export const COACH_PROGRESS_KEY = 'coachProgress';

function storage(): chrome.storage.StorageArea | null {
  try {
    return chrome?.storage?.local ?? null;
  } catch {
    return null;
  }
}

export async function isProgressOptedIn(): Promise<boolean> {
  const area = storage();
  if (!area) return false;
  try {
    const result = await area.get(PROGRESS_OPT_IN_KEY);
    return result[PROGRESS_OPT_IN_KEY] === true;
  } catch {
    return false;
  }
}

export async function setProgressOptedIn(enabled: boolean): Promise<void> {
  const area = storage();
  if (!area) return;
  try {
    if (enabled) {
      await area.set({ [PROGRESS_OPT_IN_KEY]: true });
    } else {
      // Turning it off must also forget anything already saved.
      await area.remove([PROGRESS_OPT_IN_KEY, COACH_PROGRESS_KEY]);
    }
  } catch {
    /* Storage is best-effort; the Coach works fine without it. */
  }
}

function isAttemptRecord(value: unknown): value is CoachAttemptRecord {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v.answerId === 'string' && typeof v.correct === 'boolean';
}

/**
 * Validate anything read back from storage before it reaches the UI. A record
 * that does not match the current shape is treated as absent, so a corrupt or
 * outdated entry can never break the Coach.
 */
export function isCoachProgress(value: unknown): value is CoachProgress {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  if (v.version !== 1) return false;
  if (typeof v.savedAt !== 'number' || !Number.isFinite(v.savedAt)) return false;
  if (typeof v.roundNumber !== 'number' || !Number.isFinite(v.roundNumber)) return false;
  if (typeof v.roundId !== 'string') return false;
  if (!Array.isArray(v.scenarioIds) || !v.scenarioIds.every((id) => typeof id === 'string')) return false;
  if (typeof v.index !== 'number' || !Number.isFinite(v.index)) return false;
  if (typeof v.bestStreak !== 'number' || !Number.isFinite(v.bestStreak)) return false;
  if (typeof v.attempts !== 'object' || v.attempts === null) return false;
  return Object.values(v.attempts).every(isAttemptRecord);
}

export async function loadCoachProgress(): Promise<CoachProgress | null> {
  const area = storage();
  if (!area) return null;
  try {
    const result = await area.get(COACH_PROGRESS_KEY);
    const value = result[COACH_PROGRESS_KEY];
    return isCoachProgress(value) ? value : null;
  } catch {
    return null;
  }
}

export async function saveCoachProgress(progress: CoachProgress): Promise<void> {
  const area = storage();
  if (!area) return;
  try {
    await area.set({ [COACH_PROGRESS_KEY]: progress });
  } catch {
    /* Best-effort: a failed save must never interrupt the learner. */
  }
}

export async function clearCoachProgress(): Promise<void> {
  const area = storage();
  if (!area) return;
  try {
    await area.remove(COACH_PROGRESS_KEY);
  } catch {
    /* ignore */
  }
}
