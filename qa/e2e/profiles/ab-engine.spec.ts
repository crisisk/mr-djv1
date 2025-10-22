import { test, expect } from '@playwright/test';

test.describe('A/B Engine variants', () => {
  test('renders correct variant and logs analytics', async ({ page }) => {
    await test.step('Navigate to marketing homepage', async () => {
      await page.goto('/');
      await expect(page).toHaveURL(/\/$/);
    });

    await test.step('Ensure variant selector is visible', async () => {
      const variantSwitcher = page.locator('[data-testid="variant-switcher"]');
      await expect(variantSwitcher).toBeVisible();
    });

    await test.step('Validate analytics beacon fires', async () => {
      const analyticsEndpoint = /\/api\/analytics\/events/;
      const [request] = await Promise.all([
        page.waitForRequest((req) => analyticsEndpoint.test(req.url())),
        page.locator('[data-testid="cta-primary"]').click()
      ]);
      expect(request).toBeTruthy();
    });
  });
});
