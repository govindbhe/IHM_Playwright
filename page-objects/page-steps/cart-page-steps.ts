import { Page, expect } from "@playwright/test";
import cartElements from '../page-elements/cart-page-elements.json' with { type: 'json' };
import { webcommons } from "../../commons/ui/web-common";

export class CartPageSteps {
    page: Page;
    web: webcommons;

    constructor(page: Page) {
        this.page = page;
        this.web = new webcommons(this.page);
    }

    private parseNumericValue(value: string | null): number {
        const text = value ?? "";
        const match = text.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
    }

    async isCartPageLoaded(): Promise<boolean> {
        try {
            return await this.page.locator(cartElements.shoppingCartTitle).isVisible({ timeout: 5000 });
        } catch {
            return false;
        }
    }

    async getCartItemsCount(): Promise<number> {
        await this.page.locator(cartElements.shoppingCartTitle).waitFor({ state: 'visible' });
        return await this.page.locator(cartElements.cartItemRow).count();
    }

    async hasAtLeastOneCartItem(): Promise<boolean> {
        try {
            await expect(this.page.locator(cartElements.cartItemRow)).toHaveCount(1, { timeout: 10000 });
            return true;
        } catch {
            return (await this.page.locator(cartElements.cartItemRow).count()) > 0;
        }
    }

    async isCartEmpty(): Promise<boolean> {
        return (await this.page.locator(cartElements.emptyCartMessages).count()) > 0;
    }

    async isPriceDetailsVisible(): Promise<boolean> {
        try {
            return await this.page.locator(cartElements.priceDetailsTitle).isVisible({ timeout: 5000 });
        } catch {
            return false;
        }
    }

    async isCheckoutButtonVisibleAndEnabled(): Promise<boolean> {
        try {
            const button = this.page.locator(cartElements.checkoutButton);
            const visible = await button.isVisible({ timeout: 5000 });
            const enabled = await button.isEnabled();
            return visible && enabled;
        } catch {
            return false;
        }
    }

    async clickCheckout(): Promise<void> {
        await this.web.clickonElement(cartElements.checkoutButton);
    }

    async isMoveToWishlistVisible(): Promise<boolean> {
        try {
            return await this.page.locator(cartElements.moveToWishlist).isVisible({ timeout: 5000 });
        } catch {
            return false;
        }
    }

    async isClearShoppingCartVisible(): Promise<boolean> {
        try {
            return await this.page.locator(cartElements.clearShoppingCart).isVisible({ timeout: 5000 });
        } catch {
            return false;
        }
    }

    async isQuantityControlVisible(): Promise<boolean> {
        const incrementCount = await this.page.locator(cartElements.incrementButtons).count();
        const decrementCount = await this.page.locator(cartElements.decrementButtons).count();
        return incrementCount > 0 && decrementCount > 0;
    }

    async getFirstItemQuantity(): Promise<number> {
        try {
            const firstInput = this.page.locator(cartElements.quantityInputs).first();
            await firstInput.waitFor({ state: 'visible' });
            let value = await firstInput.inputValue();
            if (!value || !value.trim()) {
                value = (await firstInput.textContent()) || "";
            }
            return this.parseNumericValue(value);
        } catch {
            return 0;
        }
    }

    async increaseFirstItemQuantity(): Promise<void> {
        const firstIncrement = this.page.locator(cartElements.incrementButtons).first();
        if (await firstIncrement.isVisible().catch(() => false)) {
            await firstIncrement.click();
        }
    }

    async getOrderTotalValue(): Promise<string> {
        const candidates = [
            cartElements.orderTotalCandidate1,
            cartElements.orderTotalCandidate2,
            cartElements.orderTotalCandidate3,
            cartElements.orderTotalCandidate4,
            cartElements.orderTotalCandidate5,
        ];

        for (const candidate of candidates) {
            const elements = this.page.locator(candidate);
            const count = await elements.count();
            for (let i = 0; i < count; i++) {
                const text = ((await elements.nth(i).textContent()) || '').trim();
                if (text && /\d/.test(text)) {
                    return text;
                }
            }
        }

        throw new Error('Unable to locate order total value using available cart locators');
    }

    async verifyCartIsNotEmpty() {
        const cartEmpty = this.page.locator(cartElements.cartEmpty);
        const isVisible = await cartEmpty.isVisible({ timeout: 5000 }).catch(() => false);
        expect(!isVisible).toBe(true);
        console.log("✓ Cart is not empty");
    }

    async getCartItemQuantity(): Promise<number> {
        const items = await this.page.locator(cartElements.cartItemRow).count();
        console.log(`✓ Cart items count: ${items}`);
        return items;
    }

    async getProductQuantity(): Promise<number> {
        const quantity = await this.page.locator(cartElements.productQuantity).first().inputValue();
        console.log(`✓ Product quantity in cart: ${quantity}`);
        return parseInt(quantity || "0");
    }

    async getCartTotal(): Promise<string> {
        const total = await this.page.locator(cartElements.cartTotal).textContent();
        console.log(`✓ Cart total: ${total}`);
        return total || "";
    }

    async clickCheckoutButton() {
        await this.clickCheckout();
        console.log("✓ Clicked on Checkout button");
    }

    async clickContinueShoppingButton() {
        await this.web.clickonElement(cartElements.continueShoppingButton);
        console.log("✓ Clicked on Continue Shopping button");
    }

    async removeProduct() {
        await this.web.clickonElement(cartElements.removeButton);
        console.log("✓ Clicked on Remove button");
    }

    async updateProductQuantity(quantity: number) {
        await this.web.fill(cartElements.productQuantity, quantity.toString());
        await this.web.clickonElement(cartElements.updateQuantityButton);
        console.log(`✓ Updated product quantity to ${quantity}`);
    }

    async verifyCartItemsAreVisible() {
        await this.web.VerifyVisibility(cartElements.cartItemRow);
        console.log("✓ Cart items are visible");
    }
}
