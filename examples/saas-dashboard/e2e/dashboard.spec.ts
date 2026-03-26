import { expect, test } from '@playwright/test';

test('theme and density persist across reloads', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('테마').selectOption('dark');
  await page.getByLabel('밀도').selectOption('compact');

  await expect(page.locator('.app-shell')).toHaveAttribute(
    'data-theme',
    'dark'
  );
  await page.reload();

  await expect(page.getByLabel('테마')).toHaveValue('dark');
  await expect(page.getByLabel('밀도')).toHaveValue('compact');
});

test('reduced motion simulation disables transitions', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '모션 감소 시뮬레이션' }).click();
  await expect(
    page.locator('[data-adaptive-surface="dashboard.home"]')
  ).toHaveAttribute('data-transition-mode', 'none');
});

test('persona simulation changes the visible hero variant', async ({
  page
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: '숙련 분석가' }).click();
  await expect(page.getByText('분석 작업에 맞춘 파워 화면')).toBeVisible();

  await page.getByRole('button', { name: '초보 관리자' }).click();
  await expect(
    page.getByText('신호부터 먼저 보도록 정리된 화면')
  ).toBeVisible();
});

test('devtools panel stays visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByLabel('Adaptive UI 개발 도구')).toBeVisible();
  await expect(page.getByText('Adaptive UI 개발 도구')).toBeVisible();
});

test('manual override does not steal focus', async ({ page }) => {
  await page.goto('/');
  const density = page.getByLabel('밀도');
  await density.focus();
  await expect(density).toBeFocused();
  await density.selectOption('comfortable');
  await expect(density).toBeFocused();
});

test('intent input applies an immediate safe screen recommendation', async ({
  page
}) => {
  await page.goto('/');
  await page
    .getByLabel('원하는 화면 요청')
    .fill('차트를 먼저 보고 키보드로 빠르게 이동하고 싶어요.');
  await page.getByRole('button', { name: '요청 적용' }).click();

  await expect(page.getByText('분석 작업에 맞춘 파워 화면')).toBeVisible();
  await expect(page.getByText('매출 추이')).toBeVisible();
  await expect(page.getByText('defaultView: chart')).toBeVisible();
});
