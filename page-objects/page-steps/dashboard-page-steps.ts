import { Page, expect } from "@playwright/test";
import dashboardElements from '../page-elements/dashboard-elements.json' with { type: 'json' };
import { webcommons } from "../../commons/ui/web-common";

export class DashboardPageSteps {
    page: Page;
    web: webcommons;

    constructor(page: Page) {
        this.page = page;
        this.web = new webcommons(this.page);
    }

    async Click_On_SellerLogo(): Promise<void> {
        await this.web.clickonElement(dashboardElements.sellerLogo);
    }

    async Click_On_Order(): Promise<void> {
        await this.web.clickonElement(dashboardElements.order);
    }

    async Click_On_Products(): Promise<void> {
        await this.web.clickonElement(dashboardElements.products);
    }

    async Click_On_Click_GI_Taged_Products(): Promise<void> {
        await this.web.clickonElement(dashboardElements.giTaggedProducts);
    }

    async Click_On_Inventory_Update_Link(): Promise<void> {
        await this.web.clickonElement(dashboardElements.inventoryUpdateLink);
    }

    async Click_On_Click_GI_Taged_Products_info(): Promise<void> {
        await this.web.clickonElement(dashboardElements.giTaggedProductsInfo);
    }

    async Click_On_Custemers(): Promise<void> {
        await this.web.clickonElement(dashboardElements.customers);
    }

    async Click_On_Awardee_info(): Promise<void> {
        await this.web.clickonElement(dashboardElements.awardInfo);
    }

    async Click_On_Shipping_Method(): Promise<void> {
        await this.web.clickonElement(dashboardElements.shippingMethod);
    }

    async Click_On_Transactions(): Promise<void> {
        await this.web.clickonElement(dashboardElements.transactions);
    }

    async Click_On_Earnings(): Promise<void> {
        await this.web.clickonElement(dashboardElements.earnings);
    }

    async Click_On_Manage_Print_PDF_Header_Info(): Promise<void> {
        await this.web.clickonElement(dashboardElements.managePrintPdfHeaderInfo);
    }

    async Click_On_Review(): Promise<void> {
        await this.web.clickonElement(dashboardElements.review);
    }

    async Click_On_Settings(): Promise<void> {
        await this.web.clickonElement(dashboardElements.settings);
    }

    async Click_On_Home(): Promise<void> {
        await this.web.clickonElement(dashboardElements.home);
    }

    async Click_On_Notification(): Promise<void> {
        await this.web.clickonElement(dashboardElements.notification);
    }

    /**
     * Clicks the first *visible* match for a selector, falling back to a JS click.
     * Needed because several header controls are duplicated in the DOM (desktop +
     * collapsed/mobile copies), so a positional selector like
     * "(//a[@class='wk-mp__action-dropdown'])[1]" can resolve to a hidden node and
     * then hang on Playwright's visibility check until the test times out.
     */
    private async clickFirstVisible(selectors: string[], label: string): Promise<void> {
        for (const selector of selectors) {
            const matches = this.page.locator(selector);
            const count = await matches.count().catch(() => 0);

            for (let i = 0; i < count; i++) {
                const element = matches.nth(i);
                if (!(await element.isVisible().catch(() => false))) {
                    continue;
                }
                await element.scrollIntoViewIfNeeded().catch(() => { });
                try {
                    // Kept short: on failure we immediately fall back to a JS click,
                    // so a long timeout here only burns the test's budget.
                    await element.click({ timeout: 5000 });
                    return;
                } catch {
                    await element.evaluate((el: Element) => (el as HTMLElement).click());
                    return;
                }
            }

            // Attached but never visible (e.g. hidden behind a collapsed menu):
            // dispatch the click directly rather than waiting out the timeout.
            if (count > 0) {
                await matches.first().evaluate((el: Element) => (el as HTMLElement).click());
                return;
            }
        }

        throw new Error(`Unable to click ${label}. Tried selectors: ${selectors.join(" , ")}`);
    }

    async Click_On_Seller_Panel(): Promise<void> {
        await this.clickFirstVisible(
            [dashboardElements.sellerPanelDropdown, dashboardElements.sellerPanel],
            "the seller My Account dropdown"
        );
        // Wait for the dropdown contents to actually render rather than sleeping a
        // fixed interval. Non-fatal: if it does not appear the caller's own click
        // still applies its own wait and fallback.
        await this.page
            .locator(dashboardElements.logout)
            .first()
            .waitFor({ state: "visible", timeout: 5000 })
            .catch(() => { });
    }

    async Click_On_Account_setting(): Promise<void> {
        await this.web.clickonElement(dashboardElements.accountSetting);
    }

    async Click_On_Change_Password(): Promise<void> {
        await this.web.clickonElement(dashboardElements.changePassword);
    }

    async Click_On_Add_Product(): Promise<void> {
        await this.web.clickonElement(dashboardElements.addProduct);
    }

    async Click_On_Logout(): Promise<void> {
        await this.clickFirstVisible([dashboardElements.logout], "the Logout link");
    }

    async Click_On_My_Product_List(): Promise<void> {
        const item = this.page.locator(dashboardElements.myProductList).first();
        try {
            await item.scrollIntoViewIfNeeded();
            await expect(item).toBeVisible({ timeout: 10000 });
            await expect(item).toBeEnabled({ timeout: 10000 });
            await item.click();
        } catch {
            await item.evaluate((el: Element) => (el as HTMLElement).click());
        }
    }

    async clickOnSellerLogo() {
        await this.web.clickonElement(dashboardElements.dashboardLogo);
        console.log("✓ Clicked on Seller Logo");
    }

    async clickOnAddProductButton() {
        await this.web.clickonElement(dashboardElements.addProductButton);
        console.log("✓ Clicked on Add Product button");
    }

    async clickOnProductsLink() {
        await this.web.clickonElement(dashboardElements.productsLink);
        await this.page.waitForLoadState('networkidle');
        console.log("✓ Clicked on Products link");
    }

    async clickOnOrdersLink() {
        await this.web.clickonElement(dashboardElements.ordersLink);
        await this.page.waitForLoadState('networkidle');
        console.log("✓ Clicked on Orders link");
    }

    async clickOnSettingsLink() {
        await this.web.clickonElement(dashboardElements.settingsLink);
        console.log("✓ Clicked on Settings link");
    }

    async clickOnLogoutButton() {
        await this.web.clickonElement(dashboardElements.logoutButton);
        console.log("✓ Clicked on Logout button");
    }

    async verifyProductsListIsVisible() {
        await this.web.VerifyVisibility(dashboardElements.productsList);
        console.log("✓ Products list is visible");
    }

    async getProductCount(): Promise<number> {
        const count = await this.page.locator(dashboardElements.productRow).count();
        console.log(`✓ Product count: ${count}`);
        return count;
    }

    async clickEditProductButton() {
        await this.web.clickonElement(dashboardElements.editProductButton);
        console.log("✓ Clicked on Edit Product button");
    }

    async verifyDashboardIsVisible() {
        await this.web.VerifyVisibility(dashboardElements.dashboardLogo);
        console.log("✓ Dashboard is visible");
    }
}
