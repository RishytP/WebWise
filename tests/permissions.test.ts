import { describe, expect, it } from 'vitest';
import {
  interpretPermission,
  permissionLimitations,
  sortFindings,
  stateLabelFor,
} from '../src/features/permissions/permissionLogic';
import type { PermissionFinding } from '../src/types';

describe('interpretPermission', () => {
  it('reads a granted state as observed', () => {
    const f = interpretPermission('geolocation', 'granted', true);
    expect(f.state).toBe('granted');
    expect(f.stateLabel).toBe('Allowed');
    expect(f.evidence.kind).toBe('observed');
  });

  it('reads a prompt state as "Ask first" and never claims use', () => {
    const f = interpretPermission('geolocation', 'prompt', true);
    expect(f.stateLabel).toBe('Ask first');
    expect(f.stateMeaning).toContain('does not tell us whether it has asked before');
    expect(f.stateMeaning).not.toMatch(/has used|is using/i);
  });

  it('reads a denied state as blocked', () => {
    const f = interpretPermission('camera', 'denied', true);
    expect(f.stateLabel).toBe('Blocked');
    expect(f.stateMeaning).toContain('blocked');
  });

  it('reports unsupported rather than guessing when the browser cannot say', () => {
    const f = interpretPermission('midi', null, false);
    expect(f.state).toBe('unsupported');
    expect(f.stateLabel).toBe('Not available');
    expect(f.evidence.kind).toBe('unknown');
  });

  it('reports unknown for an unrecognised value', () => {
    const f = interpretPermission('camera', 'something-odd', true);
    expect(f.state).toBe('unknown');
    expect(f.stateMeaning).toContain('rather say "unknown"');
  });

  it('separates status from usage for a granted permission', () => {
    const f = interpretPermission('microphone', 'granted', true);
    expect(f.stateMeaning).toContain('does not tell us whether the site has actually used it');
  });

  it('describes what each permission allows', () => {
    for (const name of ['geolocation', 'camera', 'microphone', 'notifications'] as const) {
      const f = interpretPermission(name, 'prompt', true);
      expect(f.whatItAllows.length).toBeGreaterThan(20);
      expect(f.whyAsk.length).toBeGreaterThan(10);
    }
  });
});

describe('stateLabelFor', () => {
  it('labels every state', () => {
    expect(stateLabelFor('granted')).toBe('Allowed');
    expect(stateLabelFor('denied')).toBe('Blocked');
    expect(stateLabelFor('prompt')).toBe('Ask first');
    expect(stateLabelFor('unsupported')).toBe('Not available');
    expect(stateLabelFor('unknown')).toBe('Unknown');
  });
});

describe('sortFindings', () => {
  it('puts granted first and unsupported last', () => {
    const findings: PermissionFinding[] = [
      interpretPermission('midi', null, false),
      interpretPermission('geolocation', 'granted', true),
      interpretPermission('camera', 'prompt', true),
      interpretPermission('notifications', 'denied', true),
    ];
    const sorted = sortFindings(findings);
    expect(sorted.map((f) => f.state)).toEqual(['granted', 'prompt', 'denied', 'unsupported']);
  });

  it('does not mutate the input array', () => {
    const findings = [interpretPermission('camera', 'denied', true), interpretPermission('geolocation', 'granted', true)];
    const copy = [...findings];
    sortFindings(findings);
    expect(findings).toEqual(copy);
  });
});

describe('permissionLimitations', () => {
  it('states that status is not usage', () => {
    const text = permissionLimitations().join(' ').toLowerCase();
    expect(text).toContain('not the same as usage');
    expect(text).toContain('cannot see permissions you granted to other websites');
  });
});
