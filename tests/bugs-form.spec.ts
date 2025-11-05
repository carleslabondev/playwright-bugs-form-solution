import { test, expect } from '@playwright/test';
import { BugsFormPage } from '../pages/BugsFormPage';

test.describe('Bugs Form (POM) — QA Practice', () => {
  let form: BugsFormPage;

  test.beforeEach(async ({ page }) => {
    form = new BugsFormPage(page);
    await form.goto();
  });

  test('should validate required fields when empty', async () => {
    await form.submit();

    expect(await form.isValidField(form.firstName)).toBe(false);
    expect(await form.isValidField(form.lastName)).toBe(false);
    expect(await form.isValidField(form.phone)).toBe(false);
    expect(await form.isValidField(form.email)).toBe(false);
    expect(await form.isValidField(form.password)).toBe(false);
  });

  test('should validate phone number length', async () => {
    await form.phone.fill('12345');
    await form.submit();
    expect(await form.isValidField(form.phone)).toBe(false);

    await form.phone.fill('09123456789');
    expect(await form.isValidField(form.phone)).toBe(true);
  });

  test('should require terms acceptance before submit', async () => {
    await form.fillBasicInfo({
      firstName: 'John',
      lastName: 'Doe',
      phone: '09123456789',
      email: 'john@example.com',
      password: '123456',
      country: 'Philippines',
      acceptTerms: false
    });

    await form.submit();
    expect(await form.terms.isChecked()).toBe(false);

    await form.terms.check();
    expect(await form.terms.isChecked()).toBe(true);
  });

  test('should submit successfully with valid data', async () => {
    await form.fillBasicInfo({
      firstName: 'Alice',
      lastName: 'Tester',
      phone: '09123456789',
      email: 'alice.tester@example.com',
      password: 'secret123',
      country: 'Philippines',
      acceptTerms: true
    });

    await form.submit();
    expect(await form.isValidField(form.email)).toBe(true);
  });
});
