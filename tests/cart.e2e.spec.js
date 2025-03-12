// @ts-check
import { test, expect } from '@playwright/test';

test('User searches for product, adds to cart and proceeds to checkout', async({page}) => {
    //init shared variables
    //search term
    const query = 'planner'
    const titleRegex = new RegExp(query, "i") //make the query ignore letter case
    let swatchName;
  
    await test.step('User navigates to homepage', async() => {
      await page.goto('https://www.amazon.com/')
      //wait for the elements to load
      await page.getByPlaceholder('Search Amazon').waitFor();
    })
    
    await test.step('User searches for a product', async() => {
      await page.getByPlaceholder('Search Amazon').fill(query)
      await page.locator('#nav-search-submit-button').click()
  
      //expect to see result page
      await expect(page).toHaveTitle(titleRegex)
    })
    
    await test.step('User selects the first found product', async() => {
      const productArray = page.locator('.a-link-normal.s-no-outline')
      await productArray.first().click()
    })
  
    await test.step('User is redirected to the product page', async() => {
      await expect(page.locator('span#productTitle')).toContainText(titleRegex)
  
      //save product color name to later compare if the right option is added to cart
      swatchName = await page.locator('#inline-twister-expanded-dimension-text-color_name').innerText()
    })
    
    await test.step('User adds product to cart', async() => {
      await page.locator('#add-to-cart-button').click()
  
      //user is redirected to "added to cart" view
      await expect(page).toHaveTitle('Amazon.com Shopping Cart')
      await expect(page.locator('h1', { hasText: 'Added to cart' })).toBeVisible();
      //assert subtotal is visible
      await expect(page.locator('#sw-subtotal')).toHaveAttribute('data-price')
    })
  
    await test.step('Verify the correct product is added', async() => {
      const productInCart = await page.locator('#sw-all-product-variations').innerText()
      await expect(productInCart).toContain(swatchName)
    })
    
    await test.step('User as a guest proceeds to checkout', async() => {
      await page.locator('input[name="proceedToRetailCheckout"]').click();
  
      //expect to see Sign in page
      await expect(page).toHaveTitle('Amazon Sign-In')
    })
    
  })
  

test('User adds Trending product to cart, goes to cart and adds new products' , async({ page }) => {
    await test.step('User navigates to homepage', async() => {
        await page.goto('https://www.amazon.com/')

        //dismiss location pop-up since it blocks the link bar click action for the agent
        await page.locator('input[data-action-type="DISMISS"]').click()
    })

    await test.step("User navigates to Today's deals tab", async() => {
        await page.getByRole('link', { name: "Today's Deals" }).click()

        //assert
        await expect(page.locator('h1', { hasText: "Today's Deals" })).toBeVisible()
    })

    await test.step('User adds Trending product to cart', async() => {
        //click on the first product on the page
        await page.getByTestId('product-card').first().click()
        //assert user is redirected to product page
        await expect(page.locator('span#productTitle')).toBeVisible()
        //add to cart
        await page.locator('#add-to-cart-button').click()

        //assert
        await expect(page).toHaveTitle('Amazon.com Shopping Cart')
        await expect(page.locator('h1', { hasText: 'Added to cart' })).toBeVisible()
    })

    await test.step('User navigates to cart view', async() => {
        await page.locator('#sw-gtc').getByRole('link', { name: 'Go to Cart' }).click()

        //assert
        await expect(page.locator('h2', { hasText: 'Shopping cart' })).toBeVisible()
        await expect(page).toHaveTitle('Amazon.com Shopping Cart')
    })

    await test.step('User increases product quantity in a cart view', async() => {
        //get the initial subtotal value for later assertion
        await expect(page.locator('#sc-subtotal-amount-buybox')).toBeVisible()
        const oldSubtotal = (await page.locator('#sc-subtotal-amount-buybox').innerText()).replace('$','').trim()

        //increase product qtys
        await page.getByRole('button', { name: 'Increase quantity by one' }).click()
        //wait for the update
        page.waitForTimeout(2000)

        const newQty = await page.getByRole('spinbutton').innerText()
        const productPrice = await page.locator('.sc-badge-price-to-pay').innerText()
        const newSubtotal = (await page.locator('#sc-subtotal-amount-buybox').innerText()).replace('$','').trim()

        //assert qty is changed
        expect(parseInt(newQty,10)).toBe(2)     
        //assert cart subtotal increases by 2x
        expect(parseFloat(newSubtotal)).toBeGreaterThan(parseFloat(oldSubtotal))
        expect(parseFloat(newSubtotal)).toBe(parseFloat(productPrice)*2)
        

        


    })

    await test.step('User removes products from cart', async() => {
        //action

        //assert

    })

})
  