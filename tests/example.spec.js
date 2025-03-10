// @ts-check
import { test, expect } from '@playwright/test';
import { ProductPage } from '../pageobjects/product.page';

//pre-pick a product page so that page has all parameters for test
test.beforeEach(async ({ page }) => {
  await page.goto('https://www.amazon.com/Saucony-Womens-Performance-Athletic-Assorted/dp/B07LGVXPXK?crid=23QLMJP1I8FS7&dib=eyJ2IjoiMSJ9.nh9mBx4ygjb1w5YM3vuwRz4Mg-P2gS_gfkc8a7Aud6M40v_j44sVdiHMEKMQvNRhec4xCqyri3njKzi-F6c7VCDrsezalU3UBn0Ceo-vIYX2xU8qh-CfY3y8_FaW2PXhW-IG4-onKwB39-R0avQpZZhe6CZ4Unqjww6oDaUOrk-68qkp36EYT8TTXsQZDNMDNEAirlXfwQnFt0ClbLi4C6_9TLtiNRNeIKVHsNGcIeD9mukrzvTXHR7tDEgMtONYzi5pXfhvkC-RdhlzZNztXnqv9vn8BWA8G8mUZF6Ob5483SdYr5PMOZkqwVyGc2PDvgny3QHoUfTicq1oZSac9vOLpUDin0ACmNRXpS3Hz1JeYFmYXlCPGLSh_D-nTYACsBH0Vgr_Oj7HPJylpzcGzCWLdgbUs1og8yUwVaEVtqvjJr_lHnCK96Dkrzu34Qoc.wtutuDGXaeS0by416eTjqiGwKbyEjHuiBu40cxBvJZE&dib_tag=se&keywords=socks&qid=1741515414&sprefix=socks%2Caps%2C392&sr=8-23');
  
});


test.describe('Product page option selection tests',() => {
  test('Can add to cart only if size is picked',async({page}) => {
    const productPage = new ProductPage(page)

    //assert add to cart action is blocked
    await expect(page.locator('#partialStateBuybox')).toContainText('To buy, select Size');
    let cartBtnStyle = await productPage.addToCartBtn.getAttribute('style')
    await expect(cartBtnStyle).toContain('cursor: not-allowed')

    //select size
    await page.locator('#dropdown_selected_size_name').click();
    await page.getByLabel('Medium').getByText('Medium').click();

    //assert add to cart action is available
    await expect(productPage.addToCartBtn).toBeVisible();
    await expect(productPage.buyNowBtn).toBeVisible();
  });


  test('Select product color',async({ page }) => {
    const swatchArray = page.locator('li.swatchAvailable')
    let productColor
    const swatchColor = page.locator('span.selection')

    //assert that color swatch has been changed to the selected

    //asser that price is the same as the swatch

  });


  test('Select product quantity',async({page}) => {

  })
})