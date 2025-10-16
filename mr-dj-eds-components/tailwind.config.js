import tokens from './src/lib/design-tokens.json' assert { type: 'json' };

const convertTokens = (tokenSet) => {
  const colors = {};
  const spacing = {};
  const fontFamily = {};
  const fontSize = {};

  for (const [group, values] of Object.entries(tokenSet.color)) {
    for (const [name, value] of Object.entries(values)) {
      if (value.value) {
        colors[`${group}-${name}`] = value.value;
      } else {
        for (const [shade, shadeValue] of Object.entries(value)) {
          colors[`${group}-${name}-${shade}`] = shadeValue.value;
        }
      }
    }
  }

  for (const [key, value] of Object.entries(tokenSet.spacing)) {
    spacing[key] = value.value;
  }

  for (const [key, value] of Object.entries(tokenSet.font.family)) {
    fontFamily[key] = value.value.split(',').map((item) => item.trim());
  }

  for (const [key, value] of Object.entries(tokenSet.font.size)) {
    fontSize[key] = value.value;
  }

  return { colors, spacing, fontFamily, fontSize };
};

const { colors, spacing, fontFamily, fontSize } = convertTokens(tokens);

export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ...colors,
        primary: 'var(--color-primary-blue)',
        secondary: 'var(--color-secondary-gold)',
        success: 'var(--color-semantic-success)',
        destructive: 'var(--color-semantic-error)',
        warning: 'var(--color-semantic-warning)',
        'neutral-light': 'var(--color-neutral-light)',
        'neutral-dark': 'var(--color-neutral-dark)',
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
  plugins: [],
};
