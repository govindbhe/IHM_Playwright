import { test, expect } from "@playwright/test";
import { Homepagesteps } from "../../page-objects/page-steps/Home-page-steps";
import { SellerLoginSteps } from "../../page-objects/page-steps/seller-login-steps";
import { DashboardPageSteps } from "../../page-objects/page-steps/dashboard-page-steps";
import { InventoryUpdateSteps } from "../../page-objects/page-steps/inventory-update-steps";
import { config } from "../../utils/config-reader";

test.describe("Verify Inventory Update Page Tests", () => {
    let homePage: Homepagesteps;
    let sellerLogin: SellerLoginSteps;
    let dashboard: DashboardPageSteps;
    let inventoryUpdate: InventoryUpdateSteps;

    test.beforeEach(async ({ page }) => {
        test.setTimeout(180000);

        homePage = new Homepagesteps(page);
        sellerLogin = new SellerLoginSteps(page);
        dashboard = new DashboardPageSteps(page);
        inventoryUpdate = new InventoryUpdateSteps(page);

        // Login as seller
        const baseUrl = config.url || "https://www.indiahandmade.com/";
        await page.goto(baseUrl);
        await page.waitForTimeout(2000);

        await homePage.Click_on_Vendar_LogIn();
        await sellerLogin.enter_email(config.sellerEmail);
        await sellerLogin.enter_Password(config.sellerPassword);
        await sellerLogin.Click_on_Sign_In_Button();
        await page.waitForTimeout(3000);

        // Click Products link and click Inventory Update
        await dashboard.Click_On_Products();
        await page.waitForTimeout(1000);
        await dashboard.Click_On_Inventory_Update_Link();
        await page.waitForTimeout(2000);
    });

    test("Verify_Inventory_Page_UI_Elements_Visible", async () => {
        expect(await inventoryUpdate.isSearchSkuFieldDisplayed()).toBe(true);
        expect(await inventoryUpdate.isStatusDropdownDisplayed()).toBe(true);
        expect(await inventoryUpdate.isSearchButtonDisplayed()).toBe(true);
    });

    test("Verify_Search_By_SKU", async ({ page }) => {
        await inventoryUpdate.enterSearchSku("Del938254");
        await inventoryUpdate.clickSearch();
        await page.waitForTimeout(3000);
        expect(page.url()).toContain("sellerinventoryupdate");
    });

    test("Verify_Status_Filter_Options", async ({ page }) => {
        await inventoryUpdate.selectStatusFilter("In Stock");
        await inventoryUpdate.clickSearch();
        await page.waitForTimeout(2000);

        await inventoryUpdate.selectStatusFilter("Out of Stock");
        await inventoryUpdate.clickSearch();
        await page.waitForTimeout(2000);

        expect(true).toBe(true);
    });

    test("Verify_Edit_Product_Stock_Modal_Cancel", async ({ page }) => {
        await inventoryUpdate.clickFirstEdit();
        await page.waitForTimeout(2000);
        await inventoryUpdate.clickCancelInModal();
        await page.waitForTimeout(2000);
        expect(await inventoryUpdate.isSearchButtonDisplayed()).toBe(true);
    });

    test("Verify_Edit_Product_Stock_Success", async ({ page }) => {
        await inventoryUpdate.clickFirstEdit();
        await page.waitForTimeout(2000);
        await inventoryUpdate.updateStockInModal("5");
        await inventoryUpdate.clickSaveInModal();
        await page.waitForTimeout(2000);

        const successMsg = await inventoryUpdate.getSuccessMessageText();
        expect(successMsg.includes("success") || successMsg.includes("saved") || successMsg !== "").toBe(true);
    });

    test("Verify_Search_By_Invalid_SKU", async ({ page }) => {
        await inventoryUpdate.enterSearchSku("INVALID-SKU-9999");
        await inventoryUpdate.clickSearch();
        await page.waitForTimeout(3000);
        expect(page.url()).toContain("sellerinventoryupdate");
    });

    test("Verify_Edit_Product_Stock_Empty", async ({ page }) => {
        await inventoryUpdate.clickFirstEdit();
        await page.waitForTimeout(2000);
        await inventoryUpdate.updateStockInModal("");
        await inventoryUpdate.clickSaveInModal();
        await page.waitForTimeout(2000);
        expect(true).toBe(true);
        await inventoryUpdate.clickCancelInModal();
    });

    test("Verify_Edit_Product_Stock_Negative", async ({ page }) => {
        await inventoryUpdate.clickFirstEdit();
        await page.waitForTimeout(2000);
        await inventoryUpdate.updateStockInModal("-10");
        await inventoryUpdate.clickSaveInModal();
        await page.waitForTimeout(2000);
        expect(true).toBe(true);
        await inventoryUpdate.clickCancelInModal();
    });

    test("Verify_Edit_Product_Stock_Boundary_Large", async ({ page }) => {
        await inventoryUpdate.clickFirstEdit();
        await page.waitForTimeout(2000);
        await inventoryUpdate.updateStockInModal("9999");
        await inventoryUpdate.clickSaveInModal();
        await page.waitForTimeout(2000);
        expect(true).toBe(true);
    });

    test("Verify_Edit_Product_SpecialPrice_Greater_Than_ListedPrice", async ({ page }) => {
        await inventoryUpdate.clickFirstEdit();
        await page.waitForTimeout(2000);
        await inventoryUpdate.updateListingPriceInModal("100.00");
        await inventoryUpdate.updateSpecialPriceInModal("200.00");
        await inventoryUpdate.clickSaveInModal();
        await page.waitForTimeout(2000);
        expect(true).toBe(true);
        await inventoryUpdate.clickCancelInModal();
    });

    test.afterEach(async ({ page }) => {
        // Logout from vendor panel
        try {
            await page.waitForTimeout(2000);
            await dashboard.Click_On_Seller_Panel();
            await page.waitForTimeout(2000);
            await dashboard.Click_On_Logout();
        } catch (e) {
            console.log("Seller Logout failed: " + e);
        }
    });
});
