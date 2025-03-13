// @ts-check
import { test, expect } from '@playwright/test';
import { ProductPage } from '../pageobjects/product.page';
import { ShoppingCart } from '../pageobjects/shoppingCart.page';

//end-to-end tests with users adding products and navigating to carts
test('User searches for product, adds to cart and proceeds to checkout', async({page}) => {
    //init shared variables
    let productPage
    const query = 'planner'
    const queryRegex = new RegExp(query, "i") //make the query ignore letter case
  
    await test.step('User navigates to homepage', async() => {
        await page.goto('https://www.amazon.com/')
        await page.getByPlaceholder('Search Amazon').waitFor();
    })
    
    await test.step('User searches for a product', async() => {
        await page.getByPlaceholder('Search Amazon').fill(query)
        await page.locator('#nav-search-submit-button').click()
    
        //expect to see search result page
        await expect(page).toHaveTitle(queryRegex)
    })
    
    await test.step('User selects the first found product', async() => {
        const productArray = page.locator('.a-link-normal.s-no-outline')
        await productArray.first().click()
    })
  
    await test.step('User is redirected to the product page', async() => {
        productPage = new ProductPage(page)

        await expect(productPage.productTitle).toContainText(queryRegex)
    })
    
    await test.step('User adds product to cart', async() => {
        await productPage.addToCartBtn.click()
    
        //user is redirected to "added to cart" view
        await expect(page).toHaveTitle('Amazon.com Shopping Cart')
        await expect(page.locator('h1', { hasText: 'Added to cart' })).toBeVisible();
        //assert subtotal is visible
        await expect(page.locator('#sw-subtotal')).toHaveAttribute('data-price')
    })

    await test.step('User as a guest proceeds to checkout', async() => {
        //await page.locator('input[name="proceedToRetailCheckout"]').click()
        await page.getByRole('button', { name: 'Proceed to checkout' }).click()

        //expect to see Sign in page
        await expect(page).toHaveTitle('Amazon Sign-In')
    })
})
  

test('User adds Trending product to cart, goes to cart and adds new products' , async({ page }) => {
    let productPage, shoppingCartPage

    await test.step("User navigates to Today's deals tab", async() => {
        await page.goto('https://www.amazon.com/gp/goldbox?ref_=nav_cs_gb')
        //assert
        await expect(page.locator('h1', { hasText: "Today's Deals" })).toBeVisible()
    })

    await test.step('User adds Trending product to cart', async() => {
        //click on the first product on the page
        await page.getByTestId('product-card').first().click()
        //assert user is redirected to product page
        productPage = new ProductPage(page)
        await expect(productPage.productTitle).toBeVisible()

        //add to cart
        await productPage.addToCartBtn.click()

        //assert user is redirected to add to shopping cart view
        await expect(page).toHaveTitle('Amazon.com Shopping Cart')
        await expect(page.locator('h1', { hasText: 'Added to cart' })).toBeVisible()
    })

    await test.step('User navigates to cart view', async() => {
        await page.locator('#sw-gtc').getByRole('link', { name: 'Go to Cart' }).click()
        shoppingCartPage = new ShoppingCart(page)

        //assert is on the shopping cart page
        await expect(shoppingCartPage.pageHeading).toBeVisible()
        await expect(page).toHaveTitle('Amazon.com Shopping Cart')
    })


    await test.step('User opens similar item menu', async() => {
        await shoppingCartPage.similarItemsLink.click()

        //assert similar items menu gets opened
        await expect(page.locator('h1', { hasText:'Compare with similar items' })).toBeVisible()
        await expect(page.locator('table.comparison_table_scroller')).toBeVisible()
    })

    await test.step('User adds new product to cart from similar items list', async() => {
        //save product name
        const addedProduct = page.locator('a.a-size-base.a-link-normal').nth(2)
        const addedProductName = (await addedProduct.innerText()).toLowerCase()
        //add to cart
        await page.locator('span[data-action="comparison-in-cart-atc-action"]').first().click()

        //assert product is added
        //wait for the page to load
        await page.waitForSelector('.sc-cart-spinner', { state: 'hidden' });
        await expect(page.locator('.sc-cart-spinner')).not.toBeVisible()

        //get the name of the first product in the shopping cart
        const firstProduct = shoppingCartPage.itemTitles.first()
        const firstProductName = (await firstProduct.innerText()).toLowerCase()

        //use substrings because the link (addedProductName) is truncated on the website
        try {
            await expect(firstProductName.substring(0,110)).toMatch(addedProductName.substring(0,110))
        } catch (error) {
            console.log(`link value was ${addedProductName}, product in cart name is ${firstProductName}`)
            throw error
        }
    })

})
  