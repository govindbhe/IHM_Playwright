import { Page, expect } from "@playwright/test";
import productElements from '../page-elements/product-page-elements.json' with { type: 'json' };
import { webcommons } from "../../commons/ui/web-common";

export class ProductPageSteps {
    page: Page;
    web: webcommons;

    constructor(page: Page) {
        this.page = page;
        this.web = new webcommons(this.page);
    }

    async Click_on_Qyt() {
        await this.web.clickonElement(productElements.qtyInput);
        await this.web.fill(productElements.qtyInput, "2");
    }

    async Click_on_Buy_Now_button() {
        await this.web.clickonElement(productElements.buyNowButtonSpan);
    }

    async Check_Visibility_for_Buy_Now_button(): Promise<boolean> {
        try {
            return await this.page.locator(productElements.buyNowButtonSpan).isVisible();
        } catch {
            return false;
        }
    }

    async Click_on_Add_To_Cart_button() {
        try {
            const btn = this.page.locator(productElements.addToCartButtonTitle).first();
            await btn.waitFor({ state: 'visible', timeout: 15000 });
            await btn.click();
        } catch {
            try {
                await this.page.locator(productElements.addToCartButtonAlt).first().click();
            } catch {
                const btn = this.page.locator("//button[contains(@class, 'action-tocart')] | //button[contains(text(), 'Add to Cart')] | //button[@title='Add to Cart']").first();
                await btn.evaluate((el: Element) => (el as HTMLElement).click());
            }
        }
    }

    async Check_Visibility_for_Add_To_Cart_button(): Promise<boolean> {
        try {
            if (await this.page.locator("//button[@title='Add to Cart']").first().isVisible().catch(() => false)) {
                return true;
            }
            if (await this.page.locator("//button[contains(@class, 'action-tocart')]").first().isVisible().catch(() => false)) {
                return true;
            }
            return await this.page.locator("//button[contains(text(), 'Add to Cart')]").first().isVisible().catch(() => false);
        } catch {
            return false;
        }
    }

    async Click_on_Delivery_Information() {
        await this.web.clickonElement(productElements.deliveryInformation);
    }

    async Click_on_Add_to_Wish_List() {
        await this.web.clickonElement(productElements.addToWishList);
    }

    async Click_on_Add_to_Compare() {
        await this.web.clickonElement(productElements.addToCompare);
    }

    async Click_on_Search_Here() {
        await this.web.clickonElement(productElements.searchHere);
    }

    async Click_on_cart() {
        await this.web.clickonElement(productElements.cart);
    }

    async getsku(): Promise<string> {
        return (await this.page.locator(productElements.sku).textContent())?.trim() || "";
    }

    async getProductName(): Promise<string> {
        await this.page.locator(productElements.productName).waitFor({ state: 'visible', timeout: 10000 });
        return (await this.page.locator(productElements.productName).textContent())?.trim() || "";
    }

    async isProductNameDisplayed(): Promise<boolean> {
        return await this.page.locator(productElements.productName).isVisible().catch(() => false);
    }

    async getProductPrice(): Promise<string> {
        await this.page.locator(productElements.productPricePrimary).waitFor({ state: 'visible', timeout: 10000 });
        return (await this.page.locator(productElements.productPricePrimary).textContent())?.trim() || "";
    }

    async isPriceDisplayed(): Promise<boolean> {
        return await this.page.locator(productElements.priceContainer).isVisible().catch(() => false);
    }

    async getProductPriceAsDouble(): Promise<number> {
        const priceText = (await this.getProductPrice()).replace(/[^\d.]/g, "");
        return parseFloat(priceText);
    }

    async getStockStatus(): Promise<string> {
        try {
            await this.page.locator(productElements.stockStatusContainer).waitFor({ state: 'visible', timeout: 5000 });
            return (await this.page.locator(productElements.stockStatusContainer).textContent())?.trim() || "";
        } catch {
            return "";
        }
    }

    async isInStock(): Promise<boolean> {
        const status = (await this.getStockStatus()).toLowerCase();
        return status.includes('in stock');
    }

    async getQuantityFieldValue(): Promise<string> {
        return await this.page.locator(productElements.quantityField).inputValue();
    }

    async clearAndSetQuantity(qty: string) {
        await this.web.fill(productElements.quantityField, qty);
    }

    async isQuantityFieldDisplayed(): Promise<boolean> {
        return await this.page.locator(productElements.quantityField).isVisible().catch(() => false);
    }

    async isProductImageDisplayed(): Promise<boolean> {
        try {
            await this.page.locator(productElements.productImage).waitFor({ state: 'visible', timeout: 10000 });
            return await this.page.locator(productElements.productImage).isVisible();
        } catch {
            return false;
        }
    }

    async isWishlistButtonDisplayed(): Promise<boolean> {
        return await this.page.locator(productElements.wishlistButton).isVisible().catch(() => false);
    }

    async clickWishlistButton() {
        await this.web.clickonElement(productElements.wishlistButton);
    }

    async isAddToCartButtonEnabled(): Promise<boolean> {
        return await this.page.locator(productElements.addToCartButtonTitle).isEnabled().catch(() => false);
    }

    async isBuyNowButtonEnabled(): Promise<boolean> {
        return await this.page.locator(productElements.buyNowButtonSpan).isEnabled().catch(() => false);
    }

    async getBreadcrumbCount(): Promise<number> {
        return await this.page.locator(productElements.breadcrumbItems).count();
    }

    async getBreadcrumbLastItemText(): Promise<string> {
        return (await this.page.locator(productElements.breadcrumbLastItem).textContent())?.trim() || "";
    }

    async isDetailsTabDisplayed(): Promise<boolean> {
        return await this.page.locator(productElements.detailsTab).isVisible().catch(() => false);
    }

    async clickDetailsTab() {
        await this.web.clickonElement(productElements.detailsTab);
    }

    async isProductSpecificationTabDisplayed(): Promise<boolean> {
        return await this.page.locator(productElements.productSpecificationTab).isVisible().catch(() => false);
    }

    async clickProductSpecificationTab() {
        await this.web.clickonElement(productElements.productSpecificationTab);
    }

    async verifyAddToCartButtonVisibility(): Promise<boolean> {
        try {
            const button = this.page.locator(productElements.addToCartButton);
            const isVisible = await button.isVisible({ timeout: 5000 });
            console.log(`✓ Add to Cart button visibility: ${isVisible}`);
            return isVisible;
        } catch (error) {
            console.log("✗ Add to Cart button not visible");
            return false;
        }
    }

    async verifyOutOfStockStatus(): Promise<boolean> {
        try {
            const badge = this.page.locator(productElements.outOfStockBadge);
            const isVisible = await badge.isVisible({ timeout: 5000 });
            console.log(`✓ Out of Stock badge visibility: ${isVisible}`);
            return isVisible;
        } catch (error) {
            return false;
        }
    }

    async clickOnAddToCartButton() {
        await this.web.clickonElement(productElements.addToCartButton);
        console.log("✓ Clicked on Add to Cart button");
    }

    async clickOnBuyNowButton() {
        await this.web.clickonElement(productElements.buyNowButton);
        console.log("✓ Clicked on Buy Now button");
    }

    async getProductTitle(): Promise<string> {
        const title = await this.page.locator(productElements.productTitle).textContent();
        console.log(`✓ Product title: ${title}`);
        return title || "";
    }

    async getProductPriceLegacy(): Promise<string> {
        const price = await this.page.locator(productElements.productPrice).textContent();
        console.log(`✓ Product price: ${price}`);
        return price || "";
    }

    async verifyProductDetailsVisible() {
        await this.web.VerifyVisibility(productElements.productTitle);
        await this.web.VerifyVisibility(productElements.productPrice);
        console.log("✓ Product details are visible");
    }

    async updateQuantity(quantity: number) {
        await this.web.fill(productElements.quantityInput, quantity.toString());
        console.log(`✓ Updated quantity to ${quantity}`);
    }
}
