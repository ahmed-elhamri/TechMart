import { test } from "@playwright/test";
import { CatalogPage } from "../pages/CatalogPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import testData from "../data/test-data";


test.describe('TS-CHECKOUT', () => {

  test('[TEC-62] E2E-CHECKOUT-001 - Redirection panier vide', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    const cartPage = new CartPage(page);

    await checkoutPage.open();

    await cartPage.verifyCartPageIsDisplayed();

  });

  test('[TEC-63] E2E-CHECKOUT-002 - Afficher le resume checkout', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    const catalogPage = new CatalogPage(page);

    await catalogPage.open();
    await catalogPage.addProductToCart('id', 1);

    await checkoutPage.open();

    await checkoutPage.verifySummaryIsDisplayed();

  });

  test('[TEC-64] E2E-CHECKOUT-003 - Calculer la taxe', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    const catalogPage = new CatalogPage(page);

    await catalogPage.open();
    await catalogPage.addProductToCart('id', 1);

    await checkoutPage.open();

    await checkoutPage.verifyTax();

  });

  test('[TEC-65] E2E-CHECKOUT-004 - Formater la carte', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    const catalogPage = new CatalogPage(page);

    await catalogPage.open();
    await catalogPage.addProductToCart('id', 1);

    await checkoutPage.open();

    await checkoutPage.fillCardNumber(testData.paymentInfo.cardNumber);

    await checkoutPage.verifyCardNumberFormat();

  });

  test('[TEC-66] E2E-CHECKOUT-005 - Formater l\'expiration', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    const catalogPage = new CatalogPage(page);

    await catalogPage.open();
    await catalogPage.addProductToCart('id', 1);

    await checkoutPage.open();

    await checkoutPage.fillExpiryDate(testData.paymentInfo.expiryDate);

    await checkoutPage.verifyExpiryDateFormat();

  });

  test('[TEC-67] E2E-CHECKOUT-006 - Champs checkout requis', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    const catalogPage = new CatalogPage(page);

    await catalogPage.open();
    await catalogPage.addProductToCart('id', 1);

    await checkoutPage.open();

    await checkoutPage.clickPlaceOrderButton();

    await checkoutPage.verifyFieldIsRequired(checkoutPage.firstNameInput);
    await checkoutPage.fillFirstName(testData.shippingInfo.firstName);
    await checkoutPage.clickPlaceOrderButton();

    await checkoutPage.verifyFieldIsRequired(checkoutPage.lastNameInput);
    await checkoutPage.fillLastName(testData.shippingInfo.lastName);
    await checkoutPage.clickPlaceOrderButton();

    await checkoutPage.verifyFieldIsRequired(checkoutPage.streetAddressInput);
    await checkoutPage.fillStreetAddress(testData.shippingInfo.streetAddress);
    await checkoutPage.clickPlaceOrderButton();

    await checkoutPage.verifyFieldIsRequired(checkoutPage.cityInput);
    await checkoutPage.fillCity(testData.shippingInfo.city);
    await checkoutPage.clickPlaceOrderButton();

    await checkoutPage.verifyFieldIsRequired(checkoutPage.stateDropdown);
    await checkoutPage.fillState(testData.shippingInfo.state);
    await checkoutPage.clickPlaceOrderButton();

    await checkoutPage.verifyFieldIsRequired(checkoutPage.zipCodeInput);
    await checkoutPage.fillZipCode(testData.shippingInfo.zipCode);
    await checkoutPage.clickPlaceOrderButton();

    await checkoutPage.verifyFieldIsRequired(checkoutPage.phoneNumberInput);
    await checkoutPage.fillPhoneNumber(testData.shippingInfo.phoneNumber);
    await checkoutPage.clickPlaceOrderButton();

    await checkoutPage.verifyFieldIsRequired(checkoutPage.cardNameInput);
    await checkoutPage.fillCardholderName(testData.paymentInfo.cardholderName);
    await checkoutPage.clickPlaceOrderButton();

    await checkoutPage.verifyFieldIsRequired(checkoutPage.cardNumberInput);
    await checkoutPage.fillCardNumber(testData.paymentInfo.cardNumber);
    await checkoutPage.clickPlaceOrderButton();

    await checkoutPage.verifyFieldIsRequired(checkoutPage.expirationInput);
    await checkoutPage.fillExpiryDate(testData.paymentInfo.expiryDate);
    await checkoutPage.clickPlaceOrderButton();

    await checkoutPage.verifyFieldIsRequired(checkoutPage.cvvInput);
    await checkoutPage.fillCVV(testData.paymentInfo.cvv);
    await checkoutPage.clickPlaceOrderButton();
  });

  test('[TEC-68] E2E-CHECKOUT-007 - ZIP invalide', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    const catalogPage = new CatalogPage(page);

    await catalogPage.open();
    await catalogPage.addProductToCart('id', 1);

    await checkoutPage.open();

    await checkoutPage.clickPlaceOrderButton();

    await checkoutPage.fillFirstName(testData.shippingInfo.firstName);

    await checkoutPage.fillLastName(testData.shippingInfo.lastName);

    await checkoutPage.fillStreetAddress(testData.shippingInfo.streetAddress);

    await checkoutPage.fillCity(testData.shippingInfo.city);

    await checkoutPage.fillState(testData.shippingInfo.state);

    await checkoutPage.fillZipCode(testData.shippingInfo.invalidZipCode);
    await checkoutPage.clickPlaceOrderButton();
    await checkoutPage.verifyFieldIsInvalid(checkoutPage.zipCodeInput);
  });

  test('[TEC-69] E2E-CHECKOUT-008 - Passer une commande', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    const catalogPage = new CatalogPage(page);

    await catalogPage.open();
    await catalogPage.addProductToCart('id', 1);

    await checkoutPage.open();

    await checkoutPage.fillShippingInformation(
      testData.shippingInfo.firstName,
      testData.shippingInfo.lastName,
      testData.shippingInfo.streetAddress,
      testData.shippingInfo.streetAddress2,
      testData.shippingInfo.city,
      testData.shippingInfo.state,
      testData.shippingInfo.zipCode,
      testData.shippingInfo.phoneNumber
    );

    await checkoutPage.fillPaymentInformation(
      testData.paymentInfo.cardholderName,
      testData.paymentInfo.cardNumber,
      testData.paymentInfo.expiryDate,
      testData.paymentInfo.cvv
    );

    await checkoutPage.clickPlaceOrderButton();

    await checkoutPage.verifyOrderConfirmationModalIsDisplayed();

  });

  test('[TEC-70] E2E-CHECKOUT-009 - Vider apres commande', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    const catalogPage = new CatalogPage(page);
    const cartPage = new CartPage(page);

    await catalogPage.open();
    await catalogPage.addProductToCart('id', 1);

    await checkoutPage.open();

    await checkoutPage.fillShippingInformation(
      testData.shippingInfo.firstName,
      testData.shippingInfo.lastName,
      testData.shippingInfo.streetAddress,
      testData.shippingInfo.streetAddress2,
      testData.shippingInfo.city,
      testData.shippingInfo.state,
      testData.shippingInfo.zipCode,
      testData.shippingInfo.phoneNumber
    );

    await checkoutPage.fillPaymentInformation(
      testData.paymentInfo.cardholderName,
      testData.paymentInfo.cardNumber,
      testData.paymentInfo.expiryDate,
      testData.paymentInfo.cvv
    );

    await checkoutPage.clickPlaceOrderButton();

    cartPage.open();
    await cartPage.verifyEmptyCart();

  });

  test('[TEC-71] E2E-CHECKOUT-010 - Decrementer le stock', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    const catalogPage = new CatalogPage(page);

    await catalogPage.open();
    const productStockBefore = await catalogPage.getProductStock("id", 2);
    const productStockBeforeText = await productStockBefore.textContent();
    const productStockBeforeValue = Number(productStockBeforeText.match(/\d+/)?.[0]);

    await catalogPage.addProductToCart('id', 2);

    await checkoutPage.open();

    const quantity = await checkoutPage.getOrderItemNameByIndex(0);
    const quantityText = await quantity.textContent();
    const quantityValue = Number(quantityText.match(/\d+/)?.[0]);

    await checkoutPage.fillShippingInformation(
      testData.shippingInfo.firstName,
      testData.shippingInfo.lastName,
      testData.shippingInfo.streetAddress,
      testData.shippingInfo.streetAddress2,
      testData.shippingInfo.city,
      testData.shippingInfo.state,
      testData.shippingInfo.zipCode,
      testData.shippingInfo.phoneNumber
    );

    await checkoutPage.fillPaymentInformation(
      testData.paymentInfo.cardholderName,
      testData.paymentInfo.cardNumber,
      testData.paymentInfo.expiryDate,
      testData.paymentInfo.cvv
    );

    await checkoutPage.clickPlaceOrderButton();

    catalogPage.open();

    const productStockAfter = await catalogPage.getProductStock("id", 2);
    const productStockAfterText = await productStockAfter.textContent();
    const productStockAfterValue = Number(productStockAfterText.match(/\d+/)?.[0]);

    await checkoutPage.verifyStockAfterConfirmation(productStockBeforeValue, quantityValue, productStockAfterValue);

  });

  test('[TEC-72] E2E-CHECKOUT-011 - Eviter double commande', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    const catalogPage = new CatalogPage(page);

    await catalogPage.open();
    const productStockBefore = await catalogPage.getProductStock("id", 5);
    const productStockBeforeText = await productStockBefore.textContent();
    const productStockBeforeValue = Number(productStockBeforeText.match(/\d+/)?.[0]);

    await catalogPage.addProductToCart('id', 5);

    await checkoutPage.open();

    const quantity = await checkoutPage.getOrderItemNameByIndex(0);
    const quantityText = await quantity.textContent();
    const quantityValue = Number(quantityText.match(/\d+/)?.[0]);

    await checkoutPage.fillShippingInformation(
      testData.shippingInfo.firstName,
      testData.shippingInfo.lastName,
      testData.shippingInfo.streetAddress,
      testData.shippingInfo.streetAddress2,
      testData.shippingInfo.city,
      testData.shippingInfo.state,
      testData.shippingInfo.zipCode,
      testData.shippingInfo.phoneNumber
    );

    await checkoutPage.fillPaymentInformation(
      testData.paymentInfo.cardholderName,
      testData.paymentInfo.cardNumber,
      testData.paymentInfo.expiryDate,
      testData.paymentInfo.cvv
    );

    await checkoutPage.multiFastClickPlaceOrderButton();

    await checkoutPage.verifyOrderConfirmationModalIsDisplayed();


    catalogPage.open();

    const productStockAfter = await catalogPage.getProductStock("id", 5);
    const productStockAfterText = await productStockAfter.textContent();
    const productStockAfterValue = Number(productStockAfterText.match(/\d+/)?.[0]);

    await checkoutPage.verifyStockAfterConfirmation(productStockBeforeValue, quantityValue, productStockAfterValue);

  });

  test('[TEC-73] E2E-CHECKOUT-012 - Stock insuffisant checkout ', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    const catalogPage = new CatalogPage(page);

    await catalogPage.open();
    const productStockBefore = await catalogPage.getProductStock("id", 1);
    const productStockBeforeText = await productStockBefore.textContent();
    const productStockBeforeValue = Number(productStockBeforeText.match(/\d+/)?.[0]);

    for (let i = 0; i <= productStockBeforeValue; i++) {
      await catalogPage.addProductToCart('id', 1);
    }

    await checkoutPage.open();

    const quantity = await checkoutPage.getOrderItemNameByIndex(0);
    const quantityText = await quantity.textContent();
    const quantityValue = Number(quantityText.match(/\d+/)?.[0]);

    await checkoutPage.fillShippingInformation(
      testData.shippingInfo.firstName,
      testData.shippingInfo.lastName,
      testData.shippingInfo.streetAddress,
      testData.shippingInfo.streetAddress2,
      testData.shippingInfo.city,
      testData.shippingInfo.state,
      testData.shippingInfo.zipCode,
      testData.shippingInfo.phoneNumber
    );

    await checkoutPage.fillPaymentInformation(
      testData.paymentInfo.cardholderName,
      testData.paymentInfo.cardNumber,
      testData.paymentInfo.expiryDate,
      testData.paymentInfo.cvv
    );

    await checkoutPage.clickPlaceOrderButton();

    await checkoutPage.verifyOrderConfirationModalIsNotDisplayed();

    await checkoutPage.verifyOutOfStockMessageIsDisplayed();

  });

});





