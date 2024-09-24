import { test, expect } from '@playwright/test'
import { testPath } from '../utils'
import { Page } from 'playwright'

test('lazy load slide', async ({ page }) => {
  await page.goto(testPath('lazy-load-on-demand'))
  let slides = await getFirstFourSlides(page)
  await expect(slides[0]).toBeVisible()
  await expect(slides[1]).not.toBeVisible()
  await expect(slides[2]).not.toBeVisible()
  await expect(slides[3]).not.toBeVisible()
  await page.waitForTimeout(1000)
  slides = await getFirstFourSlides(page)
  await expect(slides[0]).toBeVisible()
  await expect(slides[1]).toBeVisible()
  await expect(slides[2]).not.toBeVisible()
  await expect(slides[3]).not.toBeVisible()
  await page.waitForTimeout(1000)
  slides = await getFirstFourSlides(page)
  await expect(slides[0]).toBeVisible()
  await expect(slides[1]).toBeVisible()
  await expect(slides[2]).toBeVisible()
  await expect(slides[3]).not.toBeVisible()
  await page.waitForTimeout(1000)
  slides = await getFirstFourSlides(page)
  await expect(slides[0]).toBeVisible()
  await expect(slides[1]).toBeVisible()
  await expect(slides[2]).toBeVisible()
  await expect(slides[3]).toBeVisible()
})

function getFirstFourSlides(page: Page) {
  return Promise.all([
    page.getByText('Slide 1', { exact: true }),
    page.getByText('Slide 2', { exact: true }),
    page.getByText('Slide 3', { exact: true }),
    page.getByText('Slide 4', { exact: true })
  ])
}
