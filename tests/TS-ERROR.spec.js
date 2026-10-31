import { expect, test } from "@playwright/test";





test.describe('TS-ERROR', () => {

  test('[E2E-ERR-001] Erreur catalogue HTTP 500', async ({ page }) => {
    await page.route('**/api/products', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Internal Server Error'
        })
      });
    });

    // Ouvrir la page après avoir configuré l'interception
    await page.goto('/');

    // Vérifier que la page est ouverte
    await expect(page).toHaveURL(/\/$/);
  });


});





