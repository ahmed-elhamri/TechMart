import { test } from "@playwright/test";
import { CatalogPage } from "../pages/CatalogPage";
import testData from "../data/test-data";


test.describe('TS-CATALOG', () => {

  let catalogPage;

  test.beforeEach(async ({ page }) => {
    catalogPage = new CatalogPage(page);
    await catalogPage.open();
  });

  test('[E2E-CATALOG-001] Afficher les produits', async ({ page }) => {
    const numberOfProducts = await catalogPage.getNumberOfProducts();

    for (let i = 0; i < numberOfProducts; i++) {
      await catalogPage.verifyProductIsDisplayed('index', i);
    }

  });

  test('[E2E-CATALOG-002] Rechercher un produit', async ({ page }) => {

    await catalogPage.searchAndVerifyProductByButton(testData.products.searchTerm);

  });

  test('[E2E-CATALOG-003] Rechercher avec Enter', async ({ page }) => {

    await catalogPage.searchAndVerifyProductUsingEnter(testData.products.searchTerm);

  });

  test('[E2E-CATALOG-004] Recherche sans resultat', async ({ page }) => {

    await catalogPage.searchAndVerifyNotFoundProduct(testData.products.invalidSearchTerm);

  });

  test('[E2E-CATALOG-005] Recherche vide', async ({ page }) => {

    await catalogPage.verifyEmptySearch();

  });

  test('[E2E-CATALOG-006] Filtrer electronics', async ({ page }) => {

    await catalogPage.verifyNumberOfFilteredProductsByCategory(testData.categories.electronics.name, testData.categories.electronics.count);

  });

  test('[E2E-CATALOG-007] Filtrer accessories', async ({ page }) => {

    await catalogPage.verifyNumberOfFilteredProductsByCategory(testData.categories.accessories.name, testData.categories.accessories.count);

  });

  test('[E2E-CATALOG-008] Filtrer par prix', async ({ page }) => {

    await catalogPage.filterByPriceRange(testData.products.maxPrice);

    const numberOfProducts = await catalogPage.getNumberOfProducts();;

    for (let i = 0; i < numberOfProducts; i++) {
      await catalogPage.verifyPriceRange('index', i, testData.products.maxPrice);
    }

  });

  test('[E2E-CATALOG-009] Trier prix croissant', async ({ page }) => {

    await catalogPage.sortByOption('Price: Low to High');

    await catalogPage.verifySortedProductsByPrice('index', 'asc');

  });

  test('[E2E-CATALOG-010] Trier prix decroissant', async ({ page }) => {

    await catalogPage.sortByOption('Price: High to Low');

    await catalogPage.verifySortedProductsByPrice('index', 'desc');

  });

  test('[E2E-CATALOG-011] Combiner les filtres', async ({ page }) => {

    await catalogPage.filterByCategory(testData.categories.electronics.name);

    await catalogPage.filterByPriceRange(80);

    await catalogPage.searchAndVerifyProductByButton('USB');

  });

});