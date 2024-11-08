import { test, expect } from '@playwright/test'
import { testPath } from '../utils'

test('switching between infinite and finite on edge cases', async ({
  page
}) => {
  await page.goto(testPath('responsive-infinite-finite-edge-cases'))
  await page.setViewportSize({ width: 1000, height: 800 })
  await page.waitForTimeout(1500)
  await page.setViewportSize({ width: 500, height: 800 })
  await expect(await page.locator('.v-slick-slide-group.active')).toHaveCount(2)
})
