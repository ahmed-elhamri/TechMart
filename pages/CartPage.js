import { expect } from '@playwright/test';

export class CartPage {
  constructor(page) {
    this.page = page;

    this.cartTitle = page.getByRole('heading', {
      name: 'Your Shopping Cart',
      exact: true,
    });

    this.checkoutButton = page.getByRole('link', {
      name: 'Proceed to Checkout',
      exact: true
    }).first();

    this.clearCartButton = page.getByRole('button', {
      name: 'Clear Cart',
      exact: true
    }).first();

    this.subtotal = page.locator('#subtotal');
    this.total = page.locator('#total');

    this.emptyCart = page.locator("#emptyCart");
  }

  async open() {
    await this.page.goto('/cart.html');
  }

  async verifyCartPageIsDisplayed() {
    await expect(this.cartTitle).toBeVisible();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async clearCart() {
    await this.clearCartButton.click();
  }

  async verifySubtotal(subtotal) {
    const subtotalText = await this.subtotal.textContent();
    const subtotalValue = parseFloat(subtotalText.replace('$', ''));
    await expect(subtotalValue).toBeCloseTo(subtotal, 2);
  }

  async verifyTotal(total) {
    const totalText = await this.total.textContent();
    const totalValue = parseFloat(totalText.replace('$', ''));
    await expect(totalValue).toBeCloseTo(total, 2);
  }

  async getCartItemById(cartItemId) {
    return this.page.locator(`.cart-item[data-product-id="${cartItemId}"]`);
  }

  async getCartItemImageById(cartItemId) {
    const cartItem = await this.getCartItemById(cartItemId);
    return cartItem.locator('img');
  }

  async getCartItemDetailsById(cartItemId) {
    const cartItem = await this.getCartItemById(cartItemId);
    return cartItem.locator('.item-details');
  }

  async getCartItemNameById(cartItemId) {
    const cartItemDetails = await this.getCartItemDetailsById(cartItemId);
    return cartItemDetails.locator('h3');
  }

  async getCartItemPriceById(cartItemId) {
    const cartItemDetails = await this.getCartItemDetailsById(cartItemId);
    return cartItemDetails.locator('p').nth(0);
  }

  async getCartItemQuantityById(cartItemId) {
    const cartItemQuantity = await this.getCartItemById(cartItemId);
    return cartItemQuantity.locator('.item-quantity');
  }

  async getCartItemRemoveQuantityButtonById(cartItemId) {
    const cartItemQuantity = await this.getCartItemQuantityById(cartItemId);
    return cartItemQuantity.locator('.qty-btn').first();
  }

  async getCartItemQuantityValueById(cartItemId) {
    const cartItemQuantity = await this.getCartItemQuantityById(cartItemId);
    const quantityText = await cartItemQuantity.locator('.qty-value').textContent();
    return parseInt(quantityText);
  }

  async getCartItemAddQuantityButtonById(cartItemId) {
    const cartItemQuantity = await this.getCartItemQuantityById(cartItemId);
    return cartItemQuantity.locator('.qty-btn').last();
  }

  async getCartItemTotalPriceById(cartItemId) {
    const cartItem = await this.getCartItemById(cartItemId);
    const itemTotal = cartItem.locator('.item-total');
    return await itemTotal.textContent();
  }

  async getCartItemRemoveButtonById(cartItemId) {
    const cartItem = await this.getCartItemById(cartItemId);
    return cartItem.locator('.remove-btn');
  }

  async addQuantityToCartItemById(cartItemId) {
    const addButton = await this.getCartItemAddQuantityButtonById(cartItemId);
    await addButton.click();
  }

  async removeQuantityFromCartItemById(cartItemId) {
    const removeButton = await this.getCartItemRemoveQuantityButtonById(cartItemId);
    await removeButton.click();
  }

  async removeCartItemById(cartItemId) {
    const removeButton = await this.getCartItemRemoveButtonById(cartItemId);
    await removeButton.click();
  }

  async verifyCartItemTotalPriceById(cartItemId, expectedTotalPrice) {
    const totalPriceText = await this.getCartItemTotalPriceById(cartItemId);
    const totalPriceValue = parseFloat(totalPriceText.replace('$', ''));
    await expect(totalPriceValue).toBeCloseTo(expectedTotalPrice, 2);
  }

  async verifyCartItemQuantityById(cartItemId, expectedQuantity) {
    const quantityValue = await this.getCartItemQuantityValueById(cartItemId);
    await expect(quantityValue).toBe(expectedQuantity);
  }

  async verifyEmptyCart() {
    const emptyCartMessage = this.emptyCart.locator('p');
    await expect(emptyCartMessage).toBeVisible();
    await expect(emptyCartMessage).toHaveText('Your cart is empty');

    const startShoppingButton = this.emptyCart.locator('a');
    await expect(startShoppingButton).toBeVisible();
    await expect(startShoppingButton).toHaveText('Start Shopping');
  }
}