/** @type {import('tailwindcss').Config} */
import tokens from "./frontend/src/theme/tokens.json" assert { type: "json" };

// Function to convert design tokens to Tailwind format
const convertTokens = (tokens) => {
  const toKebabCase = (value) =>
    value
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .replace(/\s+/g, "-")
      .toLowerCase();

// Function to convert design tokens to Tailwind format
const convertTokens = (themeTokens) => {
  const colors = {};
  const spacing = Object.fromEntries(
    Object.entries(themeTokens.spacing).map(([name, size]) => [name, toRem(size)]),
  );
  const fontFamily = {};
  const fontSize = { ...themeTokens.typography.fontSize };
  const fontWeight = { ...themeTokens.typography.fontWeight };
  const lineHeight = { ...themeTokens.typography.lineHeight };

  for (const [group, entries] of Object.entries(tokens.colors)) {
    if (typeof entries === "string") {
      colors[group] = entries;
      continue;
    }

    for (const [name, hex] of Object.entries(entries)) {
      colors[`${group}-${toKebabCase(name)}`] = hex;
    }
  }

  for (const [name, family] of Object.entries(tokens.typography.fontFamily)) {
    fontFamily[name] = family.split(",").map((part) => part.trim().replace(/^['"]|['"]$/g, ""));
  }

  return {
    colors,
    spacing,
    fontFamily,
    fontSize,
    fontWeight,
    lineHeight,
  };
};

const { colors, spacing, fontFamily, fontSize, fontWeight, lineHeight } = convertTokens(tokens);

const additionalSpacing = {
  gutter: 'clamp(1.5rem, 3vw, 3rem)',
  'section-sm': 'clamp(3rem, 6vw, 4.5rem)',
  'section-lg': 'clamp(4.5rem, 8vw, 6.5rem)',
};

const borderRadius = {
  xs: '0.25rem',
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
  '3xl': '2rem',
  pill: '999px',
  card: '1.25rem',
  full: '9999px',
};

const boxShadow = {
  subtle: '0 1px 2px 0 rgba(26, 44, 75, 0.06), 0 1px 3px 1px rgba(26, 44, 75, 0.08)',
  soft: '0 12px 30px -12px rgba(0, 174, 239, 0.25)',
  strong: '0 20px 45px -15px rgba(26, 44, 75, 0.35)',
  focus: '0 0 0 4px rgba(0, 174, 239, 0.35)',
  inset: 'inset 0 1px 2px rgba(26, 44, 75, 0.08)',
};

const augmentedFontFamily = {
  ...fontFamily,
  sans: ['var(--font-inter)', ...(fontFamily.primary ?? []), 'system-ui', 'sans-serif'],
  serif: ['var(--font-playfair)', 'Georgia', 'serif'],
  display: ['var(--font-playfair)', ...(fontFamily.heading ?? []), 'serif'],
};

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: 'clamp(1.5rem, 4vw, 2.5rem)',
        lg: 'clamp(2rem, 5vw, 3.5rem)',
        '2xl': 'clamp(2.5rem, 6vw, 4.5rem)',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1440px',
      },
    },
    extend: {
      colors: {
        ...colors,
        primary: colors["primary-main"],
        "primary-dark": colors["primary-dark"],
        secondary: colors["secondary-main"],
        success: colors["semantic-success"],
        warning: colors["semantic-warning"],
        destructive: colors["semantic-error"],
        "neutral-gray-300": colors["neutral-gray300"],
      },
      spacing: {
        ...spacing,
        ...additionalSpacing,
      },
      fontFamily: {
        ...augmentedFontFamily,
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
      borderRadius: {
        ...borderRadius,
      },
      boxShadow: {
        ...boxShadow,
      },
    },
  },
  plugins: [
    // require('tailwindcss-animate'), // Temporarily comment out as it might need an ES import or be removed if not needed
  ],
};
