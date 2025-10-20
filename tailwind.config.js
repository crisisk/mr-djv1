/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin';
import tokens from './frontend/src/theme/tokens.json' assert { type: 'json' };

// Function to convert design tokens to Tailwind format
const convertTokens = (tokens) => {
  const toKebabCase = (value) => value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();

  const colors = {};
  const spacing = { ...tokens.spacing };
  const fontFamily = {};
  const fontSize = { ...tokens.typography.fontSize };
  const fontWeight = { ...tokens.typography.fontWeight };
  const lineHeight = { ...tokens.typography.lineHeight };

  for (const [group, entries] of Object.entries(tokens.colors)) {
    if (typeof entries === 'string') {
      colors[group] = entries;
      continue;
    }

    for (const [name, hex] of Object.entries(entries)) {
      colors[`${group}-${toKebabCase(name)}`] = hex;
    }
  }

  for (const [name, family] of Object.entries(tokens.typography.fontFamily)) {
    fontFamily[name] = family.split(',').map((part) => part.trim().replace(/^['"]|['"]$/g, ''));
  }

  return { colors, spacing, fontFamily, fontSize, fontWeight, lineHeight };
};

const { colors, spacing, fontFamily, fontSize, fontWeight, lineHeight } = convertTokens(tokens);

export default {
  content: [
    './frontend/index.html',
    './frontend/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ...colors,
        primary: colors['primary-main'],
        'primary-dark': colors['primary-dark'],
        secondary: colors['secondary-main'],
        success: colors['semantic-success'],
        warning: colors['semantic-warning'],
        destructive: colors['semantic-error'],
        'neutral-gray-300': colors['neutral-gray300'],
      },
      spacing: {
        ...spacing,
      },
      fontFamily: {
        ...fontFamily,
      },
      fontSize: {
        ...fontSize,
      },
      fontWeight: {
        ...fontWeight,
      },
      lineHeight: {
        ...lineHeight,
      },
    },
  },
  plugins: [
    plugin(({ addComponents, theme }) => {
      const toFontFamily = (value) => {
        if (!value) {
          return undefined;
        }

        return Array.isArray(value) ? value.join(', ') : value;
      };

      const headingFamily =
        toFontFamily(theme('fontFamily.heading')) ?? toFontFamily(theme('fontFamily.primary'));
      const bodyFamily = toFontFamily(theme('fontFamily.primary')) ?? headingFamily;

      addComponents({
        '.heading-1': {
          fontFamily: headingFamily,
          fontSize: theme('fontSize.heading1'),
          lineHeight: theme('lineHeight.tight'),
          fontWeight: theme('fontWeight.black') ?? theme('fontWeight.extrabold'),
          letterSpacing: '-0.015em',
        },
        '.heading-2': {
          fontFamily: headingFamily,
          fontSize: theme('fontSize.heading2'),
          lineHeight: theme('lineHeight.snug'),
          fontWeight: theme('fontWeight.extrabold'),
          letterSpacing: '-0.01em',
        },
        '.heading-3': {
          fontFamily: headingFamily,
          fontSize: theme('fontSize.heading3'),
          lineHeight: theme('lineHeight.snug'),
          fontWeight: theme('fontWeight.extrabold'),
          letterSpacing: '-0.005em',
        },
        '.heading-4': {
          fontFamily: headingFamily,
          fontSize: theme('fontSize.heading4'),
          lineHeight: theme('lineHeight.normal'),
          fontWeight: theme('fontWeight.semibold') ?? theme('fontWeight.bold'),
        },
        '.heading-5': {
          fontFamily: headingFamily,
          fontSize: theme('fontSize.heading5'),
          lineHeight: theme('lineHeight.normal'),
          fontWeight: theme('fontWeight.semibold') ?? theme('fontWeight.bold'),
        },
        '.body-lg': {
          fontFamily: bodyFamily,
          fontSize: theme('fontSize.bodyLg'),
          lineHeight: theme('lineHeight.relaxed'),
          fontWeight: theme('fontWeight.regular'),
        },
        '.body-base': {
          fontFamily: bodyFamily,
          fontSize: theme('fontSize.body'),
          lineHeight: theme('lineHeight.relaxed'),
          fontWeight: theme('fontWeight.regular'),
        },
        '.body-sm': {
          fontFamily: bodyFamily,
          fontSize: theme('fontSize.bodySm'),
          lineHeight: theme('lineHeight.relaxed'),
          fontWeight: theme('fontWeight.regular'),
        },
        '.caption': {
          fontFamily: bodyFamily,
          fontSize: theme('fontSize.caption'),
          lineHeight: theme('lineHeight.normal'),
          fontWeight: theme('fontWeight.semibold') ?? theme('fontWeight.medium'),
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        },
      });
    }),
    // require('tailwindcss-animate'), // Temporarily comment out as it might need an ES import or be removed if not needed
  ],
}

