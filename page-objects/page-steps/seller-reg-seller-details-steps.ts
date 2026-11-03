import { Page } from "@playwright/test";
import sellerDetailsElements from "../page-elements/seller-reg-seller-details-elements.json" with { type: "json" };
import { webcommons } from "../../commons/ui/web-common";

export class SellerRegSellerDetailsSteps {
    page: Page;
    web: webcommons;

    constructor(page: Page) {
        this.page = page;
        this.web = new webcommons(this.page);
    }

    async Select_deals_in(): Promise<void> {
        await this.page.locator(sellerDetailsElements.dealsInDropdown).selectOption({ label: "Handloom" });
    }

    async Send_Pan(): Promise<void> {
        await this.web.fill(sellerDetailsElements.panInput, "CSPPB4515J");
    }

    async Select_Taxpayer_type(): Promise<void> {
        await this.page.locator(sellerDetailsElements.taxpayerTypeDropdown).selectOption({ label: "Non-GST" });
    }

    async Pan_upload(filePath?: string): Promise<void> {
        const path = filePath ?? "F:/new vol/Documents/id1.jpg";
        await this.page.locator(sellerDetailsElements.panUploadInput).setInputFiles(path);
    }

    async send_Gst(): Promise<void> {
        await this.web.fill(sellerDetailsElements.gstIdInput, "N123456789012K3");
    }

    async Click_any_where(): Promise<void> {
        await this.web.clickonElement(sellerDetailsElements.clickAnyPlace);
    }

    async send_Gst_upload(filePath?: string): Promise<void> {
        const path = filePath ?? "F:/new vol/Documents/Wromg Mail.PNG";
        await this.page.locator(sellerDetailsElements.gstUploadInput).setInputFiles(path);
    }

    async send_MD(): Promise<void> {
        await this.web.fill(sellerDetailsElements.mdInput, "Govind");
    }

    async select_Designation(): Promise<void> {
        await this.page.locator(sellerDetailsElements.designationDropdown).selectOption({ label: "President" });
    }

    async Upload_Md(filePath?: string): Promise<void> {
        const path = filePath ?? "F:/new vol/Documents/square_200x200_1.png";
        await this.page.locator(sellerDetailsElements.uploadMdInput).setInputFiles(path);
    }

    async send_Officer_Name(): Promise<void> {
        await this.web.fill(sellerDetailsElements.officerNameInput, "Ggg");
    }

    async Send_Officer_Mob(): Promise<void> {
        await this.web.fill(sellerDetailsElements.officerMobInput, "8234567899");
    }

    async Click_on_Proceed(): Promise<void> {
        await this.web.clickonElement(sellerDetailsElements.proceedButton);
    }

    async seller_details(): Promise<void> {
        await this.Select_deals_in();
        await this.Send_Pan();
        await this.Pan_upload();
        await this.Select_Taxpayer_type();
        await this.send_Gst();
        await this.page.waitForTimeout(2000);
        await this.Click_on_Proceed();
        await this.page.waitForTimeout(2000);
        await this.Click_on_Proceed();
    }
}
