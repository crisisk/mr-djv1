/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tailwindConfig from './tailwind.config.js';
import path from 'path';

// https://vite.dev/config/
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { visualizer } from 'rollup-plugin-visualizer';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const shouldAnalyze = process.env.ANALYZE === 'true';

const plugins = [react(), tailwindcss({ config: tailwindConfig })];

if (shouldAnalyze) {
  const analyzePlugin = visualizer({
    filename: path.resolve(dirname, 'bundle-report.html'),
    template: 'treemap',
    gzipSize: true,
    brotliSize: true,
    open: false
  });
  analyzePlugin.apply = 'build';
  plugins.push(analyzePlugin);
}

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins,
  resolve: {
    alias: {
      '@': path.resolve(dirname, './src')
    }
  },
  test: {
    projects: [{
      extends: true,
      plugins: [
        // The plugin will run tests for the stories defined in your Storybook config
        // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
        storybookTest({
          configDir: path.join(dirname, '.storybook')
        })
      ],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: 'playwright',
          instances: [{
            browser: 'chromium'
          }]
        },
        setupFiles: ['.storybook/vitest.setup.js']
      }
    }]
  }
});
