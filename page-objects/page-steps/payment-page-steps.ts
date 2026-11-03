import { Page } from "@playwright/test";
import paymentPageElements from "../page-elements/payment-page-elements.json" with { type: "json" };
import { webcommons } from "../../commons/ui/web-common";

export class PaymentPageSteps {
    page: Page;
    web: webcommons;

    constructor(page: Page) {
        this.page = page;
        this.web = new webcommons(this.page);
    }

    async enterCardDetails(number: string, expiry: string, cvvCode: string): Promise<void> {
        await this.web.fill(paymentPageElements.cardNumberInput, number);
        await this.web.fill(paymentPageElements.expiryDateInput, expiry);
        await this.web.fill(paymentPageElements.cvvInput, cvvCode);
    }

    async clickPay(): Promise<void> {
        await this.web.clickonElement(paymentPageElements.payButton);
    }

    async getErrorMessage(): Promise<string> {
        return (await this.page.locator(paymentPageElements.errorMessage).textContent())?.trim() || "";
    }
}
