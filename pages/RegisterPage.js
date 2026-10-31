import { expect } from '@playwright/test';

export class RegisterPage {
  constructor(page) {
    this.page = page;

    this.registerTitle = page.getByRole('heading', {
      name: 'Create Your Account',
      exact: true,
    });

    this.fullNameInput = page.locator('#name');

    this.emailInput = page.locator('#email');

    this.passwordInput = page.locator('#password');

    this.confirmPasswordInput = page.locator('#confirmPassword');

    this.registerButton = page.getByRole('button', { name: 'Create Account' });

    this.errorMessage = page.locator('#errorMessage');

  }

  async open() {
    await this.page.goto('/register.html');
  }

  async verifyRegisterPageIsDisplayed() {
    await expect(this.registerTitle).toBeVisible();
  }

  async fillFullName(fullName) {
    await this.fullNameInput.fill(fullName);
  }

  async fillEmail(email) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password) {
    await this.passwordInput.fill(password);
  }

  async fillConfirmPassword(confirmPassword) {
    await this.confirmPasswordInput.fill(confirmPassword);
  }

  async clickRegisterButton() {
    await this.registerButton.click();
  }

  async verifyErrorMessageIsDisplayed(expectedMessage) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toHaveText(expectedMessage);
  }

  async verifyPasswordMessageIsDisplayed() {
    const actualMessage = await this.passwordInput.evaluate(
      (input) => input.validity.tooShort
    );
    await expect(actualMessage).toBe(true);
  }

  async register(fullName, email, password, confirmPassword) {
    await this.fillFullName(fullName);
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.fillConfirmPassword(confirmPassword);
    await this.clickRegisterButton();
  }

  async registerWithShortPassword(fullName, email, password, confirmPassword) {
    await this.fillFullName(fullName);
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.fillConfirmPassword(confirmPassword);
    await this.clickRegisterButton();
  }
}