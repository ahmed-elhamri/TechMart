import { expect } from '@playwright/test';

export class CatalogPage {
  constructor(page) {
    this.page = page;

    // Locators
    this.welcomeTitle = page.getByRole('heading', {
      name: 'Welcome to TechMart',
      exact: true,
    });

    this.productsTitle = page.getByRole('heading', {
      name: 'Our Products',
      exact: true,
    });

    this.authArea = page.locator('#authArea');
    this.userName = this.authArea.locator('span').first();
    this.logoutButton = this.authArea.locator('button').first();

    this.productsDiv = page.locator('#productGrid');

    this.searchInput = page.getByPlaceholder('Search products...');

    this.searchButton = page.locator("#searchBtn");

    this.cartLink = page.getByRole('link', { name: /Cart/ });

    this.cartCount = page.locator('#cartCount');

    this.loginButton = page.getByRole('link', { name: 'Login' });

    this.signUpButton = page.getByRole('link', { name: 'Sign Up' });

    this.CategoryFilterDropdown = page.locator('#categoryFilter');

    this.priceRange = page.locator('#priceRange');

    this.sortBy = page.locator('#sortBy');

    this.outOfStockMessage = page.locator('.out-of-stock-message');

  }

  async open() {
    await this.page.goto('/');
  }

  async verifyCatalogPageIsDisplayed() {
    await expect(this.welcomeTitle).toBeVisible();
    await expect(this.productsTitle).toBeVisible();
  }

  async verifyProductsAreDisplayed() {
    await expect(this.productsDiv.locator(':scope > *')).toHaveCount(6);
  }

  async verifyUserIsLoggedIn() {
    await expect(this.userName).toBeVisible();
    await expect(this.logoutButton).toBeVisible();
  }

  async verifyUserIsStillLoggedInAfterRefresh() {
    await this.page.reload();
    await expect(this.userName).toBeVisible();
    await expect(this.logoutButton).toBeVisible();
  }

  async logout() {
    await this.logoutButton.click();
  }

  async verifyUserIsLoggedOut() {
    await expect(this.loginButton).toBeVisible();
    await expect(this.signUpButton).toBeVisible();
  }

  async verifyCartCount(expectedCount) {
    await expect(this.cartCount).toHaveText(expectedCount);
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async goToLoginPage() {
    await this.loginButton.click();
  }

  async verifyLoginPageUrl() {
    await expect(this.page).toHaveURL(/.*login.html/);
  }

  async goToRegisterPage() {
    await this.signUpButton.click();
  }

  async verifyRegisterPageUrl() {
    await expect(this.page).toHaveURL(/.*register.html/);
  }

  async getNumberOfProducts() {
    return await this.productsDiv.locator(':scope > *').count();
  }

  async getProduct(type, productId) {
    if (type === 'index') {
      return this.page.locator('.product-card').nth(productId);
    }
    if (type === 'id') {
      return this.page.locator(`.product-card[data-product-id="${productId}"]`);
    }
  }

  async getProductImage(type, productId) {
    const product = await this.getProduct(type, productId);
    return product.locator('img');
  }


  async getProductInfo(type, productId) {
    const product = await this.getProduct(type, productId);
    return product.locator('.product-info');
  }

  async getProductName(type, productId) {
    const productInfo = await this.getProductInfo(type, productId);
    return productInfo.locator('h3');
  }

  async getProductCategory(type, productId) {
    const productInfo = await this.getProductInfo(type, productId);
    return productInfo.locator('p').first();
  }

  async getProductPrice(type, productId) {
    const productInfo = await this.getProductInfo(type, productId);
    return productInfo.locator('p').nth(1).innerText();
  }

  async getProductStock(type, productId) {
    const productInfo = await this.getProductInfo(type, productId);
    return productInfo.locator('p').nth(2);
  }

  async getAddToCartButton(type, productId) {
    const product = await this.getProduct(type, productId);
    return product.locator('button');
  }


  async addProductToCart(type, productId) {
    const firstProductAddToCartButton = await this.getAddToCartButton(type, productId);
    await firstProductAddToCartButton.click();
  }

  async verifyProductIsDisplayed(type, productId) {
    const product = await this.getProduct(type, productId);
    await expect(product).toBeVisible();

    const productImage = await this.getProductImage(type, productId);
    await expect(productImage).toBeVisible();

    const productInfo = await this.getProductInfo(type, productId);
    await expect(productInfo).toBeVisible();
    await expect(productInfo).not.toHaveText('');

    const productName = await this.getProductName(type, productId);
    await expect(productName).toBeVisible();
    await expect(productName).not.toHaveText('');

    const productCategory = await this.getProductCategory(type, productId);
    await expect(productCategory).toBeVisible();
    await expect(productCategory).not.toHaveText('');

    const productPrice = await this.getProductPrice(type, productId);
    expect(productPrice.trim().length).toBeGreaterThan(0);

    const productStock = await this.getProductStock(type, productId);
    await expect(productStock).toBeVisible();
    await expect(productStock).not.toHaveText('');

    const addToCartButton = await this.getAddToCartButton(type, productId);
    await expect(addToCartButton).toBeVisible();
  }

  async searchProductsByClickingButtonSearch(searchTerm) {
    await this.searchInput.fill(searchTerm);
    await this.searchButton.click();
  }

  async searchProductsUsingEnter(searchTerm) {
    await this.searchInput.fill(searchTerm);
    await this.searchInput.press('Enter');
  }

  async verifyProductName(searchTerm) {
    await expect(this.productsDiv.locator('h3')).toContainText(searchTerm);
  }

  async searchAndVerifyProductByButton(searchTerm) {
    await this.searchProductsByClickingButtonSearch(searchTerm);
    await this.verifyProductName(searchTerm);
  }

  async searchAndVerifyProductUsingEnter(searchTerm) {
    await this.searchProductsUsingEnter(searchTerm);
    await this.page.waitForTimeout(500);
    await this.verifyProductName(searchTerm);
  }

  async searchAndVerifyNotFoundProduct(searchTerm) {
    await this.searchProductsByClickingButtonSearch(searchTerm);
    await expect(this.productsDiv).toHaveText('No products found matching your criteria.');
  }

  async verifyEmptySearch() {
    await this.searchProductsByClickingButtonSearch('');
    await this.page.waitForTimeout(500);
    await expect(await this.getNumberOfProducts()).not.toBe(0);
  }

  async filterByCategory(category) {
    await this.CategoryFilterDropdown.selectOption(category);
  }

  async verifyNumberOfFilteredProductsByCategory(category, count) {
    await this.filterByCategory(category);
    await this.page.waitForTimeout(500);
    await expect(await this.getNumberOfProducts()).toBe(count);
  }

  async filterByPriceRange(maxPrice) {
    await this.priceRange.fill(`${maxPrice}`);
    await this.priceRange.press('Enter');
  }

  async verifyPriceRange(type, productId, maxPrice) {
    const productPrice = await this.getProductPrice(type, productId);

    await expect(parseFloat(await productPrice.replace('$', ''))).toBeLessThanOrEqual(maxPrice);
  }

  async sortByOption(option) {
    await this.sortBy.selectOption(option);
  }

  async verifySortedProductsByPrice(type, order) {
    const numberOfProducts = await this.getNumberOfProducts();

    let previousPrice = null;

    for (let i = 0; i < numberOfProducts; i++) {
      const productPrice = await this.getProductPrice(type, i);
      const currentPrice = parseFloat(await productPrice.replace('$', ''));
      if (previousPrice !== null) {
        if (order === 'asc') {
          await expect(currentPrice).toBeGreaterThanOrEqual(previousPrice);
        } else {
          await expect(currentPrice).toBeLessThanOrEqual(previousPrice);
        }
      }
      previousPrice = currentPrice;
    }
  }

  async verifyOutOfStockMessageIsDisplayed() {
    await expect(this.outOfStockMessage).toBeVisible();
    await expect(this.outOfStockMessage).toHaveText('Out of stock');
  }
}
