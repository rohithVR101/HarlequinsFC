import { Page, Locator } from '@playwright/test';

export class Navigation {
  readonly page: Page;
  readonly homeLink: Locator;
  readonly fixturesLink: Locator;
  readonly ticketsLink: Locator;
  readonly stadiumLink: Locator;
  readonly squadLink: Locator;
  readonly clubLink: Locator;
  readonly historyLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.homeLink = page.locator('nav a, header a').filter({ hasText: /Home/i }).first();
    this.fixturesLink = page.locator('nav a, header a').filter({ hasText: /Fixtures/i }).first();
    this.ticketsLink = page.locator('nav a, header a').filter({ hasText: /Tickets/i }).first();
    this.stadiumLink = page.locator('nav a, header a').filter({ hasText: /Stadium/i }).first();
    this.squadLink = page.locator('nav a, header a').filter({ hasText: /Squad/i }).first();
    this.clubLink = page.locator('nav a, header a').filter({ hasText: /Club/i }).first();
    this.historyLink = page.locator('nav a, header a').filter({ hasText: /History/i }).first();
  }

  async gotoHome() {
    await this.page.goto('/');
  }

  async gotoTickets() {
    await this.page.goto('/tickets');
  }

  async gotoMyTickets() {
    await this.page.goto('/tickets/my-tickets');
  }

  async gotoParking() {
    await this.page.goto('/stadium');
  }
}
