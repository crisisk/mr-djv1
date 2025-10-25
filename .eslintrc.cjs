module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  ignorePatterns: [
    'frontend/src/components/Generated/**/*',
    'backend/**/*',
    'scripts/**/*',
    'tests/**/*',
    'mr-dj-eds-components/**/*',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        project: ['./frontend/tsconfig.json'],
      },
    },
    'import/core-modules': ['virtual:pwa-register', 'structured-data-testing-tool'],
  },
  plugins: [
    'react',
    'react-hooks',
    'jsx-a11y',
    'import',
    '@typescript-eslint',
    'react-refresh',
  ],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'import/default': 'off',
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
    'import/namespace': 'off',
    'react-refresh/only-export-components': 'off',
    'import/order': [
      'warn',
      {
        'newlines-between': 'always',
        groups: [
          ['builtin', 'external'],
          ['internal'],
          ['parent', 'sibling', 'index'],
          ['object', 'type'],
        ],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: ['plugin:@typescript-eslint/recommended'],
    },
    {
      files: ['*.cjs'],
      parserOptions: {
        sourceType: 'script',
      },
    },
    {
      files: ['**/tests/**/*.{js,jsx,ts,tsx}'],
      env: {
        jest: true,
      },
    },
  ],
};
