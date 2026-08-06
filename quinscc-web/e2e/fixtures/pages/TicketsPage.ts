import { Page, Locator } from '@playwright/test';

export class TicketsPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly myTicketsButton: Locator;
  readonly buyTicketsButtons: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('h1, h2').filter({ hasText: /Match Tickets/i }).first();
    this.myTicketsButton = page.locator('a, button').filter({ hasText: /My Tickets/i }).first();
    this.buyTicketsButtons = page.locator('button').filter({ hasText: /Buy Tickets/i });
  }

  async goto() {
    await this.page.goto('/tickets');
  }

  async clickBuyTicketsForFirstFixture() {
    await this.buyTicketsButtons.first().click();
  }

  async clickMyTickets() {
    await this.myTicketsButton.click();
  }
}
