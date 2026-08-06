import { Page, Locator } from '@playwright/test';

export class MyTicketsPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly ticketCards: Locator;
  readonly cancelTicketButtons: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('h1, h2').filter({ hasText: /My Tickets/i }).first();
    this.ticketCards = page.locator('.mantine-Card-root');
    this.cancelTicketButtons = page.locator('button').filter({ hasText: /Cancel Ticket/i });
  }

  async goto() {
    await this.page.goto('/tickets/my-tickets');
  }

  async cancelFirstTicket() {
    if (await this.cancelTicketButtons.count() > 0) {
      await this.cancelTicketButtons.first().click();
    }
  }
}
