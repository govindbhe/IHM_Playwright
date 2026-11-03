import { Page } from "@playwright/test";
import paymentDetailsElements from "../page-elements/seller-reg-payment-details-elements.json" with { type: "json" };
import { webcommons } from "../../commons/ui/web-common";

export class SellerRegPaymentDetailsSteps {
    page: Page;
    web: webcommons;

    constructor(page: Page) {
        this.page = page;
        this.web = new webcommons(this.page);
    }

    async Send_Bank_Name(): Promise<void> {
        await this.web.fill(paymentDetailsElements.bankNameInput, "Bank Of Baroda");
    }

    async send_Bank_holder_name(): Promise<void> {
        await this.web.fill(paymentDetailsElements.bankHolderNameInput, "Govind R Bhelonde");
    }

    async send_Bank_Account_no(): Promise<void> {
        await this.web.fill(paymentDetailsElements.bankAccountNoInput, "12345678952");
    }

    async send_IFSC_code(): Promise<void> {
        await this.web.fill(paymentDetailsElements.ifscCodeInput, "SBIN0012245");
    }

    async send_Upload_passbook(filePath?: string): Promise<void> {
        const path = filePath ?? "F:/new vol/Documents/Invoice Buyer.pdf";
        await this.page.locator(paymentDetailsElements.uploadPassbookInput).setInputFiles(path);
    }

    async send_Click_on_Proceed_button(): Promise<void> {
        await this.web.clickonElement(paymentDetailsElements.proceedButton);
    }

    async Click_On_Agree(): Promise<void> {
        await this.web.clickonElement(paymentDetailsElements.agreeCheckbox);
    }

    async Click_On_Done_buuton(): Promise<void> {
        await this.web.clickonElement(paymentDetailsElements.doneButton);
    }

    async payment_details(): Promise<void> {
        await this.send_IFSC_code();
        await this.send_Bank_holder_name();
        await this.send_Bank_Account_no();
        await this.send_Upload_passbook();
        await this.page.waitForTimeout(4000);
        await this.Click_On_Agree();
        await this.Click_On_Done_buuton();
    }
}
