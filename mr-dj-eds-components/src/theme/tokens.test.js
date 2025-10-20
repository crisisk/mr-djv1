import { describe, expect, it } from 'vitest';
import tokens, { typography } from './tokens.js';

describe('design tokens typography scale', () => {
  it('includes the documented heading scale', () => {
    expect(typography.fontSize.h3).toBe('28px');
    expect(typography.fontSize.h4).toBe('20px');
    expect(typography.fontSize.h5).toBe('16px');
  });

  it('tracks body styles and supporting text tokens', () => {
    expect(typography.fontSize.bodyLarge).toBe('18px');
    expect(typography.fontSize.caption).toBe('12px');
  });

  it('exposes the documented weight ramp', () => {
    expect(typography.fontWeight.black).toBe(900);
    expect(typography.fontWeight.extrabold).toBe(800);
    expect(typography.fontWeight.bold).toBe(700);
    expect(typography.fontWeight.semibold).toBe(600);
    expect(typography.fontWeight.medium).toBe(500);
    expect(typography.fontWeight.regular).toBe(400);
  });
});

describe('design tokens aggregate export', () => {
  it('syncs the typography scale with the aggregate token object', () => {
    expect(tokens.typography.scale.h3.fontSize).toBe('28px');
    expect(tokens.typography.scale.h4.fontWeight).toBe(700);
    expect(tokens.typography.scale.caption.fontWeight).toBe(600);
  });
});
