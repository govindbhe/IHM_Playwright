import { Page } from "@playwright/test";
import communicationAddressElements from "../page-elements/seller-reg-communication-address-elements.json" with { type: "json" };
import { webcommons } from "../../commons/ui/web-common";

export class SellerRegCommunicationAddressSteps {
    page: Page;
    web: webcommons;

    constructor(page: Page) {
        this.page = page;
        this.web = new webcommons(this.page);
    }

    async Click_On_Use_permenant_Adress(): Promise<void> {
        await this.web.clickonElement(communicationAddressElements.usePermanentAddressCheckbox);
    }

    async send_Company_Name(): Promise<void> {
        await this.web.fill(communicationAddressElements.companyNameInput, "Govi012");
    }

    async send_Phone_number(): Promise<void> {
        await this.web.fill(communicationAddressElements.phoneNumberInput, "9234567890");
    }

    async send_Street_Address(): Promise<void> {
        await this.web.fill(communicationAddressElements.streetAddressInput, "Nanded");
    }

    async send_PostalCode(): Promise<void> {
        await this.web.fill(communicationAddressElements.postalCodeInput, "431709");
    }

    async select_Country(): Promise<void> {
        await this.page.locator(communicationAddressElements.countryDropdown).selectOption({ label: "India" });
    }

    async send_City_District1(): Promise<void> {
        await this.web.fill(communicationAddressElements.cityDistrictInput, "Nanded");
    }

    async send_State_Province(): Promise<void> {
        await this.page.locator(communicationAddressElements.stateProvinceDropdown).selectOption({ label: "Maharashtra" });
    }

    async send_Proceed_button2(): Promise<void> {
        await this.web.clickonElement(communicationAddressElements.proceedButton);
    }

    async comm_Address(): Promise<void> {
        await this.Click_On_Use_permenant_Adress();
        await this.send_State_Province();
        await this.send_Proceed_button2();
    }
}
