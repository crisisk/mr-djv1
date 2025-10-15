/** @type {import('tailwindcss').Config} */
<<<<<<< HEAD
const tokens = require('./src/lib/design-tokens.json');
=======
import tokens from './src/lib/design-tokens.json' assert { type: 'json' };
>>>>>>> a17057fd1b60325dffe5679689a8e8abbbe39b4d

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

<<<<<<< HEAD
module.exports = {
=======
export default {
>>>>>>> a17057fd1b60325dffe5679689a8e8abbbe39b4d
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
    },
  },
  plugins: [
<<<<<<< HEAD
    require('tailwindcss-animate'),
=======
    // require('tailwindcss-animate'), // Temporarily comment out as it might need an ES import or be removed if not needed
>>>>>>> a17057fd1b60325dffe5679689a8e8abbbe39b4d
  ],
}

