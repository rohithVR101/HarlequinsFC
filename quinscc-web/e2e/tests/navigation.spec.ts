import { test, expect } from '@playwright/test';
import { Navigation } from '../fixtures/pages/Navigation';

test.describe('Global Navigation Flow', () => {
  test('should navigate between core pages without errors', async ({ page }) => {
    const nav = new Navigation(page);

    await nav.gotoHome();
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1, h2').first()).toBeVisible();

    await nav.gotoTickets();
    await expect(page).toHaveURL('/tickets');
    await expect(page.locator('h1, h2').filter({ hasText: /Match Tickets/i })).toBeVisible();

    await nav.gotoParking();
    await expect(page).toHaveURL(/\/stadium|\/parking/);
  });
});
