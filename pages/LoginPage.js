import { expect } from '@playwright/test';

export class LoginPage {
  constructor(page) {
    this.page = page;

    this.loginTitle = page.getByRole('heading', {
      name: 'Login to TechMart',
      exact: true,
    });

    this.emailInput = page.locator('#email');

    this.passwordInput = page.locator('#password');

    this.loginButton = page.getByRole('button', { name: 'Login' });

    this.errorMessage = page.locator('#errorMessage');

    this.demoCredentials = page.locator('.demo-credentials');


  }

  async open() {
    await this.page.goto('/login.html');
  }

  async verifyLoginPageIsDisplayed() {
    await expect(this.loginTitle).toBeVisible();
  }

  async verifyLoginFormIsDisplayed() {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
    await expect(this.demoCredentials).toBeVisible();
  }

  async fillEmail(email) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password) {
    await this.passwordInput.fill(password);
  }

  async clickLoginButton() {
    await this.loginButton.click();
  }

  async login(email, password) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.loginButton.click();
  }

  async verifyErrorMessageIsDisplayed(expectedMessage) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toHaveText(expectedMessage);
  }

  async verifyEmailMessageIsDisplayed(expectedMessage) {
    const actualMessage = await this.emailInput.evaluate(
      (input) => input.validationMessage
    );
    await expect(actualMessage).toBe(expectedMessage);
  }

  async verifyPasswordMessageIsDisplayed(expectedMessage) {
    const actualMessage = await this.passwordInput.evaluate(
      (input) => input.validationMessage
    );
    await expect(actualMessage).toContain(expectedMessage);
  }
}