/** @type {import('tailwindcss').Config} */
import tokens from './src/lib/design-tokens.json' assert { type: 'json' };

// Function to convert design tokens to Tailwind format
const convertTokens = (tokens) => {
  const colors = {};
  const spacing = {};
  const fontFamily = {};
  const fontSize = {};

  // Color conversion
  for (const [key, value] of Object.entries(tokens.color)) {
    for (const [subKey, subValue] of Object.entries(value)) {
      if (subValue.value) {
        colors[`${key}-${subKey}`] = subValue.value;
      } else {
        for (const [shade, shadeValue] of Object.entries(subValue)) {
          colors[`${key}-${subKey}-${shade}`] = shadeValue.value;
        }
      }
    }
  }

  // Spacing conversion (using the 8pt system)
  for (const [key, value] of Object.entries(tokens.spacing)) {
    spacing[key] = value.value;
  }

  // Font conversion
  for (const [key, value] of Object.entries(tokens.font.family)) {
    fontFamily[key] = [value.value.split(',')[0].trim(), ...value.value.split(',').slice(1).map(s => s.trim())];
  }
  for (const [key, value] of Object.entries(tokens.font.size)) {
    fontSize[key] = value.value;
  }

  return { colors, spacing, fontFamily, fontSize };
};

const { colors, spacing, fontFamily, fontSize } = convertTokens(tokens);

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ...colors,
        // Map the new tokens to the existing Tailwind color names for compatibility
        'primary': 'var(--color-primary-blue)',
        'secondary': 'var(--color-secondary-gold)',
        'destructive': 'var(--color-semantic-error)',
        'success': 'var(--color-semantic-success)',
        'warning': 'var(--color-semantic-warning)',
        // Add specific color utilities
        'neutral-dark': 'var(--color-neutral-dark)',
        'neutral-light': 'var(--color-neutral-light)',
        'neutral-gray-100': 'var(--color-neutral-gray-100)',
        'neutral-gray-500': 'var(--color-neutral-gray-500)',
      },
      spacing: {
        ...spacing,
        // Add specific spacing utilities with correct names
        'spacing-xs': 'var(--spacing-xs)',
        'spacing-sm': 'var(--spacing-sm)',
        'spacing-md': 'var(--spacing-md)',
        'spacing-lg': 'var(--spacing-lg)',
        'spacing-xl': 'var(--spacing-xl)',
        'spacing-2xl': 'var(--spacing-2xl)',
        'spacing-3xl': 'var(--spacing-3xl)',
      },
      fontSize: {
        ...fontSize,
        // Add specific font-size utilities with correct names
        'font-size-h1': 'var(--font-size-h1)',
        'font-size-h2': 'var(--font-size-h2)',
        'font-size-h3': 'var(--font-size-h3)',
        'font-size-body': 'var(--font-size-body)',
        'font-size-small': 'var(--font-size-small)',
      },
    },
  },
  plugins: [
    function({ matchUtilities, theme }) {
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
        { values: {
          'xs': 'var(--spacing-xs)',
          'sm': 'var(--spacing-sm)',
          'md': 'var(--spacing-md)',
          'lg': 'var(--spacing-lg)',
          'xl': 'var(--spacing-xl)',
          '2xl': 'var(--spacing-2xl)',
          '3xl': 'var(--spacing-3xl)',
        }}
      );

      // Generate custom font-size utilities (text-font-size-*)
      matchUtilities(
        {
          'text-font-size': (value) => ({ fontSize: value }),
        },
        { values: {
          'h1': 'var(--font-size-h1)',
          'h2': 'var(--font-size-h2)',
          'h3': 'var(--font-size-h3)',
          'body': 'var(--font-size-body)',
          'small': 'var(--font-size-small)',
        }}
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
        { values: {
          'xs': 'var(--spacing-xs)',
          'sm': 'var(--spacing-sm)',
          'md': 'var(--spacing-md)',
          'lg': 'var(--spacing-lg)',
          'xl': 'var(--spacing-xl)',
          '2xl': 'var(--spacing-2xl)',
          '3xl': 'var(--spacing-3xl)',
        }}
      );
    },
  ],
}
