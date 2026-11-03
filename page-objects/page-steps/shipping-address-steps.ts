import { Locator, Page, expect } from "@playwright/test";
import { webcommons } from "../../commons/ui/web-common";
import shippingAddressElements from "../page-elements/shipping-address-elements.json" with { type: "json" };

export class ShippingAddressSteps {
    page: Page;
    web: webcommons;

    constructor(page: Page) {
        this.page = page;
        this.web = new webcommons(this.page);
    }

    private async isVisibleSafe(selector: string): Promise<boolean> {
        try {
            return await this.page.locator(selector).isVisible();
        } catch {
            return false;
        }
    }

    private async isEnabledSafe(selector: string): Promise<boolean> {
        try {
            return await this.page.locator(selector).isEnabled();
        } catch {
            return false;
        }
    }

    async Click_on_Next_Button(): Promise<void> {
        await this.page.waitForTimeout(10000);
        await this.web.clickonElement(shippingAddressElements.nextButton);
    }

    async Click_on_Shipped_Here(): Promise<void> {
        await this.web.clickonElement(shippingAddressElements.shipHereButton);
    }

    async isShippingAddressHeaderDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(shippingAddressElements.shippingAddressHeader);
    }

    async isBillingAddressHeaderDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(shippingAddressElements.billingAddressHeader);
    }

    async isBillingSameAsShippingChecked(): Promise<boolean> {
        try {
            return await this.page.locator(shippingAddressElements.billingSameAsShippingCheckbox).isChecked();
        } catch {
            return false;
        }
    }

    async clickBillingSameAsShippingCheckbox(): Promise<void> {
        await this.web.clickonElement(shippingAddressElements.billingSameAsShippingCheckbox);
    }

    getBillingSameAsShippingCheckbox(): Locator {
        return this.page.locator(shippingAddressElements.billingSameAsShippingCheckbox);
    }

    async isBillingSameAsShippingLabelDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(shippingAddressElements.billingSameAsShippingLabel);
    }

    async clickChangeAddressLink(): Promise<void> {
        await this.web.clickonElement(shippingAddressElements.changeAddressLink);
    }

    async isChangeAddressLinkDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(shippingAddressElements.changeAddressLink);
    }

    async getShippingAddressCount(): Promise<number> {
        return this.page.locator(shippingAddressElements.shippingAddressRadios).count();
    }

    async clickNewShippingAddressBtn(): Promise<void> {
        await this.web.clickonElement(shippingAddressElements.newShippingAddressBtn);
    }

    async isNewShippingAddressBtnDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(shippingAddressElements.newShippingAddressBtn);
    }

    async clickNewBillingAddressBtn(): Promise<void> {
        await this.web.clickonElement(shippingAddressElements.newBillingAddressBtn);
    }

    async isReviewCartStepDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(shippingAddressElements.reviewCartStep);
    }

    async isCheckoutDetailsStepDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(shippingAddressElements.checkoutDetailsStep);
    }

    async isShippingMethodsHeaderDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(shippingAddressElements.shippingMethodsHeader);
    }

    async isFreeShippingDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(shippingAddressElements.freeShippingLabel);
    }

    async isPaymentMethodHeaderDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(shippingAddressElements.paymentMethodHeader);
    }

    async isPriceDetailsHeaderDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(shippingAddressElements.priceDetailsHeader);
    }

    async getCartSubtotalText(): Promise<string> {
        return (await this.page.locator(shippingAddressElements.cartSubtotal).first().textContent())?.trim() ?? "";
    }

    async getShippingCostText(): Promise<string> {
        return (await this.page.locator(shippingAddressElements.shippingCost).first().textContent())?.trim() ?? "";
    }

    async getOrderTotalText(): Promise<string> {
        return (await this.page.locator(shippingAddressElements.orderTotal).first().textContent())?.trim() ?? "";
    }

    async isItemsInCartLabelDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(shippingAddressElements.itemsInCartLabel);
    }

    async isPlaceOrderBtnDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(shippingAddressElements.placeOrderBtn);
    }

    async isPlaceOrderBtnEnabled(): Promise<boolean> {
        return this.isEnabledSafe(shippingAddressElements.placeOrderBtn);
    }

    async clickPlaceOrderBtn(): Promise<void> {
        const placeOrder = this.page.locator(shippingAddressElements.placeOrderBtn);
        await expect(placeOrder).toBeVisible({ timeout: 15000 });
        await expect(placeOrder).toBeEnabled({ timeout: 15000 });
        await placeOrder.click();
    }

    async isCouponsSectionDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(shippingAddressElements.couponsSection);
    }

    async isApplyDiscountCodeDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(shippingAddressElements.applyDiscountCodeText);
    }

    async getCurrentUrl(): Promise<string> {
        return this.page.url();
    }

    async fillAddressLine1(address: string) {
        await this.web.fill("input[name='addressLine1']", address);
        console.log(`✓ Entered address line 1`);
    }

    async fillAddressLine2(address: string) {
        await this.web.fill("input[name='addressLine2']", address);
        console.log(`✓ Entered address line 2`);
    }

    async fillCity(city: string) {
        await this.web.fill("input[name='city']", city);
        console.log(`✓ Entered city: ${city}`);
    }

    async fillState(state: string) {
        await this.web.fill("input[name='state']", state);
        console.log(`✓ Entered state: ${state}`);
    }

    async fillPostalCode(postalCode: string) {
        await this.web.fill("input[name='postalCode']", postalCode);
        console.log(`✓ Entered postal code: ${postalCode}`);
    }

    async fillCountry(country: string) {
        await this.web.SelectDropdownElement("select[name='country']", country);
        console.log(`✓ Selected country: ${country}`);
    }

    async clickAddAddressButton() {
        await this.web.clickonElement("button:has-text('Add Address')");
        console.log("✓ Clicked on Add Address button");
    }

    async verifyAddressAddedSuccessfully() {
        const successMessage = this.page.locator("div:has-text('Address added successfully')");
        await expect(successMessage).toBeVisible();
        console.log("✓ Address added successfully");
    }

    async fillCompleteAddress(addressData: any) {
        await this.fillAddressLine1(addressData.line1);
        if (addressData.line2) {
            await this.fillAddressLine2(addressData.line2);
        }
        await this.fillCity(addressData.city);
        await this.fillState(addressData.state);
        await this.fillPostalCode(addressData.postalCode);
        await this.fillCountry(addressData.country);
        console.log("✓ Address details filled");
    }
}
