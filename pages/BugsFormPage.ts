import { Locator, Page } from '@playwright/test';

export class BugsFormPage {
  readonly page: Page;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly phone: Locator;
  readonly email: Locator;
  readonly password: Locator;
  readonly country: Locator;
  readonly terms: Locator;
  readonly registerBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstName = page.getByLabel(/First Name/i);
    this.lastName = page.getByLabel(/Last Name/i);
    this.phone = page.getByLabel(/Phone/i);
    this.email = page.getByLabel(/Email address/i);
    this.password = page.getByLabel(/Password/i);
    this.country = page.locator('select');
    this.terms = page.locator('input[type="checkbox"]');
    this.registerBtn = page.locator('button:has-text("Register")');
  }

  async goto() {
    await this.page.goto('https://qa-practice.netlify.app/bugs-form');
  }

  async fillBasicInfo(data: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    password: string;
    country?: string;
    acceptTerms?: boolean;
  }) {
    const { firstName, lastName, phone, email, password, country, acceptTerms } = data;
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.phone.fill(phone);
    await this.email.fill(email);
    await this.password.fill(password);
    if (country) await this.country.selectOption({ label: country });
    if (acceptTerms) await this.terms.check();
  }

  async submit() {
    await this.registerBtn.click();
  }

  async isValidField(locator: Locator) {
    return await locator.evaluate((el: HTMLInputElement | HTMLSelectElement) => el.checkValidity());
  }
}
