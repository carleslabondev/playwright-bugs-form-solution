import { test, expect } from '@playwright/test';
import { BugsFormPage } from '../pages/BugsFormPage';

test.describe('QA Practice - Bugs Form Tests', () => {
  let bugsFormPage: BugsFormPage;

  const validFormData = {
    firstName: 'John',
    lastName: 'Doe',
    phone: '09171234567',
    country: 'Philippines',
    email: 'john.doe@example.com',
    password: 'Password123!',
  };

  test.beforeEach(async ({ page }) => {
    bugsFormPage = new BugsFormPage(page);
    await page.goto('https://qa-practice.netlify.app/bugs-form');
  });

  test('should successfully submit form with valid details', async ({ page }) => {
    await bugsFormPage.fillForm(validFormData);

    // terms checkbox is disabled, so skip interaction
    await bugsFormPage.clickRegister();

    // verify success message or navigation
    const message = await bugsFormPage.getErrorMessage();
    expect(message).toContain('Success');
  });

  test('should show error for missing required fields', async ({ page }) => {
    await bugsFormPage.clickRegister();

    const message = await bugsFormPage.getErrorMessage();
    expect(message).toContain('The password should contain between [6,20] characters!');
  });

  test('should show error for short password', async ({ page }) => {
    await bugsFormPage.fillForm({
      firstName: 'Alice',
      lastName: 'Brown',
      phone: '09181231234',
      country: 'Philippines',
      email: 'alice@example.com',
      password: '123',
    });

    await bugsFormPage.clickRegister();

    const message = await bugsFormPage.getErrorMessage();
    expect(message).toContain('The password should contain between [6,20] characters!');
  });

  test('should show error for invalid phone number', async ({ page }) => {
    await bugsFormPage.fillForm({
      firstName: 'Bob',
      lastName: 'Marley',
      phone: 'abcde',
      country: 'Philippines',
      email: 'bob@example.com',
      password: 'Password123!',
    });

    await bugsFormPage.clickRegister();

    const message = await bugsFormPage.getErrorMessage();
    expect(message).toContain('The phone number should contain at least 10 characters!');
  });

  test('should detect label typo in Phone number field', async ({ page }) => {
    const phoneLabel = await page.locator('label[for="lastName"]').nth(1).textContent();
    expect(phoneLabel).toContain('nunber');
  });

  test('should detect mismatch between entered and displayed Last Name', async ({ page }) => {
    await bugsFormPage.fillForm(validFormData);
    await bugsFormPage.clickRegister();

    const displayedLastName = await page.locator('#resultLn').textContent();
    expect(displayedLastName?.trim()).not.toContain(validFormData.lastName);
    expect(displayedLastName?.trim()).toContain('Do'); // known wrong value
  });

  test('should detect mismatch between entered and displayed Phone Number', async ({ page }) => {
    await bugsFormPage.fillForm(validFormData);
    await bugsFormPage.clickRegister();

    const displayedPhone = await page.locator('#resultPhone').textContent();
    expect(displayedPhone?.trim()).not.toContain(validFormData.phone);
    expect(displayedPhone?.trim()).toContain('09171234568'); // known wrong value
  });

  test('should detect mismatch between entered and displayed Country', async ({ page }) => {
    await bugsFormPage.fillForm(validFormData);
    await bugsFormPage.clickRegister();

    const displayedCountry = await page.locator('#country').textContent();
    expect(displayedCountry?.trim()).not.toContain(validFormData.country);
    expect(displayedCountry?.trim()).toContain('Phillipines'); // known wrong spelling
  });
});