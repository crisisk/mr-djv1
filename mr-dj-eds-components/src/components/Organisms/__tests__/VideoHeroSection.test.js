import { describe, expect, it } from 'vitest';
import {
  overlayClasses,
  resolveOverlayClass,
  selectPersonaMicrocopy
} from '../VideoHeroSection.jsx';

describe('VideoHeroSection helpers', () => {
  it('resolves overlay classes with fallback to radial', () => {
    expect(resolveOverlayClass('soft')).toBe(overlayClasses.soft);
    expect(resolveOverlayClass('solid')).toBe(overlayClasses.solid);
    expect(resolveOverlayClass('unknown')).toBe(overlayClasses.radial);
  });

  it('selects persona microcopy with sensible fallback', () => {
    const microcopy = {
      default: { primary: 'Default CTA' },
      corporate: { primary: 'Corporate CTA' }
    };

    expect(selectPersonaMicrocopy(microcopy, 'corporate')).toEqual({ primary: 'Corporate CTA' });
    expect(selectPersonaMicrocopy(microcopy, 'nightlife')).toEqual({ primary: 'Default CTA' });
    expect(selectPersonaMicrocopy(null, 'corporate')).toBeNull();
  });
});
