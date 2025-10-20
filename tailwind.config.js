/** @type {import('tailwindcss').Config} */
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
    // require('tailwindcss-animate'), // Temporarily comment out as it might need an ES import or be removed if not needed
  ],
}

