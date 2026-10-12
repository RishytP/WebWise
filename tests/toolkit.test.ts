import { describe, expect, it } from 'vitest';
import { TOOLKIT_TOPICS } from '../src/features/safety-coach/toolkit';

/**
 * The Safety Toolkit is static educational content. These tests guard its
 * shape and, importantly, that it never over-claims safety (no "this site is
 * safe" language) and always gives a concrete next step.
 */
describe('safety toolkit content', () => {
  it('has a meaningful number of topics', () => {
    expect(TOOLKIT_TOPICS.length).toBeGreaterThanOrEqual(8);
  });

  it('covers the broader web-safety themes the browser cannot inspect', () => {
    const ids = TOOLKIT_TOPICS.map((t) => t.id);
    expect(ids).toContain('padlock');
    expect(ids).toContain('passwords');
    expect(ids).toContain('codes');
    expect(ids).toContain('downloads');
    expect(ids).toContain('notifications');
    expect(ids).toContain('trackers');
  });

  it('gives every topic a question, an answer and a concrete action', () => {
    for (const topic of TOOLKIT_TOPICS) {
      expect(topic.question.trim().length).toBeGreaterThan(8);
      expect(topic.answer.trim().length).toBeGreaterThan(40);
      expect(topic.tryThis.trim().length).toBeGreaterThan(20);
      expect(topic.question.endsWith('?')).toBe(true);
    }
  });

  it('uses unique ids', () => {
    const ids = TOOLKIT_TOPICS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('never tells a child that a website is simply "safe"', () => {
    for (const topic of TOOLKIT_TOPICS) {
      const text = `${topic.answer} ${topic.tryThis}`.toLowerCase();
      expect(text).not.toMatch(/\bthis (site|website) is safe\b/);
      expect(text).not.toMatch(/\b100% safe\b/);
      expect(text).not.toMatch(/\bcompletely safe\b/);
    }
  });

  it('always points toward asking a trusted adult in the "prize" scenario', () => {
    const prize = TOOLKIT_TOPICS.find((t) => t.id === 'free-offers');
    expect(prize).toBeDefined();
    expect(`${prize?.answer} ${prize?.tryThis}`.toLowerCase()).toContain('adult');
  });
});
