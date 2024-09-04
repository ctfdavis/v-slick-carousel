import { test, expect } from '@playwright/test'
import { testPath } from '../utils'

test('slide navigation', async ({ page }) => {
  await page.goto(testPath('focus-on-select'))
  const dots = await page.locator('.v-slick-dots > *')
  await expect(dots.nth(0)).toHaveClass('active')
  await page.waitForTimeout(1000)
  await expect(dots.nth(0)).not.toHaveClass('active')
  await expect(dots.nth(1)).toHaveClass('active')
  await page.waitForTimeout(1000)
  await expect(dots.nth(0)).not.toHaveClass('active')
  await expect(dots.nth(1)).not.toHaveClass('active')
  await expect(dots.nth(3)).toHaveClass('active')
  await page.waitForTimeout(1000)
  await expect(dots.nth(0)).not.toHaveClass('active')
  await expect(dots.nth(1)).not.toHaveClass('active')
  await expect(dots.nth(3)).toHaveClass('active')
})
