
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./app/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
    "./lib/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1920px', // Full HD
      '4xl': '2560px', // 2K
      '5xl': '3840px', // 4K UHD
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        '2xl': '4rem',
        '3xl': '6rem',
        '4xl': '8rem',
        '5xl': '10rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1200px', // Container max-width from tokens
        '2xl': '1200px',
        '3xl': '1400px',
        '4xl': '1600px',
        '5xl': '1800px',
      },
    },
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'ui-sans-serif', 'system-ui'],
        body: ['var(--font-body)', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        // EDS Primary Colors
        primary: {
          DEFAULT: 'var(--color-primary-blue)',
          blue: 'var(--color-primary-blue)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary-gold)',
          gold: 'var(--color-secondary-gold)',
        },
        brand: {
          50: 'var(--color-brand-50)',
          100: 'var(--color-brand-100)',
          200: 'var(--color-brand-200)',
          300: 'var(--color-brand-300)',
          400: 'var(--color-brand-400)',
          500: 'var(--color-brand-500)',
          600: 'var(--color-brand-600)',
          700: 'var(--color-brand-700)',
          800: 'var(--color-brand-800)',
          900: 'var(--color-brand-900)',
        },
        accent: {
          gold: 'var(--color-accent-gold)',
          rose: 'var(--color-accent-rose)',
        },
        // EDS Neutral Colors
        neutral: {
          dark: 'var(--color-neutral-dark)',
          light: 'var(--color-neutral-light)',
          gray: {
            100: 'var(--color-neutral-gray-100)',
            500: 'var(--color-neutral-gray-500)',
          },
        },
        gray: {
          50: 'var(--color-gray-50)',
          100: 'var(--color-gray-100)',
          200: 'var(--color-gray-200)',
          300: 'var(--color-gray-300)',
          400: 'var(--color-gray-400)',
          500: 'var(--color-gray-500)',
          600: 'var(--color-gray-600)',
          700: 'var(--color-gray-700)',
          800: 'var(--color-gray-800)',
          900: 'var(--color-gray-900)',
        },
        surface: {
          bg: 'var(--surface-bg)',
          card: 'var(--surface-card)',
          muted: 'var(--surface-muted)',
        },
        text: {
          DEFAULT: 'var(--color-text)',
          muted: 'var(--color-text-muted)',
          onBrand: 'var(--color-text-onBrand)',
        },
        state: {
          success: 'var(--color-state-success)',
          warning: 'var(--color-state-warning)',
          error: 'var(--color-state-error)',
          info: 'var(--color-state-info)',
          focus: 'var(--color-state-focus)',
        },
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius-md)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      spacing: {
        // EDS Spacing Tokens (8px unit system)
        'spacing-unit': 'var(--spacing-unit)',
        'spacing-xs': 'var(--spacing-xs)',
        'spacing-sm': 'var(--spacing-sm)',
        'spacing-md': 'var(--spacing-md)',
        'spacing-lg': 'var(--spacing-lg)',
        'spacing-xl': 'var(--spacing-xl)',
        'spacing-2xl': 'var(--spacing-2xl)',
        'spacing-3xl': 'var(--spacing-3xl)',
        // Legacy aliases
        xs: 'var(--spacing-xs)',
        sm: 'var(--spacing-sm)',
        md: 'var(--spacing-md)',
        lg: 'var(--spacing-lg)',
        xl: 'var(--spacing-xl)',
        '2xl': 'var(--spacing-2xl)',
        '3xl': 'var(--spacing-3xl)',
      },
      fontSize: {
        // EDS Typography Scale
        'font-size-h1': 'var(--font-size-h1)',
        'font-size-h2': 'var(--font-size-h2)',
        'font-size-h3': 'var(--font-size-h3)',
        'font-size-body': 'var(--font-size-body)',
        'font-size-small': 'var(--font-size-small)',
        'font-size-display': 'var(--font-size-display)',
      },
    },
  },
  plugins: [],
};

export default config;
