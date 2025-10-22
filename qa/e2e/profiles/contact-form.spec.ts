import { test, expect } from '@playwright/test';

test.describe('Contact form submission', () => {
  test('submits lead and records analytics', async ({ page }) => {
    await page.goto('/contact');

    await test.step('Fill out required fields', async () => {
      await page.fill('input[name="name"]', 'Test User');
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('textarea[name="message"]', 'Automated contact form test.');
    });

    await test.step('Submit form and wait for success toast', async () => {
      const responsePromise = page.waitForResponse((response) =>
        response.url().includes('/api/contact') && response.request().method() === 'POST'
      );
      await page.getByRole('button', { name: /submit/i }).click();
      await responsePromise;
      await expect(page.getByText(/thank you/i)).toBeVisible();
    });

    await test.step('Analytics lead_submit event dispatched', async () => {
      const eventRequest = await page.waitForRequest((request) =>
        request.url().includes('/api/analytics/events') && request.method() === 'POST'
      );
      expect(eventRequest).toBeTruthy();
    });
  });
});
