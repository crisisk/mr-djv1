/** @type {import('tailwindcss').Config} */
import tokens from './src/theme/tokens.js';

const toKebabCase = (value) => value
  .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
  .replace(/\s+/g, '-')
  .toLowerCase();

// Function to convert design tokens to Tailwind format
const convertTokens = (tokens) => {
  const colors = {};
  const spacing = { ...tokens.spacing };
  const fontFamily = {};
  const fontSize = { ...tokens.typography.fontSize };
  const lineHeight = { ...tokens.typography.lineHeight };
  const fontWeight = { ...tokens.typography.fontWeight };

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

  return { colors, spacing, fontFamily, fontSize, lineHeight, fontWeight };
};

const { colors, spacing, fontFamily, fontSize, lineHeight, fontWeight } = convertTokens(tokens);

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
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
        'neutral-dark': colors['neutral-dark'],
        'neutral-light': colors['neutral-light'],
        'neutral-gray-100': colors['neutral-gray100'],
        'neutral-gray-300': colors['neutral-gray300'],
        'neutral-gray-500': colors['neutral-gray500'],
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
      lineHeight: {
        ...lineHeight,
      },
      fontWeight: {
        ...fontWeight,
      },
    },
  },
  plugins: [
    function({ matchUtilities }) {
      // Generate custom spacing utilities (py-spacing-*, px-spacing-*, etc)
      matchUtilities(
        {
          'p-spacing': (value) => ({ padding: value }),
          'py-spacing': (value) => ({ paddingTop: value, paddingBottom: value }),
          'px-spacing': (value) => ({ paddingLeft: value, paddingRight: value }),
          'pt-spacing': (value) => ({ paddingTop: value }),
          'pr-spacing': (value) => ({ paddingRight: value }),
          'pb-spacing': (value) => ({ paddingBottom: value }),
          'pl-spacing': (value) => ({ paddingLeft: value }),
          'm-spacing': (value) => ({ margin: value }),
          'my-spacing': (value) => ({ marginTop: value, marginBottom: value }),
          'mx-spacing': (value) => ({ marginLeft: value, marginRight: value }),
          'mt-spacing': (value) => ({ marginTop: value }),
          'mr-spacing': (value) => ({ marginRight: value }),
          'mb-spacing': (value) => ({ marginBottom: value }),
          'ml-spacing': (value) => ({ marginLeft: value }),
          'gap-spacing': (value) => ({ gap: value }),
        },
        { values: spacing }
      );

      // Generate custom font-size utilities (text-font-size-*)
      matchUtilities(
        {
          'text-font-size': (value) => ({ fontSize: value }),
        },
        { values: fontSize }
      );

      // Generate space-x-spacing-* and space-y-spacing-* utilities
      matchUtilities(
        {
          'space-x-spacing': (value) => ({
            '& > :not([hidden]) ~ :not([hidden])': {
              '--tw-space-x-reverse': '0',
              marginRight: `calc(${value} * var(--tw-space-x-reverse))`,
              marginLeft: `calc(${value} * calc(1 - var(--tw-space-x-reverse)))`,
            },
          }),
          'space-y-spacing': (value) => ({
            '& > :not([hidden]) ~ :not([hidden])': {
              '--tw-space-y-reverse': '0',
              marginTop: `calc(${value} * calc(1 - var(--tw-space-y-reverse)))`,
              marginBottom: `calc(${value} * var(--tw-space-y-reverse))`,
            },
          }),
        },
        { values: spacing }
      );
    },
  ],
}
