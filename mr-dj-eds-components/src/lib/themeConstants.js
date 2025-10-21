import tokens from './design-tokens.json';

const parsePxValue = (value) => {
  if (typeof value !== 'string') {
    return 0;
  }

  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const createSpacingCalc = (cssVariable, multiplier) => `calc(var(${cssVariable}) * ${multiplier})`;

const spacingUnitValue = tokens?.spacing?.unit ? parsePxValue(tokens.spacing.unit.value) : 8;
const spacingMdValue = tokens?.spacing?.md ? parsePxValue(tokens.spacing.md.value) : spacingUnitValue * 2;

export const STICKY_BOOKING_CTA_CONSTANTS = {
  desktopInset: 'var(--spacing-xl)',
  zIndex: 1000,
  hiddenTranslateY: createSpacingCalc('--spacing-md', 6),
  mobilePadding: 'var(--spacing-md)',
  buttonPaddingY: 'var(--spacing-md)',
  buttonPaddingX: 'var(--spacing-xl)',
  buttonRadius: 'var(--spacing-xl)',
  scrollRevealThreshold: spacingUnitValue * 36,
};

export const SPACING_UNIT_PX = spacingUnitValue;
export const SPACING_MD_PX = spacingMdValue;
