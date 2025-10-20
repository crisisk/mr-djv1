import { describe, expect, it } from 'vitest';
import tokens from './design-tokens.json';

const expectedFontSizes = {
  h1: { value: '48px', type: 'fontSize' },
  h2: { value: '36px', type: 'fontSize' },
  h3: { value: '28px', type: 'fontSize' },
  h4: { value: '20px', type: 'fontSize' },
  h5: { value: '16px', type: 'fontSize' },
  bodyLarge: { value: '18px', type: 'fontSize' },
  body: { value: '16px', type: 'fontSize' },
  caption: { value: '12px', type: 'fontSize' },
  small: { value: '14px', type: 'fontSize' },
};

const expectedFontWeights = {
  h1: { value: '900', type: 'fontWeight' },
  h2: { value: '800', type: 'fontWeight' },
  h3: { value: '800', type: 'fontWeight' },
  h4: { value: '700', type: 'fontWeight' },
  h5: { value: '700', type: 'fontWeight' },
  bodyLarge: { value: '400', type: 'fontWeight' },
  body: { value: '400', type: 'fontWeight' },
  caption: { value: '600', type: 'fontWeight' },
};

describe('design tokens', () => {
  it('exposes documented font sizes', () => {
    expect(tokens.font.size).toMatchObject(expectedFontSizes);
  });

  it('exposes documented font weights', () => {
    expect(tokens.font.weight).toMatchObject(expectedFontWeights);
  });

  it('keeps size and weight definitions in sync', () => {
    const sizeKeysWithWeights = Object.keys(tokens.font.size).filter((key) => key !== 'small');
    expect(Object.keys(tokens.font.weight).sort()).toEqual(sizeKeysWithWeights.sort());
  });
});
