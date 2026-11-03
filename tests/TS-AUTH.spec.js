import { test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { CatalogPage } from "../pages/CatalogPage";
import testData from "../data/test-data";

test.describe('TS-AUTH', () => {

  test('[TEC-51] E2E-AUTH-001 - Afficher le formulaire login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();

    await loginPage.verifyLoginFormIsDisplayed();
  });

  test('[TEC-52] E2E-AUTH-002 - Login valide', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const catalogPage = new CatalogPage(page);

    await loginPage.open();

    await loginPage.login(testData.login.valid.email, testData.login.valid.password);

    await catalogPage.verifyUserIsLoggedIn();
  });

  test('[TEC-53] E2E-AUTH-003 - Login invalide', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();

    await loginPage.login(testData.login.invalid.email, testData.login.invalid.password);

    await loginPage.verifyErrorMessageIsDisplayed(testData.login.errorMessages.invalidCredentials);
  });

  test('[TEC-54] E2E-AUTH-004 - Champs login obligatoires', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();

    await loginPage.fillEmail('');
    await loginPage.clickLoginButton();
    await loginPage.verifyEmailMessageIsDisplayed(testData.login.errorMessages.requiredEmailMessage);

    await loginPage.fillEmail(testData.login.valid.email);
    await loginPage.fillPassword('');
    await loginPage.clickLoginButton();
    await loginPage.verifyPasswordMessageIsDisplayed(testData.login.errorMessages.requiredPasswordMessage);
  });

  test('[TEC-55] E2E-AUTH-005 - Inscription valide', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const catalogPage = new CatalogPage(page);

    await registerPage.open();
    await registerPage.register(
      testData.register.fullName,
      testData.register.email,
      testData.register.password,
      testData.register.confirmPassword
    );

    await catalogPage.verifyUserIsLoggedIn();

  });

  test('[TEC-56] E2E-AUTH-006 - Mots de passe differents', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    await registerPage.open();
    await registerPage.register(
      testData.register.fullName,
      testData.register.email,
      testData.register.password,
      testData.register.differentPassword
    );

    await registerPage.verifyErrorMessageIsDisplayed(testData.register.errorMessages.passwordMismatch);

  });

  test('[TEC-57] E2E-AUTH-007 - Email deja utilise', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    await registerPage.open();
    await registerPage.register(
      testData.register.fullName,
      testData.login.valid.email,
      testData.register.password,
      testData.register.confirmPassword
    );

    await registerPage.verifyErrorMessageIsDisplayed(testData.register.errorMessages.emailAlreadyRegistered);

  });

  test('[TEC-58] E2E-AUTH-008 - Mot de passe trop court', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    await registerPage.open();
    await registerPage.registerWithShortPassword(
      testData.register.fullName,
      testData.register.email,
      testData.register.shortPassword,
      testData.register.shortPassword
    );

    await registerPage.verifyPasswordMessageIsDisplayed();

  });

  test('[TEC-59] E2E-AUTH-009 - Logout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const catalogPage = new CatalogPage(page);

    await loginPage.open();

    await loginPage.login(testData.login.valid.email, testData.login.valid.password);

    await catalogPage.verifyUserIsLoggedIn();

    await catalogPage.logout();

    await catalogPage.verifyUserIsLoggedOut();
  });

  test('[TEC-60] E2E-AUTH-010 - Session apres actualisation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const catalogPage = new CatalogPage(page);

    await loginPage.open();

    await loginPage.login(testData.login.valid.email, testData.login.valid.password);

    await catalogPage.verifyUserIsLoggedIn();

    await catalogPage.verifyUserIsStillLoggedInAfterRefresh();
  });

  test('[TEC-61] E2E-AUTH-011 - Separation UI/session', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const catalogPage = new CatalogPage(page);

    await loginPage.open();

    await loginPage.login(testData.login.valid.email, testData.login.valid.password);

    await catalogPage.verifyUserIsLoggedIn();

    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    await page.reload();

    await catalogPage.verifyUserIsLoggedOut();
  });
});





