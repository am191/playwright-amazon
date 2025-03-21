const { expect } = require('@playwright/test');

exports.ProductPage = class ProductPage {
  /**
   * @param {import('@playwright/test').Page} page
   */

    constructor(page) {
        this.page = page
        this.addToCartBtn = page.locator('#add-to-cart-button')
        this.buyNowBtn = page.locator('#buy-now-button')
        this.productTitle = page.locator('span#productTitle')
        this.sizeDropdown = page.locator('#dropdown_selected_size_name')

    }

    async selectSize(value) {
        await this.sizeDropdown.click()
        await this.page.getByLabel(value).getByText(value).click();
    }
}
