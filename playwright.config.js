import { defineConfig, devices } from '@playwright/test';

export default defineConfig({

  testDir: './tests',

  // Exécution
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // Timeouts
  timeout: 30_000,

  expect: {
    timeout: 5_000,
  },

  // Rapports
  reporter: [
    ['html', {
      outputFolder: 'playwright-report',
      open: 'never'
    }],
    ['junit', {
      outputFile: 'junit-results.xml'
    }]
  ],

  // Configuration commune
  use: {
    baseURL: 'http://127.0.0.1:3001',

    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    actionTimeout: 10_000,
    navigationTimeout: 15_000,
  },

  // Navigateurs
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Démarrage automatique
  webServer: {
    command: 'npm start',
    url: 'http://127.0.0.1:3001/api/health',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});