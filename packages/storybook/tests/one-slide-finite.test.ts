import { test, expect } from '@playwright/test'
import { examplePath } from './test-helpers'

test('slide navigation', async ({ page }) => {
  await page.goto(examplePath('one-slide-finite-test'))
  const dots = await page.locator('.v-slick-dots > *')
  await expect(dots.nth(0)).toHaveClass('active')
  await page.waitForTimeout(1000)
  await expect(dots.nth(0)).not.toHaveClass('active')
  await expect(dots.nth(1)).toHaveClass('active')
  await page.waitForTimeout(1000)
  await expect(dots.nth(0)).not.toHaveClass('active')
  await expect(dots.nth(1)).not.toHaveClass('active')
  await expect(dots.nth(2)).toHaveClass('active')
})
