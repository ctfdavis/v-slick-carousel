import { test, expect } from '@playwright/test'
import { testPath } from '../utils'

test('number of slide groups to show under different breakpoints', async ({
  page
}) => {
  await page.goto(testPath('responsive'))
  await page.setViewportSize({ width: 400, height: 800 })
  await expect(await page.locator('.v-slick-slide-group.active')).toHaveCount(1)
  await page.setViewportSize({ width: 601, height: 800 })
  await expect(await page.locator('.v-slick-slide-group.active')).toHaveCount(2)
  await page.setViewportSize({ width: 1025, height: 800 })
  await expect(await page.locator('.v-slick-slide-group.active')).toHaveCount(3)
})
