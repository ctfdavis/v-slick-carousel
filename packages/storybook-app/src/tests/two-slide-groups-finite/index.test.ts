import { test, expect } from '@playwright/test'
import { testPath } from '../utils'

test('slides in viewport', async ({ page }) => {
  await page.goto(testPath('two-slide-groups-finite'))
  await expect(
    await page.getByText('Slide 1', { exact: true })
  ).toBeInViewport()
  await expect(
    await page.getByText('Slide 2', { exact: true })
  ).toBeInViewport()
  await expect(
    await page.getByText('Slide 3', { exact: true })
  ).not.toBeInViewport()
  await expect(
    await page.getByText('Slide 4', { exact: true })
  ).not.toBeInViewport()
  await page.waitForTimeout(1000)
  await expect(
    await page.getByText('Slide 1', { exact: true })
  ).not.toBeInViewport()
  await expect(
    await page.getByText('Slide 2', { exact: true })
  ).toBeInViewport()
  await expect(
    await page.getByText('Slide 3', { exact: true })
  ).toBeInViewport()
  await expect(
    await page.getByText('Slide 4', { exact: true })
  ).not.toBeInViewport()
  await page.waitForTimeout(1000)
  await expect(
    await page.getByText('Slide 1', { exact: true })
  ).not.toBeInViewport()
  await expect(
    await page.getByText('Slide 2', { exact: true })
  ).not.toBeInViewport()
  await expect(
    await page.getByText('Slide 3', { exact: true })
  ).toBeInViewport()
  await expect(
    await page.getByText('Slide 4', { exact: true })
  ).toBeInViewport()
})
