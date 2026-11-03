import { Page } from "@playwright/test";
import raiseQueryElements from "../page-elements/buyer-raise-query-elements.json" with { type: "json" };
import { webcommons } from "../../commons/ui/web-common";

export class BuyerRaiseQuerySteps {
    page: Page;
    web: webcommons;

    constructor(page: Page) {
        this.page = page;
        this.web = new webcommons(this.page);
    }

    async isRaiseQueryModalDisplayed(): Promise<boolean> {
        try {
            return await this.page.locator(raiseQueryElements.categoryDropdown).isVisible({ timeout: 5000 });
        } catch {
            return false;
        }
    }

    async selectCategory(): Promise<void> {
        await this.web.SelectDropdownElement(raiseQueryElements.categoryDropdown, "Missing Items");
        console.log("✓ Selected default category: Missing Items");
    }

    async selectCategoryByVisibleText(categoryText: string): Promise<void> {
        await this.page.locator(raiseQueryElements.categoryDropdown).waitFor({ state: "visible" });
        await this.page.locator(raiseQueryElements.categoryDropdown).selectOption({ label: categoryText });
        console.log(`✓ Selected category: ${categoryText}`);
    }

    async getSelectedCategory(): Promise<string> {
        const selectedText = await this.page
            .locator(`${raiseQueryElements.categoryDropdown} option:checked`)
            .textContent();
        return (selectedText || "").trim();
    }

    async getAllCategoryOptions(): Promise<string[]> {
        const optionTexts = await this.page
            .locator(`${raiseQueryElements.categoryDropdown} option`)
            .allTextContents();
        return optionTexts.map((text) => text.trim());
    }

    async sendQuery(): Promise<void> {
        const defaultMessage = "This is a test message for the contact us page.   Please ignore this message.";
        await this.web.fill(raiseQueryElements.queryTextArea, defaultMessage);
        console.log("✓ Entered default query text");
    }

    async enterQueryText(queryText: string): Promise<void> {
        await this.web.fill(raiseQueryElements.queryTextArea, queryText);
        console.log("✓ Entered query text");
    }

    async clearQueryText(): Promise<void> {
        await this.page.locator(raiseQueryElements.queryTextArea).fill("");
        console.log("✓ Cleared query text");
    }

    async getQueryTextValue(): Promise<string> {
        return await this.page.locator(raiseQueryElements.queryTextArea).inputValue();
    }

    async clickOnSubmitButton(): Promise<void> {
        await this.web.clickonElement(raiseQueryElements.submitButton);
        console.log("✓ Clicked on submit button");
    }

    async isSubmitButtonVisibleAndEnabled(): Promise<boolean> {
        try {
            const button = this.page.locator(raiseQueryElements.submitButton);
            const isVisible = await button.isVisible({ timeout: 5000 });
            const isEnabled = await button.isEnabled();
            return isVisible && isEnabled;
        } catch {
            return false;
        }
    }

    async clickOnCloseButton(): Promise<void> {
        await this.web.clickonElement(raiseQueryElements.closeButton);
        console.log("✓ Clicked on close button");
    }

    async isModalClosed(): Promise<boolean> {
        try {
            await this.page.locator(raiseQueryElements.categoryDropdown).waitFor({ state: "hidden", timeout: 5000 });
            return true;
        } catch {
            return false;
        }
    }

    async isSuccessMessageDisplayed(): Promise<boolean> {
        try {
            return await this.page.locator(raiseQueryElements.queryRaisedSuccessMessage).isVisible({ timeout: 5000 });
        } catch {
            return false;
        }
    }

    async getQueryRaisedSuccessMessage(): Promise<string> {
        const text = await this.page.locator(raiseQueryElements.queryRaisedSuccessMessage).textContent();
        return (text || "").trim();
    }
}
