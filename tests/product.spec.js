// @ts-check
import { test, expect } from '@playwright/test';
import { ProductPage } from '../pageobjects/product.page';

//pre-pick a product page so that page has all parameters for test
test.beforeEach(async ({ page }) => {
  await page.goto('https://www.amazon.com/Saucony-Womens-Performance-Athletic-Assorted/dp/B09BKC9TNS?sr=8-23');
  await page.waitForTimeout(5000) //explicit wait to avoid suspicious behaviour flags from amazon:)
});


test.describe('Product page option tests',() => {
  test('Can add product to cart only if size is picked',async({page}) => {
    const productPage = new ProductPage(page)

    //assert add to cart action is blocked
    await expect(page.locator('#partialStateBuybox')).toContainText('To buy, select Size');
    let cartBtnStyle = await productPage.addToCartBtn.getAttribute('style')
    await expect(cartBtnStyle).toContain('cursor: not-allowed')

    //select size
    await productPage.selectSize('Medium')

    //assert add to cart action is available
    await expect(productPage.addToCartBtn).toBeVisible();
    await expect(productPage.buyNowBtn).toBeVisible();
  });


  test('Select product color',async({ page }) => {
    //select swatch
    const firstSwatch = page.locator('.swatchAvailable').nth(1)
    const firstSwatchName = await firstSwatch.getAttribute('title')
    await firstSwatch.click()

    //assert selected swatch name is reflected on page
    const optionName = await page.locator('.selection').innerText()

    try {
      await expect(optionName).toMatch(firstSwatchName.replace('Click to select ', ''))
    } catch (error) {
      console.log(`visible option: ${optionName}, picked swatch name: ${firstSwatchName}`)
      throw error
    }
  });


  test('Select product quantity',async({page}) => {
    const productPage = new ProductPage(page)
    const qty = 2

    //select size to show the block with qty option
    await productPage.selectSize('Medium')

    //select quantity
    await page.getByText('Quantity:1').click() //no specific selector for qty dropdown
    await page.locator(`#quantity_${qty}`).click() //select qty = 3

    //assert quantity is changed
    const chosenQty = await page.getByText(/Quantity:\d+/).innerText()
    const chosenQtyNum = Number(chosenQty.replace('Quantity:', ''))
    expect(chosenQtyNum).toBe(qty+1)
  })

})
