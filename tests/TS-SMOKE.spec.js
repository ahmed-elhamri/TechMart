import { test } from "@playwright/test";
import { CatalogPage } from "../pages/CatalogPage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";





test.describe('TS-SMOKE', () => {

  test('E2E-SMOKE-001 - Charger l\'accueil', async ({ page }) => {
    const catalogPage = new CatalogPage(page);

    await catalogPage.open();
    await catalogPage.verifyCatalogPageIsDisplayed();
    await catalogPage.verifyCartCount("0");
    await catalogPage.verifyProductsAreDisplayed();
  });

  test('E2E-SMOKE-002 - Ouvrir les pages principales', async ({ page }) => {
    const catalogPage = new CatalogPage(page);
    const loginPage = new LoginPage(page);
    const registerPage = new RegisterPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.open();
    await loginPage.verifyLoginPageIsDisplayed();

    await registerPage.open();
    await registerPage.verifyRegisterPageIsDisplayed();

    await catalogPage.open();
    await catalogPage.addProductToCart('id', 3);

    await cartPage.open();
    await cartPage.verifyCartPageIsDisplayed();
    await cartPage.proceedToCheckout();

    await checkoutPage.open();
    await checkoutPage.verifycheckoutPageIsDisplayed();

  });

  test('E2E-SMOKE-003 - Naviguer vers le panier', async ({ page }) => {

    const catalogPage = new CatalogPage(page);
    const cartPage = new CartPage(page);

    await catalogPage.open();
    await catalogPage.goToCart();
    await cartPage.verifyCartPageIsDisplayed();

  });


  test('E2E-SMOKE-004 - Naviguer login/register', async ({ page }) => {

    const catalogPage = new CatalogPage(page);

    await catalogPage.open();

    await catalogPage.goToLoginPage();
    await catalogPage.verifyLoginPageUrl();

    await catalogPage.goToRegisterPage();
    await catalogPage.verifyRegisterPageUrl();
  });
});





