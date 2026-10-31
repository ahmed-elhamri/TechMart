import { expect } from '@playwright/test';

export class CheckoutPage {
  constructor(page) {
    this.page = page;

    this.checkoutTitle = page.getByRole('heading', {
      name: 'Checkout',
      exact: true,
    });

    this.orderItems = page.locator('#orderItems');

    this.getSubtotal = page.locator('#subtotal');

    this.getTax = page.locator('#tax');

    this.getTotal = page.locator('#total');

    this.firstNameInput = page.locator('#firstName');

    this.lastNameInput = page.locator('#lastName');

    this.streetAddressInput = page.locator('#address');

    this.streetAddressInput2 = page.locator('#address2');

    this.cityInput = page.locator('#city');

    this.stateDropdown = page.locator('#state');

    this.zipCodeInput = page.locator('#zip');

    this.phoneNumberInput = page.locator('#phone');

    this.cardNameInput = page.locator('#cardName');

    this.cardNumberInput = page.locator('#cardNumber');

    this.expirationInput = page.locator('#expiry');

    this.cvvInput = page.locator('#cvv');

    this.placeOrderButton = page.getByRole('button', { name: 'Place Order' });

    this.modalContent = page.locator('.modal-content');

    this.modalContentTitle = this.modalContent.locator('h2');

    this.modalContentMessage = this.modalContent.locator('p').first();

    this.modalContentOrderId = this.modalContent.locator('#orderId');

    this.modalContentConfirmationMessage = this.modalContent.locator('p').last();

    this.modalContentContinueShoppingButton = this.modalContent.getByRole('link', { name: 'Continue Shopping' });

    this.outOfStockMessage = page.locator('.out-of-stock-message');
  }

  async open() {
    await this.page.goto('/checkout.html');
  }

  async getOrderItemsCount() {
    return await this.orderItems.locator(':scope > *').count();
  }

  async getOrderItemByIndex(index) {
    return this.orderItems.nth(index);
  }

  async getOrderItemNameByIndex(index) {
    const orderItem = await this.getOrderItemByIndex(index);
    return orderItem.locator('.item-name');
  }

  async getOrderItemPriceByIndex(index) {
    const orderItem = await this.getOrderItemByIndex(index);
    return orderItem.locator('.item-price');
  }


  async verifycheckoutPageIsDisplayed() {
    await expect(this.checkoutTitle).toBeVisible();
  }

  async verifySummaryIsDisplayed() {
    await expect(this.orderItems).toBeVisible();
    await expect(this.getSubtotal).toBeVisible();
    await expect(this.getTax).toBeVisible();
    await expect(this.getTotal).toBeVisible();
  }

  async verifyTax() {
    const subtotalText = await this.getSubtotal.textContent();
    const subtotalValue = parseFloat(subtotalText.replace('$', ''));
    const tax = subtotalValue * 0.08;

    const taxText = await this.getTax.textContent();
    const taxValue = parseFloat(taxText.replace('$', ''));
    await expect(taxValue).toBeCloseTo(tax, 2);
  }

  async verifyFieldValidation(fieldLocator) {
    return await fieldLocator.evaluate((input) => input.validationMessage);
  }

  async verifyFieldIsRequired(fieldLocator) {
    const validationMessage = await this.verifyFieldValidation(fieldLocator);
    return validationMessage === 'Please fill out this field.';
  }

  async verifyFieldIsInvalid(fieldLocator) {
    const validationMessage = await this.verifyFieldValidation(fieldLocator);
    return validationMessage === 'Please match the requested format.';
  }

  async fillFirstName(firstName) {
    await this.firstNameInput.fill(firstName);
  }

  async fillLastName(lastName) {
    await this.lastNameInput.fill(lastName);
  }

  async fillStreetAddress(streetAddress) {
    await this.streetAddressInput.fill(streetAddress);
  }

  async fillStreetAddress2(streetAddress2) {
    await this.streetAddressInput2.fill(streetAddress2);
  }

  async fillCity(city) {
    await this.cityInput.fill(city);
  }

  async fillState(state) {
    await this.stateDropdown.selectOption(state);
  }

  async fillZipCode(zipCode) {
    await this.zipCodeInput.fill(zipCode);
  }

  async fillPhoneNumber(phoneNumber) {
    await this.phoneNumberInput.fill(phoneNumber);
  }

  async fillCardholderName(cardholderName) {
    await this.cardNameInput.fill(cardholderName);
  }

  async fillCardNumber(cardNumber) {
    await this.cardNumberInput.fill(cardNumber);
  }

  async verifyCardNumberFormat() {
    const cardNumberValue = await this.cardNumberInput.inputValue();
    console.log('Card Number Value:', cardNumberValue);
    const cardNumberPattern = /^\d{4} \d{4} \d{4} \d{4}$/;
    await expect(cardNumberValue).toMatch(cardNumberPattern);
  }

  async fillExpiryDate(expiryDate) {
    await this.expirationInput.fill(expiryDate);
  }

  async verifyExpiryDateFormat() {
    const expiryDateValue = await this.expirationInput.inputValue();
    console.log('Expiry Date Value:', expiryDateValue);
    const expiryDatePattern = /^\d{2}\/\d{2}$/;
    await expect(expiryDateValue).toMatch(expiryDatePattern);
  }

  async fillCVV(cvv) {
    await this.cvvInput.fill(cvv);
  }

  async fillShippingInformation(firstName, lastName, streetAddress, streetAddress2, city, state, zipCode, phoneNumber) {
    await this.fillFirstName(firstName);
    await this.fillLastName(lastName);
    await this.fillStreetAddress(streetAddress);
    await this.fillStreetAddress2(streetAddress2);
    await this.fillCity(city);
    await this.fillState(state);
    await this.fillZipCode(zipCode);
    await this.fillPhoneNumber(phoneNumber);
  }

  async fillPaymentInformation(cardholderName, cardNumber, expiryDate, cvv) {
    await this.fillCardholderName(cardholderName);
    await this.fillCardNumber(cardNumber);
    await this.fillExpiryDate(expiryDate);
    await this.fillCVV(cvv);
  }

  async clickPlaceOrderButton() {
    await this.placeOrderButton.click();
  }

  async multiFastClickPlaceOrderButton() {
    await this.placeOrderButton.click({
      clickCount: 3,
      delay: 50
    });
  }

  async verifyOrderConfirmationModalIsDisplayed() {
    await expect(this.modalContent).toBeVisible();
    await expect(this.modalContentTitle).toBeVisible();
    await expect(this.modalContentMessage).toBeVisible();
    await expect(this.modalContentOrderId).toBeVisible();
    await expect(this.modalContentOrderId).not.toBeEmpty();
    await expect(this.modalContentConfirmationMessage).toBeVisible();
    await expect(this.modalContentContinueShoppingButton).toBeVisible();
  }

  async verifyOrderConfirationModalIsNotDisplayed() {
    await expect(this.modalContent).not.toBeVisible();
  }

  async verifyStockAfterConfirmation(stockBefore, boughtQuantity, expectedStock) {
    await expect(expectedStock).toBe(stockBefore - boughtQuantity);
  }

  async verifyOutOfStockMessageIsDisplayed() {
    await expect(this.outOfStockMessage).toBeVisible();
    await expect(this.outOfStockMessage).toHaveText('Out of stock');
  }

}