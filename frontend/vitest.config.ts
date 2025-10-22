import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), svgr()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    css: true,
    include: [
      'src/__tests__/GeneratedContent.test.tsx',
      'src/__tests__/QuickBookingForm.test.tsx',
      'src/__tests__/ExitIntentPopup.test.tsx',
      'src/utils/__tests__/**/*.{test,spec}.?(c|m)[jt]s?(x)',
    ],
  },
});
