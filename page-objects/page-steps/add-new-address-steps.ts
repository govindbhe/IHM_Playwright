import { Page } from "@playwright/test";
import addNewAddressElements from "../page-elements/Add-new-Address-page.json" with { type: "json" };
import { webcommons } from "../../commons/ui/web-common";

export class AddNewAddressSteps {
    page: Page;
    web: webcommons;

    constructor(page: Page) {
        this.page = page;
        this.web = new webcommons(this.page);
    }

    private async clearAndType(locator: string, value: string): Promise<void> {
        const element = this.page.locator(locator);
        await element.waitFor({ state: "visible" });
        await element.fill("");
        await element.fill(value);
    }

    private async getTextFromFirstVisible(...locators: string[]): Promise<string> {
        for (const locator of locators) {
            const elements = this.page.locator(locator);
            const count = await elements.count();
            for (let i = 0; i < count; i++) {
                const candidate = elements.nth(i);
                if (await candidate.isVisible()) {
                    return (await candidate.textContent())?.trim() || "";
                }
            }
        }
        return "";
    }

    async openAddNewAddressForm(): Promise<void> {
        await this.web.clickonElement(addNewAddressElements.addNewAddressButton);
        await this.page.locator(addNewAddressElements.firstNameInput).waitFor({ state: "visible" });
    }

    async isAddressFormDisplayed(): Promise<boolean> {
        try {
            return await this.page.locator(addNewAddressElements.firstNameInput).isVisible({ timeout: 5000 });
        } catch {
            return false;
        }
    }

    async isSaveButtonVisibleAndEnabled(): Promise<boolean> {
        const button = this.page.locator(addNewAddressElements.saveAddressButton).first();
        await button.scrollIntoViewIfNeeded();
        await button.waitFor({ state: "visible" });
        return (await button.isVisible()) && (await button.isEnabled());
    }

    async isDefaultBillingAddressChecked(): Promise<boolean> {
        const checkbox = this.page.locator(addNewAddressElements.defaultBillingCheckbox);
        await checkbox.waitFor({ state: "visible" });
        return await checkbox.isChecked();
    }

    async isDefaultShippingAddressChecked(): Promise<boolean> {
        const checkbox = this.page.locator(addNewAddressElements.defaultShippingCheckbox);
        await checkbox.waitFor({ state: "visible" });
        return await checkbox.isChecked();
    }

    async getSelectedCountry(): Promise<string> {
        const select = this.page.locator(addNewAddressElements.countryDropdown);
        const value = await select.evaluate((el: HTMLSelectElement) => {
            const opt = el.options[el.selectedIndex];
            return opt ? opt.text : "";
        });
        return value.trim();
    }

    async enterFirstName(firstName: string): Promise<void> {
        await this.clearAndType(addNewAddressElements.firstNameInput, firstName);
    }

    async enterLastName(lastName: string): Promise<void> {
        await this.clearAndType(addNewAddressElements.lastNameInput, lastName);
    }

    async clickOnAddNewAddressButton(): Promise<void> {
        await this.web.clickonElement(addNewAddressElements.addNewAddressButton);
    }

    async enterGstin(gstin: string): Promise<void> {
        await this.clearAndType(addNewAddressElements.gstinInput, gstin);
    }

    async enterCompany(company: string): Promise<void> {
        await this.clearAndType(addNewAddressElements.companyInput, company);
    }

    async enterPhoneNumber(phone: string): Promise<void> {
        await this.clearAndType(addNewAddressElements.phoneNumberInput, phone);
    }

    async enterStreetAddress(streetAddress: string): Promise<void> {
        await this.clearAndType(addNewAddressElements.streetAddressInput, streetAddress);
    }

    async selectStateByVisibleText(stateName: string): Promise<void> {
        await this.page.locator(addNewAddressElements.stateDropdown).waitFor({ state: "visible" });
        await this.page.locator(addNewAddressElements.stateDropdown).selectOption({ label: stateName });
    }

    async selectStateByValue(stateValue: string): Promise<void> {
        await this.web.SelectDropdownElement(addNewAddressElements.stateDropdown, stateValue);
    }

    async enterCity(city: string): Promise<void> {
        await this.clearAndType(addNewAddressElements.cityInput, city);
    }

    async enterPincode(pincode: string): Promise<void> {
        await this.clearAndType(addNewAddressElements.pincodeInput, pincode);
    }

    async clickSaveAddress(): Promise<void> {
        await this.web.clickonElement(addNewAddressElements.saveAddressButton);
    }

    async fillMandatoryAddressFields(
        firstName: string,
        lastName: string,
        phone: string,
        streetAddress: string,
        stateName: string,
        city: string,
        pincode: string
    ): Promise<void> {
        await this.enterFirstName(firstName);
        await this.enterLastName(lastName);
        await this.enterPhoneNumber(phone);
        await this.enterStreetAddress(streetAddress);
        await this.selectStateByVisibleText(stateName);
        await this.enterCity(city);
        await this.enterPincode(pincode);
    }

    async getSuccessMessage(): Promise<string> {
        const locator = this.page.locator(addNewAddressElements.saveAddressSuccessMessage).first();
        await locator.waitFor({ state: "visible", timeout: 15000 });
        return await this.getTextFromFirstVisible(addNewAddressElements.saveAddressSuccessMessage);
    }

    async getVisibleRequiredFieldErrorCount(): Promise<number> {
        const errors = this.page.locator(
            "//div[contains(@class,'mage-error') and normalize-space()='This is a required field.']"
        );
        const count = await errors.count();
        let visibleCount = 0;
        for (let i = 0; i < count; i++) {
            if (await errors.nth(i).isVisible()) {
                visibleCount++;
            }
        }
        return visibleCount;
    }

    async getFirstNameValidationMessage(): Promise<string> {
        const locator = this.page.locator(addNewAddressElements.firstNameRequiredErrorMessage);
        await locator.waitFor({ state: "visible", timeout: 5000 });
        return (await locator.textContent())?.trim() || "";
    }

    async getLastNameValidationMessage(): Promise<string> {
        const locator = this.page.locator(addNewAddressElements.lastNameRequiredErrorMessage);
        await locator.waitFor({ state: "visible", timeout: 5000 });
        return (await locator.textContent())?.trim() || "";
    }

    async getPhoneValidationMessage(): Promise<string> {
        const locator = this.page.locator(addNewAddressElements.phoneNumberRequiredErrorMessage);
        await locator.waitFor({ state: "visible", timeout: 5000 });
        return (await locator.textContent())?.trim() || "";
    }

    async getStreetValidationMessage(): Promise<string> {
        const locator = this.page.locator(addNewAddressElements.streetRequiredErrorMessage);
        await locator.waitFor({ state: "visible", timeout: 5000 });
        return (await locator.textContent())?.trim() || "";
    }

    async getStateValidationMessage(): Promise<string> {
        const locator = this.page.locator(addNewAddressElements.stateRequiredErrorMessage);
        await locator.waitFor({ state: "visible", timeout: 5000 });
        return (await locator.textContent())?.trim() || "";
    }

    async getCityValidationMessage(): Promise<string> {
        const locator = this.page.locator(addNewAddressElements.cityRequiredErrorMessage);
        await locator.waitFor({ state: "visible", timeout: 5000 });
        return (await locator.textContent())?.trim() || "";
    }

    async getPincodeValidationMessage(): Promise<string> {
        const locator = this.page.locator(addNewAddressElements.pincodeRequiredErrorMessage);
        await locator.waitFor({ state: "visible", timeout: 5000 });
        return (await locator.textContent())?.trim() || "";
    }

    async sendFirstName(): Promise<void> {
        await this.enterFirstName("Govind");
    }

    async sendLastName(): Promise<void> {
        await this.enterLastName("Bhee");
    }

    async clickOnAddNewAddress(): Promise<void> {
        await this.openAddNewAddressForm();
    }

    async sendGstin(): Promise<void> {
        await this.enterGstin("27AAACB5678R1ZP");
    }

    async sendPhoneNumber(): Promise<void> {
        await this.enterPhoneNumber("9663636265");
    }

    async sendCompany(): Promise<void> {
        await this.enterCompany("IHM Pvt Ltd");
    }

    async sendStreetAddress(): Promise<void> {
        await this.enterStreetAddress("Express park noida IHM Pvt Ltd 201301");
    }

    async sendCity(): Promise<void> {
        await this.enterCity("Nanded");
    }

    async sendPincode(): Promise<void> {
        await this.enterPincode("565556");
    }

    async selectState(): Promise<void> {
        await this.selectStateByVisibleText("Maharashtra");
    }

    async clickOnSaveButton(): Promise<void> {
        await this.clickSaveAddress();
    }

    async clickOnDefaultBillingAddress(): Promise<void> {
        await this.web.clickonElement(addNewAddressElements.defaultBillingAddressLabel);
    }

    async clickOnDefaultShippingAddress(): Promise<void> {
        await this.web.clickonElement(addNewAddressElements.defaultShippingAddressLabel);
    }

    async addAddressSuccessMessage(): Promise<string> {
        return await this.getSuccessMessage();
    }

    async deleteAddressSuccessMessage(): Promise<string> {
        return await this.getTextFromFirstVisible(addNewAddressElements.deleteAddressSuccessMessage);
    }

    async clickOnDeleteAddressOkButton(): Promise<void> {
        await this.web.clickonElement(addNewAddressElements.deleteAddressOkButton);
    }

    async clearFirstNameField(): Promise<void> {
        await this.page.locator(addNewAddressElements.firstNameInput).fill("");
    }

    async clearLastNameField(): Promise<void> {
        await this.page.locator(addNewAddressElements.lastNameInput).fill("");
    }

    async clearPhoneNumberField(): Promise<void> {
        await this.page.locator(addNewAddressElements.phoneNumberInput).fill("");
    }

    async clearStreetAddressField(): Promise<void> {
        await this.page.locator(addNewAddressElements.streetAddressInput).fill("");
    }

    async clearCityField(): Promise<void> {
        await this.page.locator(addNewAddressElements.cityInput).fill("");
    }

    async clearPincodeField(): Promise<void> {
        await this.page.locator(addNewAddressElements.pincodeInput).fill("");
    }

    async isFirstNameFieldVisible(): Promise<boolean> {
        return await this.page.locator(addNewAddressElements.firstNameInput).isVisible();
    }

    async isLastNameFieldVisible(): Promise<boolean> {
        return await this.page.locator(addNewAddressElements.lastNameInput).isVisible();
    }

    async isPhoneNumberFieldVisible(): Promise<boolean> {
        return await this.page.locator(addNewAddressElements.phoneNumberInput).isVisible();
    }

    async isStreetAddressFieldVisible(): Promise<boolean> {
        return await this.page.locator(addNewAddressElements.streetAddressInput).isVisible();
    }

    async isStateDropdownVisible(): Promise<boolean> {
        return await this.page.locator(addNewAddressElements.stateDropdown).isVisible();
    }

    async isCityFieldVisible(): Promise<boolean> {
        return await this.page.locator(addNewAddressElements.cityInput).isVisible();
    }

    async isPincodeFieldVisible(): Promise<boolean> {
        return await this.page.locator(addNewAddressElements.pincodeInput).isVisible();
    }

    async isCountryDropdownVisible(): Promise<boolean> {
        return await this.page.locator(addNewAddressElements.countryDropdown).isVisible();
    }

    async getSelectedState(): Promise<string> {
        const select = this.page.locator(addNewAddressElements.stateDropdown);
        const value = await select.evaluate((el: HTMLSelectElement) => {
            const opt = el.options[el.selectedIndex];
            return opt ? opt.text : "";
        });
        return value.trim();
    }

    async isGstinFieldVisible(): Promise<boolean> {
        return await this.page.locator(addNewAddressElements.gstinInput).isVisible();
    }

    async isCompanyFieldVisible(): Promise<boolean> {
        return await this.page.locator(addNewAddressElements.companyInput).isVisible();
    }

    // Legacy aliases to match original Java method names
    async click_on_add_new_address_button(): Promise<void> {
        await this.clickOnAddNewAddressButton();
    }

    async Sendfirst_name(): Promise<void> {
        await this.sendFirstName();
    }

    async send_last_name(): Promise<void> {
        await this.sendLastName();
    }

    async Click_on_add_new_address(): Promise<void> {
        await this.clickOnAddNewAddress();
    }

    async Send_on_send_gstin(): Promise<void> {
        await this.sendGstin();
    }

    async send_phone_number(): Promise<void> {
        await this.sendPhoneNumber();
    }

    async send_company(): Promise<void> {
        await this.sendCompany();
    }

    async send_street_address(): Promise<void> {
        await this.sendStreetAddress();
    }

    async send_city(): Promise<void> {
        await this.sendCity();
    }

    async send_pincode(): Promise<void> {
        await this.sendPincode();
    }

    async select_state(): Promise<void> {
        await this.selectState();
    }

    async Click_on_save_button(): Promise<void> {
        await this.clickOnSaveButton();
    }

    async Click_on_default_billing_address(): Promise<void> {
        await this.clickOnDefaultBillingAddress();
    }

    async Click_on_default_shipping_address(): Promise<void> {
        await this.clickOnDefaultShippingAddress();
    }

    async Add_Address_Success_Massage(): Promise<string> {
        return await this.addAddressSuccessMessage();
    }

    async Delete_Address_Success_Massage(): Promise<string> {
        return await this.deleteAddressSuccessMessage();
    }

    async Click_on_delete_address_ok_button(): Promise<void> {
        await this.clickOnDeleteAddressOkButton();
    }
}
