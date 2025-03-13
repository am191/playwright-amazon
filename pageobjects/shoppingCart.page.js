const { expect } = require('@playwright/test');

exports.ShoppingCart = class ShoppingCart {
  /**
   * @param {import('@playwright/test').Page} page
   */

    constructor(page) {
        this.page = page
        this.pageHeading = page.locator('h2', { hasText: 'Shopping cart' })
        this.similarItemsLink = page.locator('input', { hasText:'Compare with similar items' })
        this.itemTitles = page.locator('.sc-product-title')
    }


}
