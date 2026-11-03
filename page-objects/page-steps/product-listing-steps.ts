import { Page } from "@playwright/test";
import { webcommons } from "../../commons/ui/web-common";
import productListingElements from "../page-elements/product-listing-elements.json" with { type: "json" };

export class ProductListingSteps {
    page: Page;
    web: webcommons;

    constructor(page: Page) {
        this.page = page;
        this.web = new webcommons(this.page);
    }

    async Click_on_pencileIcon(): Promise<void> {
        await this.web.clickonElement(productListingElements.pencileIcon);
    }

    async Click_on_OK_button(): Promise<void> {
        await this.web.clickonElement(productListingElements.okPopup);
    }

    async send_on_New_Product_Name(): Promise<void> {
        await this.web.fill(productListingElements.productNameInput, "New Test Product");
    }

    async Click_on_Save_button(): Promise<void> {
        await this.web.clickonElement(productListingElements.saveButton);
    }

    async Product_Save_Success_Massage(): Promise<string> {
        return this.Product_Save_Success_Massage_With_Retry();
    }

    private async Product_Save_Success_Massage_With_Retry(): Promise<string> {
        const maxRetries = 3;
        const waitSeconds = 3;

        for (let i = 0; i < maxRetries; i++) {
            try {
                await this.page.waitForTimeout(waitSeconds * 1000);
                const text = (await this.page.locator(productListingElements.productSaveSuccessMessage).first().textContent())?.trim() ?? "";
                if (text !== "") {
                    return text;
                }
            } catch {
                if (i === maxRetries - 1) {
                    throw new Error(
                        `Unable to find success message after ${maxRetries} attempts. Expected text: 'Your product has been successfully saved'. XPath used: ${productListingElements.productSaveSuccessMessage}`
                    );
                }
            }
        }

        return "";
    }

    async getZeroPriceProducts(): Promise<string[]> {
        try {
            const result = await this.page.evaluate(() => {
                const productNodes = document.evaluate(
                    "//li[contains(@class,'item product product-item')]",
                    document,
                    null,
                    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                    null
                );

                const zeroPriceList: string[] = [];

                for (let i = 0; i < productNodes.snapshotLength; i++) {
                    const product = productNodes.snapshotItem(i) as Node;

                    const nameNode = document.evaluate(
                        ".//a[@class='product-item-link']",
                        product,
                        null,
                        XPathResult.FIRST_ORDERED_NODE_TYPE,
                        null
                    ).singleNodeValue as HTMLElement | null;

                    // Prefer textContent: innerText returns "" for elements that are not
                    // rendered, and with 240 tiles per page most are off-screen or
                    // display:none, which produced blank product names in the report.
                    const name = nameNode
                        ? (nameNode.textContent || nameNode.innerText || "").replace(/\s+/g, " ").trim()
                        : "";

                    const priceNodes = document.evaluate(
                        ".//span[@class='price']",
                        product,
                        null,
                        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                        null
                    );

                    if (priceNodes.snapshotLength > 0) {
                        const firstPriceNode = priceNodes.snapshotItem(0) as HTMLElement | null;
                        const rawPrice = firstPriceNode ? (firstPriceNode.innerText || "").trim() : "";
                        const cleaned = rawPrice.replace(/[^0-9.]/g, "");
                        if (cleaned === "" || Number.parseFloat(cleaned) === 0) {
                            zeroPriceList.push(name);
                        }
                    } else {
                        zeroPriceList.push(name);
                    }
                }

                return zeroPriceList;
            });

            for (const name of result) {
                console.log(`Zero/No Price Product Found: ${name}`);
            }

            return result;
        } catch {
            const zeroPriceList: string[] = [];
            const products = this.page.locator(productListingElements.productContainers);
            const count = await products.count();

            for (let i = 0; i < count; i++) {
                const product = products.nth(i);
                let name = "";

                try {
                    const raw = await product.locator("a.product-item-link").first().textContent();
                    name = (raw ?? "").replace(/\s+/g, " ").trim();
                } catch {
                    name = "";
                }

                const priceElements = product.locator(".//span[@class='price']");
                const priceCount = await priceElements.count();

                if (priceCount > 0) {
                    const rawPrice = (await priceElements.first().textContent())?.trim() ?? "";
                    const priceText = rawPrice.replace(/[^0-9.]/g, "");
                    if (priceText === "" || Number.parseFloat(priceText) === 0) {
                        console.log(`Zero Price Product Found: ${name}`);
                        zeroPriceList.push(name);
                    }
                } else {
                    console.log(`No Price Found for: ${name}`);
                    zeroPriceList.push(name);
                }
            }

            return zeroPriceList;
        }
    }
}
