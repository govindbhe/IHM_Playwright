import { Page } from "@playwright/test";
import paymentElements from "../page-elements/payment-method-elements.json" with { type: "json" };
import { webcommons } from "../../commons/ui/web-common";

export class PaymentMethodSteps {
    page: Page;
    web: webcommons;

    constructor(page: Page) {
        this.page = page;
        this.web = new webcommons(this.page);
    }

    async Click_on_Cash_On_Delivery(): Promise<void> {
        await this.page.waitForTimeout(5000);
        await this.web.clickonElement(paymentElements.cashOnDelivery);
    }

    async Click_on_Airpay(): Promise<void> {
        await this.web.clickonElement(paymentElements.airpay);
    }

    async Click_on_wallet(): Promise<void> {
        await this.web.clickonElement(paymentElements.wallet);
    }

    async Click_on_Phonepay(): Promise<void> {
        await this.web.clickonElement(paymentElements.phonepay);
    }

    async Click_on_submit(): Promise<void> {
        await this.web.clickonElement(paymentElements.submitButton);
    }

    async Click_on_Continue(): Promise<void> {
        await this.web.clickonElement(paymentElements.continueButton);
    }

    async Click_on_Add_New_Address(): Promise<void> {
        await this.web.clickonElement(paymentElements.addNewAddress);
    }

    async Click_on_pay_via_UPI(): Promise<void> {
        await this.web.clickonElement(paymentElements.payViaUpi);
    }

    async send_UPI_ID(): Promise<void> {
        await this.web.fill(paymentElements.upiInput, "govindbhelonde1@ybl");
    }

    async Verify_Upi(): Promise<void> {
        await this.web.clickonElement(paymentElements.verifyUpiButton);
    }

    async click_on_Wallet(): Promise<void> {
        await this.web.clickonElement(paymentElements.wallet);
    }

    async Click_on_make_payment(): Promise<void> {
        try {
            await this.web.clickonElement(paymentElements.makePhonepayPayment);
        } catch {
            await this.page.locator(paymentElements.makePhonepayPayment).evaluate((el: Element) => {
                (el as HTMLElement).click();
            });
        }
    }

    async Click_on_place_orderbtn(): Promise<void> {
        await this.web.clickonElement(paymentElements.placeOrder);
    }

    async Click_on_check_box(): Promise<void> {
        try {
            await this.web.clickonElement(paymentElements.checkBox);
        } catch {
            await this.page.locator(paymentElements.checkBox).first().evaluate((el: Element) => {
                (el as HTMLElement).click();
            });
        }
    }

    async getSuccessMessage(): Promise<string> {
        return (await this.page.locator(paymentElements.successMessage).textContent())?.trim() || "";
    }

    async Click_on_Place_Order(): Promise<void> {
        const locator = this.page.locator(paymentElements.placeOrder);
        await locator.waitFor({ state: "visible", timeout: 20000 });
        await locator.scrollIntoViewIfNeeded();
        await locator.click();
    }
}
