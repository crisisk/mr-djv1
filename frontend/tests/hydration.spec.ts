import { test, expect } from "@playwright/test";

test("home hydrate zonder fouten", async ({ page }) => {
  let hydrationError: Error | null = null;
  page.on("pageerror", (event) => {
    if (String(event.message).toLowerCase().includes("hydration")) {
      hydrationError = event;
    }
  });

  await page.goto("/");
  await expect(page.getByRole("heading")).toBeVisible();

  if (hydrationError) {
    throw hydrationError;
  }
});
