import { VisualTestHelper } from './visual-test-helper';

describe('Button Component Visual Tests', () => {
  beforeEach(async () => {
    await page.goto('http://localhost:3000/components/button');
  });

  it('should match primary button snapshot', async () => {
    await VisualTestHelper.takeSnapshot({
      name: 'Primary Button - Default State',
      viewport: { width: 1280, height: 800 },
      waitForSelector: '.button-primary',
    });
  });

  it('should match button states across different viewports', async () => {
    const viewports = [
      { width: 375, height: 667 },  // Mobile
      { width: 768, height: 1024 }, // Tablet
      { width: 1280, height: 800 }, // Desktop
    ];

    for (const viewport of viewports) {
      await VisualTestHelper.takeSnapshot({
        name: `Button States - ${viewport.width}px`,
        viewport,
        waitForSelector: '.button-container',
      });

      // Test hover state
      await page.hover('.button-primary');
      await VisualTestHelper.takeSnapshot({
        name: `Button Hover State - ${viewport.width}px`,
        viewport,
      });
    }
  });
});
