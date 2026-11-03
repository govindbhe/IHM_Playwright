import { test, expect } from "@playwright/test";
import { Homepagesteps } from "../../page-objects/page-steps/Home-page-steps";
import { SellerLoginSteps } from "../../page-objects/page-steps/seller-login-steps";
import { DashboardPageSteps } from "../../page-objects/page-steps/dashboard-page-steps";
import { OrderProcessingSellerSteps } from "../../page-objects/page-steps/order-processing-seller-steps";
import { config } from "../../utils/config-reader";

test.describe("Seller Order Processing Tests", () => {
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

        // Navigate to Orders
        await dashboard.Click_On_Order();

        // Refresh and Reset
        await page.reload();
        await page.waitForTimeout(4000);
        await orderProcessingSeller.Click_on_Reset_button();
        await page.waitForTimeout(2000);
    });

    // test.skip("Verify_Visibilty_of_Accept_Button", async () => {
    //     const isDisplayed = await orderProcessingSeller.IS_Accept_button_Displayed();
    //     expect(isDisplayed).toBe(true);
    // });

    // test.skip("Verify_Visibilty_of_Reject_Button", async () => {
    //     const isDisplayed = await orderProcessingSeller.IS_Reject_button_Displayed();
    //     expect(isDisplayed).toBe(true);
    // });

    test("TC_001_Verify_OrderProcessing_Invoice_And_Shipment_Generation", async ({ page, context }) => {
        await orderProcessingSeller.Click_on_Accept_button();
        await page.waitForTimeout(5000);

        await orderProcessingSeller.Click_on_Generate_Bill_Of_Supply();
        await page.waitForTimeout(4000);

        await orderProcessingSeller.Click_on_Submit_Bill_Of_supply();
        await page.waitForTimeout(5000);

        await page.reload();
        await page.waitForTimeout(3000);

        // Click on generate shipment which opens a new window/tab
        const [newPage] = await Promise.all([
            context.waitForEvent("page"),
            orderProcessingSeller.Click_on_generate_Shipment()
        ]);
        await newPage.waitForLoadState();
        await newPage.waitForTimeout(5000);

        const orderProcessingSellerNewPage = new OrderProcessingSellerSteps(newPage);
        await orderProcessingSellerNewPage.Click_on_generate_Shipment_with_indiahandmade();
        await newPage.waitForTimeout(3000);

        await orderProcessingSellerNewPage.Click_on_Continue_with_Selected_Courier();
        await newPage.waitForTimeout(3000);

        await orderProcessingSellerNewPage.Click_on_Create_Shipment();

        const message = await orderProcessingSellerNewPage.generate_Shipment_Success_Massage();
        expect(message).toBe("Shipment created successfully.");
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
