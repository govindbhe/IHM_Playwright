import { Page, expect } from "@playwright/test";
import { webcommons } from "../../commons/ui/web-common";
import inventoryUpdateElements from "../page-elements/inventory-update-elements.json" with { type: "json" };

export class InventoryUpdateSteps {
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

    async enterSearchSku(sku: string): Promise<void> {
        const field = this.page.locator(inventoryUpdateElements.searchSkuField).first();
        await expect(field).toBeVisible({ timeout: 20000 });
        await field.fill("");
        await field.fill(sku);
    }

    async selectStatusFilter(statusOption: string): Promise<void> {
        const dropdown = this.page.locator(inventoryUpdateElements.statusDropdown).first();
        await expect(dropdown).toBeVisible({ timeout: 20000 });
        await dropdown.selectOption({ label: statusOption });
    }

    async clickSearch(): Promise<void> {
        const button = this.page.locator(inventoryUpdateElements.searchButton).first();
        await expect(button).toBeVisible({ timeout: 20000 });
        await expect(button).toBeEnabled({ timeout: 20000 });
        await button.click();
    }

    async clickFirstEdit(): Promise<void> {
        const button = this.page.locator(inventoryUpdateElements.firstEditButton).first();
        await expect(button).toBeVisible({ timeout: 20000 });
        await expect(button).toBeEnabled({ timeout: 20000 });
        await button.click();
    }

    async updateStockInModal(stock: string): Promise<void> {
        const field = this.page.locator(inventoryUpdateElements.modalStockField).first();
        await expect(field).toBeVisible({ timeout: 20000 });
        await field.fill("");
        await field.fill(stock);
    }

    async updateListingPriceInModal(price: string): Promise<void> {
        const field = this.page.locator(inventoryUpdateElements.modalListingPriceField).first();
        await expect(field).toBeVisible({ timeout: 20000 });
        await field.fill("");
        await field.fill(price);
    }

    async updateSpecialPriceInModal(specialPrice: string): Promise<void> {
        const field = this.page.locator(inventoryUpdateElements.modalSpecialPriceField).first();
        await expect(field).toBeVisible({ timeout: 20000 });
        await field.fill("");
        await field.fill(specialPrice);
    }

    async clickSaveInModal(): Promise<void> {
        const button = this.page.locator(inventoryUpdateElements.modalSaveButton).first();
        await expect(button).toBeVisible({ timeout: 20000 });
        await expect(button).toBeEnabled({ timeout: 20000 });
        await button.click();
    }

    async clickCancelInModal(): Promise<void> {
        const button = this.page.locator(inventoryUpdateElements.modalCancelButton).first();
        await expect(button).toBeVisible({ timeout: 20000 });
        await expect(button).toBeEnabled({ timeout: 20000 });
        await button.click();
    }

    async getSuccessMessageText(): Promise<string> {
        const message = this.page.locator(inventoryUpdateElements.successMessage).first();
        await expect(message).toBeVisible({ timeout: 20000 });
        return (await message.textContent())?.trim() ?? "";
    }

    async getErrorMessageText(): Promise<string> {
        const message = this.page.locator(inventoryUpdateElements.errorMessage).first();
        await expect(message).toBeVisible({ timeout: 20000 });
        return (await message.textContent())?.trim() ?? "";
    }

    async isSearchSkuFieldDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(inventoryUpdateElements.searchSkuField);
    }

    async isStatusDropdownDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(inventoryUpdateElements.statusDropdown);
    }

    async isSearchButtonDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(inventoryUpdateElements.searchButton);
    }
}
