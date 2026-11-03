import { Locator, Page } from "@playwright/test";
import { webcommons } from "../../commons/ui/web-common";
import awardeeInfoElements from "../page-elements/awardee-info-elements.json" with { type: "json" };

export class AwardeeInfoSteps {
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

    private async uploadViaTriggerOrNearbyInput(triggerSelector: string, filePath: string): Promise<void> {
        const trigger = this.page.locator(triggerSelector).first();

        try {
            await trigger.setInputFiles(filePath);
            return;
        } catch {
            // Fall back to nearest file input when trigger is a styled span/button.
        }

        const nearbyInput = trigger.locator("xpath=ancestor::*[1]//input[@type='file']").first();
        if (await nearbyInput.count()) {
            await nearbyInput.setInputFiles(filePath);
            return;
        }

        const allFileInputs = this.page.locator("input[type='file']");
        const count = await allFileInputs.count();
        if (count > 0) {
            await allFileInputs.nth(0).setInputFiles(filePath);
        }
    }

    async Click_On_Awardee_Category_Dropdown(): Promise<void> {
        await this.web.clickonElement(awardeeInfoElements.awardeeCategoryDropdown);
    }

    async Select_National_Awardee(): Promise<void> {
        await this.Click_On_Awardee_Category_Dropdown();
        await this.web.clickonElement(awardeeInfoElements.nationalAwardeeOption);
    }

    async Select_Sant_Kabir_Awardee(): Promise<void> {
        await this.Click_On_Awardee_Category_Dropdown();
        await this.web.clickonElement(awardeeInfoElements.santKabirOption);
    }

    async Select_National_Merit_Certificate(): Promise<void> {
        await this.Click_On_Awardee_Category_Dropdown();
        await this.web.clickonElement(awardeeInfoElements.nationalMeritOption);
    }

    async Select_Others_Category(): Promise<void> {
        await this.Click_On_Awardee_Category_Dropdown();
        await this.web.clickonElement(awardeeInfoElements.othersOption);
    }

    async getSelectedCategoryText(): Promise<string> {
        return (await this.page.locator(awardeeInfoElements.awardeeCategoryDropdown).textContent())?.trim() ?? "";
    }

    async isCategoryDropdownDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(awardeeInfoElements.awardeeCategoryDropdown);
    }

    async isCategoryErrorDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(awardeeInfoElements.categoryErrorMessage);
    }

    async getCategoryErrorText(): Promise<string> {
        return (await this.page.locator(awardeeInfoElements.categoryErrorMessage).textContent())?.trim() ?? "";
    }

    async getCategoryOptionsCount(): Promise<number> {
        await this.Click_On_Awardee_Category_Dropdown();
        return this.page.locator(awardeeInfoElements.categoryCheckboxes).count();
    }

    async Click_On_Award_Year_Dropdown(): Promise<void> {
        await this.web.clickonElement(awardeeInfoElements.awardYearDropdown);
    }

    async selectAwardYear(year: string): Promise<void> {
        await this.web.clickonElement(awardeeInfoElements.awardYearToggleButton);
        const yearOption = this.page.locator(`//div[@data-year='${year}']`).first();
        if (await yearOption.count()) {
            await yearOption.click();
            return;
        }
        await this.web.clickonElement(awardeeInfoElements.yearSelection2026);
    }

    async isYearDropdownDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(awardeeInfoElements.awardYearDropdown);
    }

    async isYearErrorDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(awardeeInfoElements.yearErrorMessage);
    }

    async getYearErrorText(): Promise<string> {
        return (await this.page.locator(awardeeInfoElements.yearErrorMessage).textContent())?.trim() ?? "";
    }

    async getYearOptionsCount(): Promise<number> {
        await this.web.clickonElement(awardeeInfoElements.awardYearToggleButton);
        return this.page.locator(awardeeInfoElements.yearOptions).count();
    }

    async enterCraftType(craftType: string): Promise<void> {
        await this.page.locator(awardeeInfoElements.craftTypeInput).clear();
        await this.web.fill(awardeeInfoElements.craftTypeInput, craftType);
    }

    async clearCraftType(): Promise<void> {
        await this.page.locator(awardeeInfoElements.craftTypeInput).clear();
    }

    async getCraftTypeValue(): Promise<string> {
        return this.page.locator(awardeeInfoElements.craftTypeInput).inputValue();
    }

    async getCraftTypePlaceholder(): Promise<string> {
        return (await this.page.locator(awardeeInfoElements.craftTypeInput).getAttribute("placeholder")) ?? "";
    }

    async isCraftTypeDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(awardeeInfoElements.craftTypeInput);
    }

    async isCraftTypeErrorDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(awardeeInfoElements.craftTypeErrorMessage);
    }

    async getCraftTypeErrorText(): Promise<string> {
        return (await this.page.locator(awardeeInfoElements.craftTypeErrorMessage).textContent())?.trim() ?? "";
    }

    async enterCertificateNumber(certNumber: string): Promise<void> {
        await this.web.fill(awardeeInfoElements.certificateNumbersInput, `${certNumber} `);
    }

    async getCertificateNumberPlaceholder(): Promise<string> {
        return (await this.page.locator(awardeeInfoElements.certificateNumbersInput).getAttribute("placeholder")) ?? "";
    }

    async isCertificateNumberInputDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(awardeeInfoElements.certificateNumbersInput);
    }

    async clearCertificateNumberInput(): Promise<void> {
        await this.page.locator(awardeeInfoElements.certificateNumbersInput).clear();
    }

    async uploadCertificateFile(filePath: string): Promise<void> {
        await this.uploadViaTriggerOrNearbyInput(awardeeInfoElements.uploadCertificateInput, filePath);
    }

    async isCertificateUploadErrorDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(awardeeInfoElements.certificateUploadError);
    }

    async getCertificateUploadErrorText(): Promise<string> {
        return (await this.page.locator(awardeeInfoElements.certificateUploadError).textContent())?.trim() ?? "";
    }

    async uploadPhotographFile(filePath: string): Promise<void> {
        await this.uploadViaTriggerOrNearbyInput(awardeeInfoElements.uploadPhotographInput, filePath);
    }

    async isPhotographUploadErrorDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(awardeeInfoElements.photographUploadError);
    }

    async getPhotographUploadErrorText(): Promise<string> {
        return (await this.page.locator(awardeeInfoElements.photographUploadError).textContent())?.trim() ?? "";
    }

    async clickSubmitButton(): Promise<void> {
        await this.web.clickonElement(awardeeInfoElements.submitButton);
    }

    async isSubmitButtonDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(awardeeInfoElements.submitButton);
    }

    async isSubmitButtonEnabled(): Promise<boolean> {
        try {
            return await this.page.locator(awardeeInfoElements.submitButton).isEnabled();
        } catch {
            return false;
        }
    }

    async getSubmitButtonText(): Promise<string> {
        return (await this.page.locator(awardeeInfoElements.submitButton).textContent())?.trim() ?? "";
    }

    async isAwardeeInfoHeaderDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(awardeeInfoElements.awardeeInfoHeader);
    }

    async getAwardeeInfoHeaderText(): Promise<string> {
        return (await this.page.locator(awardeeInfoElements.awardeeInfoHeader).textContent())?.trim() ?? "";
    }

    async isGreatNewsHeadingDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(awardeeInfoElements.greatNewsHeading);
    }

    async scrollToSubmitButton(): Promise<void> {
        await this.page.locator(awardeeInfoElements.submitButton).scrollIntoViewIfNeeded();
    }

    async scrollToElement(element: string | Locator): Promise<void> {
        if (typeof element === "string") {
            await this.page.locator(element).first().scrollIntoViewIfNeeded();
            return;
        }
        await element.first().scrollIntoViewIfNeeded();
    }
}
