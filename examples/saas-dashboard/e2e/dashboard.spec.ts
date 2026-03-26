import { expect, test } from '@playwright/test';

test('theme and density persist across reloads', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Theme').selectOption('dark');
  await page.getByLabel('Density').selectOption('compact');

  await expect(page.locator('.app-shell')).toHaveAttribute(
    'data-theme',
    'dark'
  );
  await page.reload();

  await expect(page.getByLabel('Theme')).toHaveValue('dark');
  await expect(page.getByLabel('Density')).toHaveValue('compact');
});

test('reduced motion simulation disables transitions', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Simulate reduced motion' }).click();
  await expect(
    page.locator('[data-adaptive-surface="dashboard.home"]')
  ).toHaveAttribute('data-transition-mode', 'none');
});

test('persona simulation changes the visible hero variant', async ({
  page
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Expert analyst' }).click();
  await expect(
    page.getByText('Power surface tuned for analysis')
  ).toBeVisible();

  await page.getByRole('button', { name: 'Novice manager' }).click();
  await expect(
    page.getByText('Start with the signal, not the noise')
  ).toBeVisible();
});

test('devtools panel stays visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByLabel('Adaptive UI devtools')).toBeVisible();
  await expect(page.getByText('Adaptive UI Devtools')).toBeVisible();
});

test('manual override does not steal focus', async ({ page }) => {
  await page.goto('/');
  const density = page.getByLabel('Density');
  await density.focus();
  await expect(density).toBeFocused();
  await density.selectOption('comfortable');
  await expect(density).toBeFocused();
});
