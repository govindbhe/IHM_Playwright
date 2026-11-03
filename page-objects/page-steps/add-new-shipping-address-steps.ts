import { Page } from "@playwright/test";
import shippingAddressElements from "../page-elements/Add-new-shipping-address.json" with { type: "json" };
import { webcommons } from "../../commons/ui/web-common";

export class AddNewShippingAddressSteps {
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

    private async isVisible(locator: string, timeout = 5000): Promise<boolean> {
        try {
            return await this.page.locator(locator).isVisible({ timeout });
        } catch {
            return false;
        }
    }

    private async getInputPlaceholder(locator: string): Promise<string> {
        return (await this.page.locator(locator).getAttribute("placeholder")) || "";
    }

    private async getInputValue(locator: string): Promise<string> {
        return await this.page.locator(locator).inputValue();
    }

    async Send_firstname(): Promise<void> {
        await this.clearAndType(shippingAddressElements.firstNameInput, "Govind");
    }

    async Send_mobile_no(): Promise<void> {
        await this.clearAndType(shippingAddressElements.mobileNumberInput, "9763274722");
    }

    async Send_lastname(): Promise<void> {
        await this.clearAndType(shippingAddressElements.lastNameInput, "Bhelonde");
    }

    async Send_Street_Adress(): Promise<void> {
        await this.clearAndType(shippingAddressElements.addressInput, "Delhi");
    }

    async Select_country(): Promise<void> {
        await this.page.locator(shippingAddressElements.countryDropdown).selectOption({ value: "India" });
    }

    async Select_State(): Promise<void> {
        await this.page.locator(shippingAddressElements.stateDropdown).selectOption({ value: "Delhi" });
    }

    async Send_City(): Promise<void> {
        await this.clearAndType(shippingAddressElements.cityInput, "Delhi");
    }

    async Send_ZipCode(): Promise<void> {
        await this.clearAndType(shippingAddressElements.zipCodeInput, "110003");
    }

    async Click_On_Landmark(): Promise<void> {
        await this.clearAndType(shippingAddressElements.landmarkInput, "Near AIIMS");
    }

    async Click_On_Add_And_Shipehere(): Promise<void> {
        await this.web.clickonElement(shippingAddressElements.addAndShipHereButton);
    }

    async enterFirstname(value: string): Promise<void> {
        await this.clearAndType(shippingAddressElements.firstNameInput, value);
    }

    async enterLastname(value: string): Promise<void> {
        await this.clearAndType(shippingAddressElements.lastNameInput, value);
    }

    async enterAddress(value: string): Promise<void> {
        await this.clearAndType(shippingAddressElements.addressInput, value);
    }

    async enterLandmark(value: string): Promise<void> {
        await this.clearAndType(shippingAddressElements.landmarkInput, value);
    }

    async enterCity(value: string): Promise<void> {
        await this.clearAndType(shippingAddressElements.cityInput, value);
    }

    async enterZipCode(value: string): Promise<void> {
        await this.clearAndType(shippingAddressElements.zipCodeInput, value);
    }

    async enterMobileNo(value: string): Promise<void> {
        await this.clearAndType(shippingAddressElements.mobileNumberInput, value);
    }

    async selectCountryByVisibleText(text: string): Promise<void> {
        await this.page.locator(shippingAddressElements.countryDropdown).selectOption({ label: text });
    }

    async selectStateByVisibleText(text: string): Promise<void> {
        await this.page.locator(shippingAddressElements.stateDropdown).selectOption({ label: text });
    }

    async isNewAddressDialogDisplayed(): Promise<boolean> {
        return await this.isVisible(shippingAddressElements.newAddressDialogHeader, 10000);
    }

    async isFirstnameFieldDisplayed(): Promise<boolean> {
        return await this.isVisible(shippingAddressElements.firstNameInput);
    }

    async isLastnameFieldDisplayed(): Promise<boolean> {
        return await this.isVisible(shippingAddressElements.lastNameInput);
    }

    async isAddressFieldDisplayed(): Promise<boolean> {
        return await this.isVisible(shippingAddressElements.addressInput);
    }

    async isLandmarkFieldDisplayed(): Promise<boolean> {
        return await this.isVisible(shippingAddressElements.landmarkInput);
    }

    async isCountryDropdownDisplayed(): Promise<boolean> {
        return await this.isVisible(shippingAddressElements.countryDropdown);
    }

    async isStateDropdownDisplayed(): Promise<boolean> {
        return await this.isVisible(shippingAddressElements.stateDropdown);
    }

    async isCityFieldDisplayed(): Promise<boolean> {
        return await this.isVisible(shippingAddressElements.cityInput);
    }

    async isPincodeFieldDisplayed(): Promise<boolean> {
        return await this.isVisible(shippingAddressElements.zipCodeInput);
    }

    async isMobileFieldDisplayed(): Promise<boolean> {
        return await this.isVisible(shippingAddressElements.mobileNumberInput);
    }

    async isAddAndShipHereBtnDisplayed(): Promise<boolean> {
        return await this.isVisible(shippingAddressElements.addAndShipHereButton);
    }

    async isCancelBtnDisplayed(): Promise<boolean> {
        return await this.isVisible(shippingAddressElements.cancelButton);
    }

    async clickCancelBtn(): Promise<void> {
        await this.web.clickonElement(shippingAddressElements.cancelButton);
    }

    async clickCloseDialogBtn(): Promise<void> {
        await this.web.clickonElement(shippingAddressElements.closeDialogButton);
    }

    async getFirstnamePlaceholder(): Promise<string> {
        return await this.getInputPlaceholder(shippingAddressElements.firstNameInput);
    }

    async getLastnamePlaceholder(): Promise<string> {
        return await this.getInputPlaceholder(shippingAddressElements.lastNameInput);
    }

    async getAddressPlaceholder(): Promise<string> {
        return await this.getInputPlaceholder(shippingAddressElements.addressInput);
    }

    async getLandmarkPlaceholder(): Promise<string> {
        return await this.getInputPlaceholder(shippingAddressElements.landmarkInput);
    }

    async getCityPlaceholder(): Promise<string> {
        return await this.getInputPlaceholder(shippingAddressElements.cityInput);
    }

    async getPincodePlaceholder(): Promise<string> {
        return await this.getInputPlaceholder(shippingAddressElements.zipCodeInput);
    }

    async getMobilePlaceholder(): Promise<string> {
        return await this.getInputPlaceholder(shippingAddressElements.mobileNumberInput);
    }

    async getSelectedCountry(): Promise<string> {
        const selectedText = await this.page
            .locator(`${shippingAddressElements.countryDropdown} option:checked`)
            .textContent();
        return (selectedText || "").trim();
    }

    async getSelectedState(): Promise<string> {
        const selectedText = await this.page
            .locator(`${shippingAddressElements.stateDropdown} option:checked`)
            .textContent();
        return (selectedText || "").trim();
    }

    async isFirstnameErrorDisplayed(): Promise<boolean> {
        return await this.isVisible(shippingAddressElements.firstNameErrorMessage);
    }

    async isLastnameErrorDisplayed(): Promise<boolean> {
        return await this.isVisible(shippingAddressElements.lastNameErrorMessage);
    }

    async isAddressErrorDisplayed(): Promise<boolean> {
        return await this.isVisible(shippingAddressElements.addressErrorMessage);
    }

    async isCityErrorDisplayed(): Promise<boolean> {
        return await this.isVisible(shippingAddressElements.cityErrorMessage);
    }

    async isPincodeErrorDisplayed(): Promise<boolean> {
        return await this.isVisible(shippingAddressElements.pincodeErrorMessage);
    }

    async isMobileErrorDisplayed(): Promise<boolean> {
        return await this.isVisible(shippingAddressElements.mobileErrorMessage);
    }

    async clearAllFields(): Promise<void> {
        await this.page.locator(shippingAddressElements.firstNameInput).fill("");
        await this.page.locator(shippingAddressElements.lastNameInput).fill("");
        await this.page.locator(shippingAddressElements.addressInput).fill("");
        await this.page.locator(shippingAddressElements.landmarkInput).fill("");
        await this.page.locator(shippingAddressElements.cityInput).fill("");
        await this.page.locator(shippingAddressElements.zipCodeInput).fill("");
        await this.page.locator(shippingAddressElements.mobileNumberInput).fill("");
    }

    async getFirstnameValue(): Promise<string> {
        return await this.getInputValue(shippingAddressElements.firstNameInput);
    }

    async getLastnameValue(): Promise<string> {
        return await this.getInputValue(shippingAddressElements.lastNameInput);
    }

    async getAddressValue(): Promise<string> {
        return await this.getInputValue(shippingAddressElements.addressInput);
    }

    async getCityValue(): Promise<string> {
        return await this.getInputValue(shippingAddressElements.cityInput);
    }

    async getZipCodeValue(): Promise<string> {
        return await this.getInputValue(shippingAddressElements.zipCodeInput);
    }

    async getMobileNoValue(): Promise<string> {
        return await this.getInputValue(shippingAddressElements.mobileNumberInput);
    }

    async getAddAndShipHereBtnText(): Promise<string> {
        return (await this.page.locator(shippingAddressElements.addAndShipHereButton).textContent())?.trim() || "";
    }
}
