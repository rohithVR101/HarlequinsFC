import { test, expect } from '@playwright/test';

test.describe('Authentication Flow Suite', () => {
  test('should render login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h1, h2, h3').filter({ hasText: /Sign In|Login|Welcome/i }).first()).toBeVisible();
  });
});
