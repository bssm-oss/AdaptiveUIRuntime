import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './examples/saas-dashboard/e2e',
  timeout: 30_000,
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'on-first-retry'
  },
  webServer: {
    command:
      'PATH=/opt/homebrew/bin:/usr/bin:/bin:$PATH pnpm --filter ./examples/saas-dashboard dev --host 127.0.0.1 --port 4173',
    reuseExistingServer: true,
    timeout: 120_000,
    url: 'http://127.0.0.1:4173'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
