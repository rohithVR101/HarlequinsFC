import { test, expect } from '@playwright/test';
import { TicketsPage } from '../fixtures/pages/TicketsPage';
import { MyTicketsPage } from '../fixtures/pages/MyTicketsPage';

test.describe('Tickets Feature Suite', () => {
  test('should display ticket availability and allow viewing tickets page', async ({ page }) => {
    const ticketsPage = new TicketsPage(page);
    await ticketsPage.goto();

    await expect(ticketsPage.pageTitle).toBeVisible();
    await expect(ticketsPage.buyTicketsButtons.first()).toBeVisible();
  });

  test('should redirect unauthenticated user to login when clicking buy tickets', async ({ page }) => {
    const ticketsPage = new TicketsPage(page);
    await ticketsPage.goto();

    await ticketsPage.clickBuyTicketsForFirstFixture();
    await expect(page).toHaveURL(/\/login/);
  });

  test('should allow authenticated navigation to my tickets page', async ({ page }) => {
    const myTicketsPage = new MyTicketsPage(page);
    await myTicketsPage.goto();

    await expect(page).toHaveURL(/\/tickets\/my-tickets/);
  });
});
