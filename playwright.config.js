import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.E2E_PORT || 4177);

const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './tests/e2e',

  fullyParallel: false,

  workers: 1,

  retries: 0,

  timeout: 30_000,

  globalTimeout: 180_000,

  forbidOnly: Boolean(process.env.CI),

  reporter: 'list',

  outputDir: 'test-results/e2e',

  use: {
    baseURL,

    trace: 'retain-on-failure',

    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',

      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],

  webServer: {
    command: 'node scripts/e2e-server.mjs',

    url: `${baseURL}/api/health`,

    timeout: 120_000,

    reuseExistingServer: false,

    stdout: 'pipe',

    stderr: 'pipe',

    env: {
      E2E_PORT: String(port),
    },
  },
});
