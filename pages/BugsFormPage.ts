import { Page, Locator } from '@playwright/test';

export class BugsFormPage {
  readonly page: Page;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly phone: Locator;
  readonly country: Locator;
  readonly email: Locator;
  readonly password: Locator;
  readonly terms: Locator;
  readonly registerBtn: Locator;
  readonly message: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstName = page.locator('#firstName');
    this.lastName = page.locator('#lastName');
    this.phone = page.locator('#phone');
    this.country = page.locator('#countries_dropdown_menu');
    this.email = page.locator('#emailAddress');
    this.password = page.locator('#password');
    this.terms = page.locator('#exampleCheck1');
    this.registerBtn = page.locator('#registerBtn');
    this.message = page.locator('#message');
  }

  async fillForm(data: {
    firstName: string;
    lastName: string;
    phone: string;
    country: string;
    email: string;
    password: string;
  }) {
    await this.firstName.fill(data.firstName);
    await this.lastName.fill(data.lastName);
    await this.phone.fill(data.phone);
    await this.country.selectOption({ label: data.country });
    await this.email.fill(data.email);
    await this.password.fill(data.password);
  }

  async clickRegister() {
    await this.registerBtn.click();
  }

  async getErrorMessage() {
    return this.message.textContent();
  }
}