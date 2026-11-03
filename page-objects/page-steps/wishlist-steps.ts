import { Page, expect } from "@playwright/test";
import { webcommons } from "../../commons/ui/web-common";

export class WishlistSteps {
    page: Page;
    web: webcommons;

    constructor(page: Page) {
        this.page = page;
        this.web = new webcommons(this.page);
    }

    async clickAddToWishlistButton() {
        await this.web.clickonElement("button:has-text('Add to Wishlist')");
        console.log("✓ Clicked on Add to Wishlist button");
    }

    async verifyAddedToWishlist() {
        const message = this.page.locator("div:has-text('Added to Wishlist')");
        await expect(message).toBeVisible();
        console.log("✓ Product added to wishlist");
    }

    async clickWishlistLink() {
        await this.web.clickonElement("a:has-text('Wishlist')");
        await this.page.waitForLoadState('networkidle');
        console.log("✓ Clicked on Wishlist link");
    }

    async verifyProductInWishlist(productName: string) {
        const product = this.page.locator(`text="${productName}"`);
        await expect(product).toBeVisible();
        console.log(`✓ Product "${productName}" found in wishlist`);
    }

    async removeFromWishlist() {
        await this.web.clickonElement("button:has-text('Remove')");
        console.log("✓ Removed product from wishlist");
    }

    async verifyWishlistEmpty() {
        const emptyMessage = this.page.locator("div:has-text('Your wishlist is empty')");
        await expect(emptyMessage).toBeVisible();
        console.log("✓ Wishlist is empty");
    }
}
