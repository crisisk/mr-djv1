import { test, expect } from '@playwright/test';

test.describe('Analytics dashboard', () => {
  test('shows variant performance metrics', async ({ page }) => {
    await page.goto('/dashboard');

    await test.step('Authenticate when prompted', async () => {
      if (await page.locator('input[name="email"]').isVisible()) {
        await page.fill('input[name="email"]', process.env.E2E_DASHBOARD_EMAIL ?? 'demo@example.com');
        await page.fill('input[name="password"]', process.env.E2E_DASHBOARD_PASSWORD ?? 'P@ssword123');
        await page.getByRole('button', { name: /sign in/i }).click();
      }
    });

    await test.step('Verify performance tiles render', async () => {
      await expect(page.locator('[data-testid="ctr-metric"]')).toBeVisible();
      await expect(page.locator('[data-testid="conversion-chart"]')).toBeVisible();
    });

    await test.step('Switch time range and ensure data updates', async () => {
      await page.getByRole('button', { name: /last 30 days/i }).click();
      await expect(page.locator('[data-testid="event-feed"]')).toContainText('Variant');
    });
  });
});
