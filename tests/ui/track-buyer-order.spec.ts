import { test, expect } from "@playwright/test";
import { Homepagesteps } from "../../page-objects/page-steps/Home-page-steps";
import { LoginWithOtpSteps } from "../../page-objects/page-steps/login-with-otp-steps";
import { MyAccountSteps } from "../../page-objects/page-steps/my-account-steps";
import { MyOrderSteps } from "../../page-objects/page-steps/my-order-steps";
import { config } from "../../utils/config-reader";

test.describe("Track Buyer Order Tests", () => {
    let homePage: Homepagesteps;
    let loginWithOtp: LoginWithOtpSteps;
    let myAccount: MyAccountSteps;
    let myOrder: MyOrderSteps;

    test.beforeEach(async ({ page }) => {
        test.setTimeout(180000);

        // Ensure BUYER_MOBILE is set in environment from config
        process.env.BUYER_MOBILE = config.buyerMobile || "9763274722";

        homePage = new Homepagesteps(page);
        loginWithOtp = new LoginWithOtpSteps(page);
        myAccount = new MyAccountSteps(page);
        myOrder = new MyOrderSteps(page);

        // Navigate to the application
        const appUrl = config.url || "https://www.indiahandmade.com/";
        await page.goto(appUrl);
        await page.waitForTimeout(2000);

        // Perform login
        await homePage.Click_on_SignIn();
        await homePage.Click_on_LoginInOrSignUP();
        await page.waitForTimeout(4000);
        await loginWithOtp.Buyer_Login_With_OTP();
        await page.waitForTimeout(4000);

        // Navigate to My Orders and click Track Order
        await myAccount.Click_on_My_Orders();
        await page.waitForTimeout(3000);
        await myOrder.Click_on_trackOrder();
    });

    test("TC_001_Verify_Track_Buyer_Order", async ({ page }) => {
        const currentUrl = page.url();
        expect(currentUrl).toContain("trackorder");
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
