import { test, expect } from "@playwright/test";
import { Homepagesteps } from "../../page-objects/page-steps/Home-page-steps";
import { ProductPageSteps } from "../../page-objects/page-steps/product-page-steps";
import { LoginWithOtpSteps } from "../../page-objects/page-steps/login-with-otp-steps";
import { config } from "../../utils/config-reader";

test.describe("Product Searching Tests", () => {
    let homePage: Homepagesteps;
    let productPage: ProductPageSteps;
    let loginWithOtp: LoginWithOtpSteps;

    test.beforeEach(async ({ page }) => {
        test.setTimeout(180000);

        // Ensure BUYER_MOBILE is set in environment from config
        process.env.BUYER_MOBILE = config.buyerMobile || "9763274722";

        homePage = new Homepagesteps(page);
        productPage = new ProductPageSteps(page);
        loginWithOtp = new LoginWithOtpSteps(page);

        // Navigate to the application
        const appUrl = config.url || "https://www.indiahandmade.com/";
        await page.goto(appUrl);
        await page.waitForTimeout(4000);

        // Perform login
        await homePage.Click_on_SignIn();
        await homePage.Click_on_LoginInOrSignUP();
        await page.waitForTimeout(4000);
        await loginWithOtp.Buyer_Login_With_OTP();
        await page.waitForTimeout(4000);
    });

    test("TC_001_Verify_Product_Search_Successfully", async ({ page }) => {
        await page.waitForTimeout(5000);
        await homePage.Send_on_Search_Here_Raal_Product();
        await homePage.Click_on_Product();
        await page.waitForTimeout(3000);

        const sku = await productPage.getsku();
        console.log("SKU: " + sku);
        expect(sku).toBe("WES960065");
    });

    test.afterEach(async ({ page }) => {
        // Logout from application
        try {
            await homePage.Click_on_ProfileLink();
            await page.waitForTimeout(2000);
            await homePage.Click_on_LogoutButton();
        } catch (e) {
            console.log("Logout failed: " + e);
        }
    });
});
