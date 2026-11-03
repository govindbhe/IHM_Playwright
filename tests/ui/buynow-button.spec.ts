import { test, expect } from "@playwright/test";
import { Homepagesteps } from "../../page-objects/page-steps/Home-page-steps";
import { ProductPageSteps } from "../../page-objects/page-steps/product-page-steps";
import { LoginWithOtpSteps } from "../../page-objects/page-steps/login-with-otp-steps";
import { config } from "../../utils/config-reader";

test.describe("Buy Now Button Tests", () => {
    let homePage: Homepagesteps;
    let productPage: ProductPageSteps;
    let loginWithOtp: LoginWithOtpSteps;

    test.beforeEach(async ({ page }) => {
        test.setTimeout(180000);

        homePage = new Homepagesteps(page);
        productPage = new ProductPageSteps(page);
        loginWithOtp = new LoginWithOtpSteps(page);

        // Navigate to application
        const appUrl = config.url || "https://www.indiahandmade.com/";
        await page.goto(appUrl);

        // Click on logo to ensure we're on the home page
        await homePage.Click_on_logo();
        await page.waitForTimeout(2000);
    });

    // Test 1 (priority 1): Verify Buy Now workflow for guest user
    test("TC_001_Verify_BuyNow_Workflow_For_GuestUser", async ({ page }) => {
        await page.waitForTimeout(5000);
        await homePage.Send_on_Search_Here_Raal_Product();
        await page.waitForTimeout(5000);
        await homePage.Click_on_Product();
        await page.waitForTimeout(4000);

        await productPage.Click_on_Buy_Now_button();
        await page.waitForTimeout(4000);

        const actualUrl = page.url();
        console.log("Actual URL: " + actualUrl);
        const expectedUrl = config.url + "customer/account/login/referer/aHR0cHM6Ly93d3cuaW5kaWFoYW5kbWFkZS5jb20vY2hlY2tvdXQv/";
        expect(actualUrl).toBe(expectedUrl);
    });

    // Test 2 (priority 2): Verify Buy Now button visible for in-stock product
    test("TC_002_Verify_BuyNowButton_Visible_For_InStock_Product", async ({ page }) => {
        await page.waitForTimeout(5000);
        await homePage.Send_on_Search_Here_Raal_Product();
        await page.waitForTimeout(5000);
        await homePage.Click_on_Product();
        await page.waitForTimeout(2000);

        const isVisible = await productPage.Check_Visibility_for_Buy_Now_button();
        console.log("Is Buy Now button visible? " + isVisible);
        expect(isVisible).toBe(true);
    });

    // Test 3 (priority 3): Verify Buy Now button hidden for out-of-stock product
    test("TC_003_Verify_BuyNowButton_Hidden_For_OutOfStock_Product", async ({ page }) => {
        await page.waitForTimeout(2000);
        await homePage.Send_on_Search_Here_Outoff_stock();
        await homePage.Click_on_Product();
        await page.waitForTimeout(2000);

        const isVisible = await productPage.Check_Visibility_for_Buy_Now_button();
        expect(isVisible).toBe(false);
    });

    // Test 4 (priority 4): Verify Buy Now workflow for logged-in user
    test("TC_004_Verify_BuyNow_Workflow_For_Logged_InUser", async ({ page }) => {
        process.env.BUYER_MOBILE = config.buyerMobile || "9763274722";

        await page.waitForTimeout(2000);
        await homePage.Click_on_SignIn();
        await homePage.Click_on_LoginInOrSignUP();
        await loginWithOtp.Buyer_Login_With_OTP();

        await homePage.Send_on_Search_Here_Raal_Product();
        await homePage.Click_on_Product();
        await homePage.Send_on_Search_Here_Raal_Product();
        await homePage.Click_on_Product();
        await page.waitForTimeout(4000);

        await productPage.Click_on_Buy_Now_button();
        await page.waitForTimeout(4000);

        const actualUrl = page.url();
        console.log("Actual URL: " + actualUrl);
        const expectedUrl = config.url + "checkout/#shipping";
        expect(actualUrl).toBe(expectedUrl);

        // Logout after logged-in test
        try {
            await homePage.Click_on_ProfileLink();
            await page.waitForTimeout(2000);
            await homePage.Click_on_LogoutButton();
        } catch (e) {
            console.log("Logout failed: " + e);
        }
    });
});
