import { Page, expect } from "@playwright/test";
import { webcommons } from "../../commons/ui/web-common";

export class ProductEditSteps {
    page: Page;
    web: webcommons;

    constructor(page: Page) {
        this.page = page;
        this.web = new webcommons(this.page);
    }

    async fillProductName(name: string) {
        await this.web.fill("input[name='productName']", name);
        console.log(`✓ Entered product name: ${name}`);
    }

    async fillProductCategory(category: string) {
        await this.web.SelectDropdownElement("select[name='category']", category);
        console.log(`✓ Selected product category: ${category}`);
    }

    async fillProductPrice(price: string) {
        await this.web.fill("input[name='price']", price);
        console.log(`✓ Entered product price: ${price}`);
    }

    async fillProductDescription(description: string) {
        await this.web.fill("textarea[name='description']", description);
        console.log(`✓ Entered product description`);
    }

    async fillProductQuantity(quantity: string) {
        await this.web.fill("input[name='quantity']", quantity);
        console.log(`✓ Entered product quantity: ${quantity}`);
    }

    async clickSaveProductButton() {
        await this.web.clickonElement("button:has-text('Save Product')");
        console.log("✓ Clicked on Save Product button");
    }

    async verifyProductSavedSuccessfully() {
        const successMessage = this.page.locator("div:has-text('Product saved successfully')");
        await expect(successMessage).toBeVisible();
        console.log("✓ Product saved successfully");
    }

    async editProduct(productData: any) {
        await this.fillProductName(productData.name);
        await this.fillProductCategory(productData.category);
        await this.fillProductPrice(productData.price);
        await this.fillProductDescription(productData.description);
        await this.fillProductQuantity(productData.quantity);
        await this.clickSaveProductButton();
        console.log("✓ Product editing completed");
    }
}
