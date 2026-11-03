import { Page } from "@playwright/test";
import orderElements from "../page-elements/my-order-elements.json" with { type: "json" };
import { webcommons } from "../../commons/ui/web-common";

export class MyOrderSteps {
    page: Page;
    web: webcommons;

    constructor(page: Page) {
        this.page = page;
        this.web = new webcommons(this.page);
    }

    private async pause(ms: number): Promise<void> {
        await this.page.waitForTimeout(ms);
    }

    private async clickFirstVisible(selectors: string[]): Promise<void> {
        for (const selector of selectors) {
            const locator = this.page.locator(selector).first();
            if (await locator.isVisible().catch(() => false)) {
                await locator.scrollIntoViewIfNeeded();
                await locator.click({ force: true });
                return;
            }
        }
    }

    private async getTextByIndexedXPath(xpathExpr: string, index: number): Promise<string> {
        const locator = this.page.locator(`(${xpathExpr})[${index + 1}]`).first();
        if (await locator.count()) {
            return (await locator.textContent())?.trim() || "";
        }
        return "";
    }

    async Click_on_Cancle_Order(): Promise<void> {
        await this.page.locator(orderElements.cancelOrderButton).waitFor({ state: "visible", timeout: 20000 });
        await this.web.clickonElement(orderElements.cancelOrderButton);
    }

    async isCancelOrderModalDisplayed(timeoutSeconds: number = 20): Promise<boolean> {
        return await this.page
            .locator(orderElements.cancelOrderModalTitle)
            .isVisible({ timeout: timeoutSeconds * 1000 })
            .catch(() => false);
    }

    async isCancelOrderCloseButtonVisible(): Promise<boolean> {
        return await this.page.locator(orderElements.modalCloseButton).isVisible({ timeout: 20000 }).catch(() => false);
    }

    async clickCancelOrderCloseButton(): Promise<void> {
        await this.web.clickonElement(orderElements.modalCloseButton);
    }

    async isCancelOrderModalClosed(): Promise<boolean> {
        return await this.page
            .locator(orderElements.cancelOrderModalContainer)
            .isHidden({ timeout: 5000 })
            .catch(() => false);
    }

    async getCancelReasonOptionsText(): Promise<string[]> {
        const options = this.page.locator("(//div[@class='canel-reason-list'])[2]");
        const count = await options.count();
        const texts: string[] = [];
        for (let i = 0; i < count; i++) {
            const text = ((await options.nth(i).textContent()) || "").trim();
            if (text && !texts.includes(text)) {
                texts.push(text);
            }
        }
        return texts;
    }

    async selectCancelReasonByIndex(index: number): Promise<void> {
        await this.web.clickonElement(`(//input[@id='cancellation_reason'])[${index}]`);
    }

    async isContinueToCancelButtonEnabled(): Promise<boolean> {
        return await this.page.locator(orderElements.continueToCancelButton).isEnabled().catch(() => false);
    }

    async clickContinueToCancelButton(): Promise<void> {
        await this.web.clickonElement(orderElements.continueToCancelButton);
    }

    async Click_on_reason_ChangeMyMind(): Promise<void> {
        await this.web.clickonElement(orderElements.reasonChangeMyMind);
    }

    async Click_on_reason_ChangeShippingAddress(): Promise<void> {
        await this.web.clickonElement(orderElements.reasonChangeShippingAddress);
    }

    async Click_on_reason_OrderByMistake(): Promise<void> {
        await this.web.clickonElement(orderElements.reasonOrderByMistake);
    }

    async Click_on_Submit(): Promise<void> {
        await this.web.clickonElement(orderElements.submitButton);
    }

    async Conformation_massage(): Promise<string> {
        await this.page.locator(orderElements.confirmationMessage).waitFor({ state: "visible", timeout: 20000 });
        return (await this.page.locator(orderElements.confirmationMessage).textContent())?.trim() || "";
    }

    async Click_on_Close(): Promise<void> {
        await this.web.clickonElement(orderElements.closeButton);
    }

    async Click_on_trackOrder(): Promise<void> {
        await this.web.clickonElement(orderElements.trackOrderLink);
    }

    async click_on_raise_query(): Promise<void> {
        const selectors = [
            orderElements.raiseQueryLink,
            "text=Raise Query",
            "//*[normalize-space(text())='Raise Query']",
            "//a[normalize-space(text())='Raise Query']"
        ];
        for (const selector of selectors) {
            const locators = this.page.locator(selector);
            const count = await locators.count();
            for (let i = 0; i < count; i++) {
                const element = locators.nth(i);
                try {
                    if (await element.isVisible() && await element.isEnabled()) {
                        const disabledAttr = await element.getAttribute("disabled");
                        const classAttr = await element.getAttribute("class");
                        if (disabledAttr !== null || (classAttr && classAttr.includes("disabled"))) {
                            continue;
                        }
                        const cursor = await element.evaluate(el => window.getComputedStyle(el).cursor);
                        if (cursor !== "pointer") {
                            continue;
                        }
                        await element.scrollIntoViewIfNeeded();
                        await element.click({ timeout: 8000 });
                        return;
                    }
                } catch {
                    // try next element
                }
            }
        }
        throw new Error("Unable to locate or click an enabled Raise Query button.");
    }

    async click_on_reorder(): Promise<void> {
        await this.web.clickonElement(orderElements.reorderButton);
    }

    async Buyer_Order_Canclled_Status(): Promise<boolean> {
        return await this.page.locator(orderElements.cancelledStatus).isVisible({ timeout: 20000 }).catch(() => false);
    }

    async click_on_return(): Promise<void> {
        await this.web.clickonElement(orderElements.returnOrderLink);
    }

    async getOrderListCount(): Promise<number> {
        const fallbackLocators = [
            "//div[@class='order-list-item']",
            "//div[contains(@class, 'order') and contains(@class, 'item')]",
            "//div[contains(@class, 'order-list')]//div[contains(@class, 'item')]",
            "//tr[@data-order-id or contains(@id, 'order')]",
            "//li[contains(@class, 'order')]",
            "//div[contains(@id, 'order') and contains(@id, 'item')]",
            "//div[@class='order'] | //div[@class='order-item'] | //div[@data-order-id]"
        ];

        for (const locator of fallbackLocators) {
            const count = await this.page.locator(locator).count();
            if (count > 0) {
                return count;
            }
        }

        return 0;
    }

    async getOrderIdByIndex(index: number): Promise<string> {
        return await this.getTextByIndexedXPath("//div[contains(text(), 'Order ID:')]//following-sibling::span", index);
    }

    async getOrderDateByIndex(index: number): Promise<string> {
        return await this.getTextByIndexedXPath("//div[contains(text(), 'Order Placed:')]//following-sibling::span", index);
    }

    async getOrderStatusByIndex(index: number): Promise<string> {
        const xpath = "//div[contains(@class, 'order-item')]//span[contains(text(), 'Processing') or contains(text(), 'Pending') or contains(text(), 'Shipped') or contains(text(), 'Cancelled') or contains(text(), 'Invoiced') or contains(text(), 'Waiting Pickup')]";
        return await this.getTextByIndexedXPath(xpath, index);
    }

    async getProductNameByIndex(index: number): Promise<string> {
        return await this.getTextByIndexedXPath("//div[contains(@class, 'product-item')]//a[@href]", index);
    }

    async getSellerNameByIndex(index: number): Promise<string> {
        return await this.getTextByIndexedXPath("//div[contains(text(), 'Seller:')]//following-sibling::a", index);
    }

    async getOrderTotalByIndex(index: number): Promise<string> {
        return await this.getTextByIndexedXPath("//div[contains(text(), 'Total:')]//following-sibling::span", index);
    }

    async isTrackOrderButtonVisibleByIndex(index: number): Promise<boolean> {
        return await this.page.locator(`(//a[normalize-space(text())='Track Order'])[${index + 1}]`).isVisible().catch(() => false);
    }

    async isReorderButtonVisibleByIndex(index: number): Promise<boolean> {
        return await this.page.locator(`(//span[normalize-space(text())='Reorder'])[${index + 1}]`).isVisible().catch(() => false);
    }

    async isCancelItemButtonVisibleByIndex(index: number): Promise<boolean> {
        return await this.page.locator(`(//button[contains(text(), 'Cancel Item')])[${index + 1}]`).isVisible().catch(() => false);
    }

    async isRaiseQueryButtonVisibleByIndex(index: number): Promise<boolean> {
        return await this.page.locator(`(//a[normalize-space(text())='Raise Query'])[${index + 1}]`).isVisible().catch(() => false);
    }

    async isDownloadInvoiceButtonVisibleByIndex(index: number): Promise<boolean> {
        return await this.page.locator(`(//span[contains(text(), 'Download Invoice')])[${index + 1}]`).isVisible().catch(() => false);
    }

    async isDownloadBillOfSupplyButtonVisibleByIndex(index: number): Promise<boolean> {
        return await this.page.locator(`(//span[contains(text(), 'Download Bill of Supply')])[${index + 1}]`).isVisible().catch(() => false);
    }

    async getShipToAddressByIndex(index: number): Promise<string> {
        return await this.getTextByIndexedXPath("//div[contains(text(), 'Ship to:')]//following-sibling::div", index);
    }

    async areOrdersDisplayed(): Promise<boolean> {
        return (await this.getOrderListCount()) > 0;
    }

    async isNoOrdersMessageDisplayed(): Promise<boolean> {
        return await this.page.locator(orderElements.noOrdersMessage).isVisible({ timeout: 20000 }).catch(() => false);
    }

    async isOrderStatusDisplayedByIndex(index: number, expectedStatus: string): Promise<boolean> {
        const actualStatus = await this.getOrderStatusByIndex(index);
        return actualStatus.toLowerCase() === expectedStatus.toLowerCase();
    }

    async verifyActionButtonsForStatus(index: number, status: string): Promise<boolean> {
        const trackOrderVisible = await this.isTrackOrderButtonVisibleByIndex(index);
        const reorderVisible = await this.isReorderButtonVisibleByIndex(index);
        const raiseQueryVisible = await this.isRaiseQueryButtonVisibleByIndex(index);
        const cancelItemVisible = await this.isCancelItemButtonVisibleByIndex(index);

        switch (status.toLowerCase()) {
            case "processing":
                return cancelItemVisible || raiseQueryVisible;
            case "shipped":
                return trackOrderVisible && reorderVisible && raiseQueryVisible;
            case "invoiced":
                return (await this.isDownloadInvoiceButtonVisibleByIndex(index)) && reorderVisible;
            case "cancelled":
                return reorderVisible;
            case "pending":
                return !cancelItemVisible;
            case "waiting pickup":
                return trackOrderVisible && raiseQueryVisible;
            default:
                return false;
        }
    }

    async clickTrackOrderByIndex(index: number): Promise<void> {
        const locator = this.page.locator(`(//a[normalize-space(text())='Track Order'])[${index + 1}]`);
        if (await locator.count()) {
            await locator.first().click();
        }
    }

    async clickReorderByIndex(index: number): Promise<void> {
        const locator = this.page.locator(`(//span[normalize-space(text())='Reorder'])[${index + 1}]`);
        if (await locator.count()) {
            await locator.first().click();
        }
    }

    async clickRaiseQueryByIndex(index: number): Promise<void> {
        const locator = this.page.locator(`(//a[normalize-space(text())='Raise Query'])[${index + 1}]`);
        if (await locator.count()) {
            await locator.first().click();
        }
    }

    async clickCancelItemByIndex(index: number): Promise<void> {
        const locator = this.page.locator(`(//button[contains(text(), 'Cancel Item')])[${index + 1}]`);
        if (await locator.count()) {
            await locator.first().click();
        }
    }

    async getSKUByIndex(index: number): Promise<string> {
        return await this.getTextByIndexedXPath("//div[contains(text(), 'SKU:')]//following-sibling::span", index);
    }

    async getOrderedQuantityByIndex(index: number): Promise<string> {
        return await this.getTextByIndexedXPath("//div[contains(text(), 'Ordered Qty:')]//following-sibling::span", index);
    }

    async getColorByIndex(index: number): Promise<string> {
        return await this.getTextByIndexedXPath("//div[contains(text(), 'Color:')]//following-sibling::span", index);
    }

    async isOrderNumberFilterVisible(): Promise<boolean> {
        return await this.page.locator(orderElements.orderNumberFilterDropdown).isVisible().catch(() => false);
    }

    async isStatusFilterVisible(): Promise<boolean> {
        return await this.page.locator(orderElements.statusFilterDropdown).isVisible().catch(() => false);
    }

    async isDateRangeFilterVisible(): Promise<boolean> {
        return await this.page.locator(orderElements.dateRangeFilterDropdown).isVisible().catch(() => false);
    }

    async isSearchOrderInputVisible(): Promise<boolean> {
        return await this.page.locator(orderElements.searchOrderInput).isVisible().catch(() => false);
    }

    async isSearchButtonVisible(): Promise<boolean> {
        return await this.page.locator(orderElements.searchButton).isVisible().catch(() => false);
    }

    async clickOrderNumberFilter(): Promise<void> {
        await this.clickFirstVisible([
            orderElements.orderNumberFilterDropdown,
            "//select[contains(@id, 'order')]",
            "//button[contains(text(), 'Order Number')]"
        ]);
    }

    async clickStatusFilter(): Promise<void> {
        await this.clickFirstVisible([
            orderElements.statusFilterDropdown,
            "//select[contains(@id, 'status')]",
            "//button[contains(text(), 'Status')]"
        ]);
    }

    async clickDateRangeFilter(): Promise<void> {
        await this.clickFirstVisible([
            orderElements.dateRangeFilterDropdown,
            "//select[contains(@id, 'date')]",
            "//button[contains(text(), 'Date Range')]"
        ]);
    }

    async selectOrderNumberSort(sortOrder: string): Promise<void> {
        try {
            await this.clickOrderNumberFilter();
            await this.pause(500);
            if (sortOrder.toUpperCase() === "DESC") {
                await this.web.clickonElement(orderElements.orderNumberDescOption);
            } else if (sortOrder.toUpperCase() === "ASC") {
                await this.web.clickonElement(orderElements.orderNumberAscOption);
            }
            await this.pause(1000);
        } catch {
            // keep parity with Selenium method (swallow errors)
        }
    }

    async selectStatusFilter(status: string): Promise<void> {
        try {
            await this.clickStatusFilter();
            await this.pause(500);
            const option = this.page.locator(`//option[contains(text(), '${status}')]`).first();
            if (await option.count()) {
                await option.click();
            } else {
                const linkOption = this.page.locator(`//a[contains(text(), '${status}')]`).first();
                if (await linkOption.count()) {
                    await linkOption.click();
                }
            }
            await this.pause(1000);
        } catch {
            // keep parity with Selenium method (swallow errors)
        }
    }

    async selectDateRangeFilter(dateRange: string): Promise<void> {
        try {
            await this.clickDateRangeFilter();
            await this.pause(500);
            const option = this.page.locator(`//option[contains(text(), '${dateRange}')]`).first();
            if (await option.count()) {
                await option.click();
            } else {
                const linkOption = this.page.locator(`//a[contains(text(), '${dateRange}')]`).first();
                if (await linkOption.count()) {
                    await linkOption.click();
                }
            }
            await this.pause(1000);
        } catch {
            // keep parity with Selenium method (swallow errors)
        }
    }

    async searchOrderByNumber(orderNumber: string): Promise<void> {
        try {
            const input = this.page.locator(orderElements.searchOrderInput);
            await input.click();
            await input.fill("");
            await input.fill(orderNumber);
            await this.pause(500);
            await this.page.locator(orderElements.searchButton).click();
            await this.pause(1000);
        } catch {
            // keep parity with Selenium method (swallow errors)
        }
    }

    async getAvailableStatusFilters(): Promise<string[]> {
        try {
            await this.clickStatusFilter();
            await this.pause(500);
            const options = this.page.locator("//option | //a[@role='option']");
            const count = await options.count();
            const statuses: string[] = [];
            for (let i = 0; i < count; i++) {
                const text = ((await options.nth(i).textContent()) || "").trim();
                if (text) {
                    statuses.push(text);
                }
            }
            await this.page.locator("body").click();
            return statuses;
        } catch {
            return [];
        }
    }

    async getAvailableDateRangeFilters(): Promise<string[]> {
        try {
            await this.clickDateRangeFilter();
            await this.pause(500);
            const options = this.page.locator("//option | //a[@role='option']");
            const count = await options.count();
            const dateRanges: string[] = [];
            for (let i = 0; i < count; i++) {
                const text = ((await options.nth(i).textContent()) || "").trim();
                if (text) {
                    dateRanges.push(text);
                }
            }
            await this.page.locator("body").click();
            return dateRanges;
        } catch {
            return [];
        }
    }

    async verifyFilteredResultsByStatus(expectedStatus: string): Promise<boolean> {
        try {
            const orderCount = await this.getOrderListCount();
            if (orderCount === 0) return false;
            for (let i = 0; i < orderCount; i++) {
                const actualStatus = await this.getOrderStatusByIndex(i);
                if (expectedStatus.toLowerCase() !== "all" && actualStatus.toLowerCase() !== expectedStatus.toLowerCase()) {
                    return false;
                }
            }
            return true;
        } catch {
            return false;
        }
    }

    async getCurrentOrderNumberSort(): Promise<string> {
        const selectors = ["//select[@name='order_number_sort']", "//select[contains(@id, 'order')]"];
        for (const selector of selectors) {
            const dd = this.page.locator(selector).first();
            if (await dd.count()) {
                const selected = (await dd.inputValue()) || "";
                return selected || "DESC";
            }
        }
        return "DESC";
    }

    async getCurrentStatusFilter(): Promise<string> {
        const selectors = ["//select[@name='status_filter']", "//select[contains(@id, 'status')]"];
        for (const selector of selectors) {
            const dd = this.page.locator(selector).first();
            if (await dd.count()) {
                const selected = (await dd.inputValue()) || "";
                return selected || "All";
            }
        }
        return "All";
    }

    async getCurrentDateRangeFilter(): Promise<string> {
        const selectors = ["//select[@name='date_range']", "//select[contains(@id, 'date')]"];
        for (const selector of selectors) {
            const dd = this.page.locator(selector).first();
            if (await dd.count()) {
                const selected = (await dd.inputValue()) || "";
                return selected || "Last 6 Months";
            }
        }
        return "Last 6 Months";
    }

    async clearSearchInput(): Promise<void> {
        await this.page.locator(orderElements.searchOrderInput).fill("");
    }

    async getSearchInputValue(): Promise<string> {
        return await this.page.locator(orderElements.searchOrderInput).inputValue().catch(() => "");
    }

    async verifyOrdersSortedByIdDescending(): Promise<boolean> {
        try {
            const orderCount = await this.getOrderListCount();
            if (orderCount < 2) return true;
            for (let i = 0; i < orderCount - 1; i++) {
                const id1 = await this.getOrderIdByIndex(i);
                const id2 = await this.getOrderIdByIndex(i + 1);
                if (id1 && id2) {
                    const num1 = Number.parseInt(id1, 10);
                    const num2 = Number.parseInt(id2, 10);
                    if (!Number.isNaN(num1) && !Number.isNaN(num2) && num1 < num2) {
                        return false;
                    }
                }
            }
            return true;
        } catch {
            return false;
        }
    }

    async verifyOrdersSortedByIdAscending(): Promise<boolean> {
        try {
            const orderCount = await this.getOrderListCount();
            if (orderCount < 2) return true;
            for (let i = 0; i < orderCount - 1; i++) {
                const id1 = await this.getOrderIdByIndex(i);
                const id2 = await this.getOrderIdByIndex(i + 1);
                if (id1 && id2) {
                    const num1 = Number.parseInt(id1, 10);
                    const num2 = Number.parseInt(id2, 10);
                    if (!Number.isNaN(num1) && !Number.isNaN(num2) && num1 > num2) {
                        return false;
                    }
                }
            }
            return true;
        } catch {
            return false;
        }
    }
}
