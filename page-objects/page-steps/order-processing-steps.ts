import { Page, expect } from "@playwright/test";
import { webcommons } from "../../commons/ui/web-common";

export class OrderProcessingSteps {
    page: Page;
    web: webcommons;

    constructor(page: Page) {
        this.page = page;
        this.web = new webcommons(this.page);
    }

    async viewOrders() {
        await this.web.clickonElement("a:has-text('Orders')");
        await this.page.waitForLoadState('networkidle');
        console.log("✓ Viewing orders");
    }

    async processOrder(orderId: string) {
        await this.web.clickonElement(`button[data-order-id="${orderId}"]`);
        console.log(`✓ Processing order: ${orderId}`);
    }

    async updateOrderStatus(status: string) {
        await this.web.SelectDropdownElement("select[name='orderStatus']", status);
        console.log(`✓ Updated order status to: ${status}`);
    }

    async addShippingTrackingNumber(trackingNumber: string) {
        await this.web.fill("input[name='trackingNumber']", trackingNumber);
        console.log(`✓ Added tracking number: ${trackingNumber}`);
    }

    async clickConfirmButton() {
        await this.web.clickonElement("button:has-text('Confirm')");
        console.log("✓ Clicked on Confirm button");
    }

    async verifyOrderProcessedSuccessfully() {
        const successMessage = this.page.locator("div:has-text('Order processed successfully')");
        await expect(successMessage).toBeVisible();
        console.log("✓ Order processed successfully");
    }

    async cancelOrder(orderId: string) {
        await this.web.clickonElement(`button:has-text('Cancel')[data-order-id="${orderId}"]`);
        console.log(`✓ Cancelled order: ${orderId}`);
    }

    async verifyCancelConfirmation() {
        const confirmDialog = this.page.locator("div[role='dialog']:has-text('Are you sure')");
        await expect(confirmDialog).toBeVisible();
        console.log("✓ Cancel confirmation dialog visible");
    }

    async confirmCancellation() {
        await this.web.clickonElement("button:has-text('Yes, Cancel')");
        console.log("✓ Confirmed order cancellation");
    }
}
