import { expect, Page } from "@playwright/test";
import basicInfoElements from "../page-elements/seller-reg-basic-info-elements.json" with { type: "json" };
import { webcommons } from "../../commons/ui/web-common";

export class SellerRegBasicInfoSteps {
    page: Page;
    web: webcommons;

    constructor(page: Page) {
        this.page = page;
        this.web = new webcommons(this.page);
    }

    private async setState(expectedState: string): Promise<void> {
        const stateDropdown = this.page.locator(basicInfoElements.stateDropdown).first();

        // Some environments render State as a dropdown, others render it as a readonly input.
        if (await stateDropdown.count()) {
            await stateDropdown.waitFor({ state: "visible", timeout: 10000 });
            try {
                await stateDropdown.selectOption({ label: expectedState });
            } catch {
                await stateDropdown.selectOption({ value: expectedState });
            }
        }

        const stateInput = this.page.locator(basicInfoElements.stateInput).first();
        await stateInput.waitFor({ state: "visible", timeout: 15000 });
        await expect(stateInput).toHaveValue(new RegExp(expectedState, "i"), { timeout: 15000 });
    }

    async Select_Select_Seller_Type(): Promise<void> {
        await this.page.locator(basicInfoElements.sellerTypeDropdown).selectOption({ label: "Corporation" });
    }

    async Send_Org_Reg_ID(): Promise<void> {
        await this.web.fill(basicInfoElements.orgRegIdInput, "Dic012542");
    }

    async Select_Seller_State(): Promise<void> {
        await this.page.locator(basicInfoElements.sellerStateListDropdown).selectOption({ label: "Maharashtra" });
    }

    async Select_Wsc_Hsc(): Promise<void> {
        await this.page.locator(basicInfoElements.wscHscDropdown).selectOption({ label: "HSC" });
    }

    async Select_Wsc_Hsc_Name(name: string): Promise<void> {
        // WSC/HSC Name options load dynamically after state + WSC/HSC are selected
        const dropdown = this.page.locator(basicInfoElements.wscHscNameDropdown);
        await dropdown.waitFor({ state: "visible", timeout: 10000 });
        // Wait for options to populate
        await this.page.waitForFunction(
            (selector: string) => {
                const el = document.querySelector(selector) as HTMLSelectElement;
                return el && el.options.length > 1;
            },
            "select#wkmpvr_wsc_hsc_list",
            { timeout: 15000 }
        );
        await dropdown.selectOption({ label: name });
    }

    async send_Org_Name(): Promise<void> {
        await this.web.fill(basicInfoElements.orgNameInput, "DICGRB");
    }

    async send_Permenant_Address(): Promise<void> {
        await this.web.fill(basicInfoElements.permanentAddressInput, "Nanded");
    }

    async send_City_District(): Promise<void> {
        await this.web.fill(basicInfoElements.cityDistrictInput, "Nanded");
    }

    async send_State(): Promise<void> {
        await this.setState("Maharashtra");
        const stateValue = await this.page.locator(basicInfoElements.stateInput).inputValue().catch(() => "");
        console.log("State selected: " + stateValue);
    }

    async send_pin(): Promise<void> {
        await this.web.fill(basicInfoElements.pinInput, "431709");
    }

    async send_Mobile_No(): Promise<void> {
        await this.web.fill(basicInfoElements.mobileNoInput, "9234567890");
    }

    async send_Upload_ID(filePath?: string): Promise<void> {
        const path = filePath ?? "F:/new vol/Documents/Invoice Order # 000001023.pdf";
        await this.page.locator(basicInfoElements.uploadIdInput).setInputFiles(path);
    }

    async Click_Proceed_button(): Promise<void> {
        await this.web.clickonElement(basicInfoElements.proceedButton);
    }

    async basic_info(): Promise<void> {
        // Select Seller Type
        await this.page.locator(basicInfoElements.sellerTypeDropdown).selectOption({ label: "Corporation" });
        await this.page.waitForTimeout(500);

        // Fill Organization Registration ID
        await this.web.fill(basicInfoElements.orgRegIdInput, "Dic012542");
        await this.page.waitForTimeout(500);

        // Select Seller State from the new state dropdown
        await this.page.locator(basicInfoElements.sellerStateListDropdown).selectOption({ label: "Maharashtra" });
        await this.page.waitForTimeout(1000);

        // Select WSC/HSC type
        await this.page.locator(basicInfoElements.wscHscDropdown).selectOption({ label: "HSC" });
        await this.page.waitForTimeout(1000);

        // Wait for WSC/HSC Name options to load dynamically, then select
        const wscHscNameDropdown = this.page.locator(basicInfoElements.wscHscNameDropdown);
        await this.page.waitForFunction(
            (selector: string) => {
                const el = document.querySelector(selector) as HTMLSelectElement;
                return el && el.options.length > 1;
            },
            "select#wkmpvr_wsc_hsc_list",
            { timeout: 15000 }
        );
        // Select the first available WSC/HSC Name option
        await wscHscNameDropdown.selectOption({ index: 1 });
        await this.page.waitForTimeout(500);

        // Fill Seller Name
        await this.web.fill(basicInfoElements.orgNameInput, "DICGRB");

        // Fill Permanent Address
        await this.web.fill(basicInfoElements.permanentAddressInput, "Nanded");

        // Fill Pincode first, since it may trigger an auto-populate lookup
        await this.web.fill(basicInfoElements.pinInput, "431709");
        await this.page.waitForTimeout(2000);

        // City/District is not auto-populated on this build, so fill it if still empty
        const cityDistrict = this.page.locator(basicInfoElements.cityDistrictInput).first();
        if ((await cityDistrict.inputValue()) === "") {
            await cityDistrict.fill("Nanded");
        }
        await this.page.waitForTimeout(500);

        // Fill mobile number
        await this.web.fill(basicInfoElements.mobileNoInput, "8323456789");
        await this.page.waitForTimeout(500);

        // Upload document
        await this.page.locator(basicInfoElements.uploadIdInput).setInputFiles("F:/new vol/Documents/Invoice Buyer.pdf");
        await this.page.waitForTimeout(3000);

        // Click Proceed button(s)
        await this.web.clickonElement(basicInfoElements.proceedButton);
        await this.page.waitForTimeout(5000);
        await this.web.clickonElement(basicInfoElements.proceedButton);
    }
}
