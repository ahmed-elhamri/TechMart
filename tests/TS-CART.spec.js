import { test } from "@playwright/test";
import { CartPage } from "../pages/CartPage";
import { CatalogPage } from "../pages/CatalogPage";
import { LoginPage } from "../pages/LoginPage";

test.describe('TS-CART', () => {

  let catalogPage;

  test.beforeEach(async ({ page }) => {
    catalogPage = new CatalogPage(page);
    await catalogPage.open();
  });

  test('[TEC-41] E2E-CART-001 - Ajouter un article', async ({ page }) => {

    await catalogPage.addProductToCart('id', 1);

    await catalogPage.verifyCartCount("1");

  });

  test('[TEC-42] E2E-CART-002 - Afficher le panier', async ({ page }) => {
    const cartPage = new CartPage(page);

    const productPrice = await catalogPage.getProductPrice('id', 1);
    const priceValue = parseFloat(productPrice.replace('$', ''));

    await catalogPage.addProductToCart('id', 1);

    await cartPage.open();

    await cartPage.verifySubtotal(priceValue);
    await cartPage.verifyTotal(priceValue);

  });

  test('[TEC-43] E2E-CART-003 - Ajouter le meme article 3 fois', async ({ page }) => {
    const cartPage = new CartPage(page);

    const productPrice = await catalogPage.getProductPrice('id', 1);
    const priceValue = parseFloat(productPrice.replace('$', ''));

    await catalogPage.addProductToCart('id', 1);
    await catalogPage.addProductToCart('id', 1);
    await catalogPage.addProductToCart('id', 1);

    await cartPage.open();

    await cartPage.verifySubtotal(priceValue * 3);
    await cartPage.verifyTotal(priceValue * 3);

  });

  test('[TEC-44] E2E-CART-004 - Augmenter une quantite', async ({ page }) => {
    const cartPage = new CartPage(page);

    const productPrice = await catalogPage.getProductPrice('id', 1);
    const priceValue = parseFloat(productPrice.replace('$', ''));

    await catalogPage.addProductToCart('id', 1);

    await cartPage.open();

    await cartPage.addQuantityToCartItemById(1);

    await cartPage.verifyCartItemTotalPriceById(1, priceValue * 2);
    await cartPage.verifyCartItemQuantityById(1, 2);

    await cartPage.verifySubtotal(priceValue * 2);
    await cartPage.verifyTotal(priceValue * 2);

  });

  test('[TEC-45] E2E-CART-005 - Diminuer une quantite', async ({ page }) => {
    const cartPage = new CartPage(page);

    const productPrice = await catalogPage.getProductPrice('id', 1);
    const priceValue = parseFloat(productPrice.replace('$', ''));

    await catalogPage.addProductToCart('id', 1);
    await catalogPage.addProductToCart('id', 1);

    await cartPage.open();

    await cartPage.removeQuantityFromCartItemById(1);

    await cartPage.verifyCartItemTotalPriceById(1, priceValue);
    await cartPage.verifyCartItemQuantityById(1, 1);

    await cartPage.verifySubtotal(priceValue);
    await cartPage.verifyTotal(priceValue);

  });

  test('[TEC-46] E2E-CART-006 - Supprimer un article', async ({ page }) => {
    const cartPage = new CartPage(page);

    await catalogPage.addProductToCart('id', 1);

    await cartPage.open();

    await cartPage.removeCartItemById(1);

    await cartPage.verifyEmptyCart();

  });

  test('[TEC-47] E2E-CART-007 - Vider plusieurs articles', async ({ page }) => {
    const cartPage = new CartPage(page);

    await catalogPage.addProductToCart('id', 1);
    await catalogPage.addProductToCart('id', 2);
    await catalogPage.addProductToCart('id', 3);

    await cartPage.open();

    await cartPage.clearCart();

    await cartPage.verifyEmptyCart();

  });

  test('[TEC-48] E2E-CART-008 - Conserver le panier', async ({ page }) => {

    await catalogPage.addProductToCart('id', 1);

    await catalogPage.verifyCartCount("1");

    await catalogPage.goToLoginPage();

    await catalogPage.verifyCartCount("1");

    await catalogPage.open();

    await catalogPage.verifyCartCount("1");

  });

  test('[TEC-49] E2E-CART-009 - Isoler deux paniers', async ({ browser }) => {
    const contextA = await browser.newContext();
    const contextB = await browser.newContext();

    const pageA = await contextA.newPage();
    const pageB = await contextB.newPage();

    const catalogPageA = new CatalogPage(pageA);
    const catalogPageB = new CatalogPage(pageB);

    try {
      await catalogPageA.open();
      await catalogPageA.addProductToCart('id', 1);

      await catalogPageA.verifyCartCount("1");

      await catalogPageB.open();
      await catalogPageB.verifyCartCount("0");

    } finally {
      await contextA.close();
      await contextB.close();
    }
  });

  test('[TEC-50] E2E-CART-010 - Refuser le depassement de stock', async ({ page }) => {

    const productStock = await catalogPage.getProductStock('id', 1);
    const stockText = await productStock.textContent();

    const stockValue = parseInt(await stockText.replace(' in stock', ''));

    for (let i = 0; i <= stockValue; i++) {
      await catalogPage.addProductToCart('id', 1);
    }

    await catalogPage.verifyCartCount(`${stockValue + 1}`);

    await catalogPage.verifyOutOfStockMessageIsDisplayed();
  });
});