import { test, expect } from "@playwright/test";
import { Homepagesteps } from "../../page-objects/page-steps/Home-page-steps";
import { SellerLoginSteps } from "../../page-objects/page-steps/seller-login-steps";
import { DashboardPageSteps } from "../../page-objects/page-steps/dashboard-page-steps";
import { OrderProcessingSellerSteps } from "../../page-objects/page-steps/order-processing-seller-steps";
import { config } from "../../utils/config-reader";

test.describe("Seller Cancel Order Tests", () => {
    let homePage: Homepagesteps;
    let sellerLogin: SellerLoginSteps;
    let dashboard: DashboardPageSteps;
    let orderProcessingSeller: OrderProcessingSellerSteps;

    test.beforeEach(async ({ page }) => {
        test.setTimeout(180000);

        homePage = new Homepagesteps(page);
        sellerLogin = new SellerLoginSteps(page);
        dashboard = new DashboardPageSteps(page);
        orderProcessingSeller = new OrderProcessingSellerSteps(page);

        // Navigate to the application
        const appUrl = config.url || "https://www.indiahandmade.com/";
        await page.goto(appUrl);
        await page.waitForTimeout(2000);

        // Login as seller
        await homePage.Click_on_Vendar_LogIn();
        await sellerLogin.enter_email(config.sellerEmail);
        await sellerLogin.enter_Password(config.sellerPassword);
        await sellerLogin.Click_on_Sign_In_Button();
        await page.waitForTimeout(3000);

        // Click on Orders
        await dashboard.Click_On_Order();

        // Refresh and Reset filters
        await page.reload();
        await page.waitForTimeout(4000);
        await orderProcessingSeller.Click_on_Reset_button();
        await page.waitForTimeout(2000);
    });

    test("TC_001_Verify_Order_Cancellation_From_SellerSide", async () => {
        await orderProcessingSeller.Click_on_reject_button();
        const isCancelled = await orderProcessingSeller.Seller_Order_Canclled_Status();
        expect(isCancelled).toBe(true);
    });

    test.afterEach(async ({ page }) => {
        // Logout from application
        try {
            await page.waitForTimeout(2000);
            await dashboard.Click_On_Seller_Panel();
            await page.waitForTimeout(1000);
            await dashboard.Click_On_Logout();
        } catch (e) {
            console.log("Logout failed: " + e);
        }
    });
});
