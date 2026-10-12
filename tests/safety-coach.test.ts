import { describe, expect, it } from 'vitest';
import {
  SCENARIOS,
  answerById,
  contextualTips,
  isCorrectAnswer,
  scenarioById,
} from '../src/features/safety-coach/scenarios';

describe('scenario catalogue', () => {
  it('covers the five required topics', () => {
    const ids = SCENARIOS.map((s) => s.id);
    expect(ids).toContain('suspicious-url');
    expect(ids).toContain('unexpected-download');
    expect(ids).toContain('notification-request');
    expect(ids).toContain('fake-login');
    expect(ids).toContain('password-request');
    expect(SCENARIOS.length).toBeGreaterThanOrEqual(5);
  });

  it('gives every scenario exactly one correct answer', () => {
    for (const s of SCENARIOS) {
      const correct = s.answers.filter((a) => a.correct);
      expect(correct.length, `scenario ${s.id}`).toBe(1);
    }
  });

  it('gives every answer feedback and every scenario a takeaway', () => {
    for (const s of SCENARIOS) {
      expect(s.takeaway.length).toBeGreaterThan(20);
      for (const a of s.answers) {
        expect(a.feedback.length).toBeGreaterThan(30);
        expect(a.text.length).toBeGreaterThan(5);
      }
    }
  });

  it('does not embed real malicious URLs or ask for real credentials', () => {
    const text = JSON.stringify(SCENARIOS).toLowerCase();
    // Only example.com / example.test style placeholders are allowed.
    expect(text).not.toMatch(/https?:\/\/(?!paypa1-secure-login\.example\.com)[a-z0-9-]+\.(com|net|org|ru|cn)\//);
    expect(text).not.toContain('password:');
  });
});

describe('isCorrectAnswer', () => {
  it('identifies the safest option', () => {
    const s = scenarioById('password-request');
    expect(s).toBeDefined();
    if (!s) return;
    expect(isCorrectAnswer(s, 'b')).toBe(true);
    expect(isCorrectAnswer(s, 'a')).toBe(false);
    expect(isCorrectAnswer(s, 'nope')).toBe(false);
  });

  it('agrees with answerById', () => {
    for (const s of SCENARIOS) {
      for (const a of s.answers) {
        expect(isCorrectAnswer(s, a.id)).toBe(answerById(s, a.id)?.correct);
      }
    }
  });
});

describe('contextualTips', () => {
  it('gives a general tip when there are no findings', () => {
    const tips = contextualTips({});
    expect(tips.length).toBe(1);
    expect(tips[0]?.id).toBe('tip-general');
  });

  it('adds a third-party tip only when third-party cookies exist', () => {
    const withThird = contextualTips({
      cookieSummary: { total: 5, httpOnly: 0, thirdParty: 2, persistent: 0 },
    });
    expect(withThird.some((t) => t.id === 'tip-third-party')).toBe(true);

    const withoutThird = contextualTips({
      cookieSummary: { total: 5, httpOnly: 0, thirdParty: 0, persistent: 0 },
    });
    expect(withoutThird.some((t) => t.id === 'tip-third-party')).toBe(false);
  });

  it('adds a notification tip only for prompt or granted notifications', () => {
    const granted = contextualTips({ permissionFindings: [{ name: 'notifications', state: 'granted' }] });
    expect(granted.some((t) => t.id === 'tip-notifications')).toBe(true);

    const denied = contextualTips({ permissionFindings: [{ name: 'notifications', state: 'denied' }] });
    expect(denied.some((t) => t.id === 'tip-notifications')).toBe(false);
  });

  it('adds a camera tip when camera is granted', () => {
    const tips = contextualTips({ permissionFindings: [{ name: 'camera', state: 'granted' }] });
    expect(tips.some((t) => t.id === 'tip-camera')).toBe(true);
  });

  it('never calls a site safe', () => {
    const tips = contextualTips({
      cookieSummary: { total: 1, httpOnly: 1, thirdParty: 0, persistent: 1 },
      permissionFindings: [{ name: 'camera', state: 'granted' }],
    });
    const text = tips.map((t) => t.body).join(' ').toLowerCase();
    expect(text).not.toContain('this site is safe');
    expect(text).not.toContain('100% safe');
  });
});
