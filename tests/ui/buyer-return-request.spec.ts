import { test, expect } from "@playwright/test";
import { Homepagesteps } from "../../page-objects/page-steps/Home-page-steps";
import { MyAccountSteps } from "../../page-objects/page-steps/my-account-steps";
import { MyOrderSteps } from "../../page-objects/page-steps/my-order-steps";
import { NewReturnSteps } from "../../page-objects/page-steps/new-return-steps";
import { LoginWithOtpSteps } from "../../page-objects/page-steps/login-with-otp-steps";
import { config } from "../../utils/config-reader";

test.describe("Buyer Return Request Tests", () => {
    let homePage: Homepagesteps;
    let myAccount: MyAccountSteps;
    let myOrder: MyOrderSteps;
    let newReturn: NewReturnSteps;
    let loginWithOtp: LoginWithOtpSteps;

    test.beforeEach(async ({ page }) => {
        test.setTimeout(180000);

        // Ensure BUYER_MOBILE is set in environment from config
        process.env.BUYER_MOBILE = config.buyerMobile || "9763274722";

        homePage = new Homepagesteps(page);
        myAccount = new MyAccountSteps(page);
        myOrder = new MyOrderSteps(page);
        newReturn = new NewReturnSteps(page);
        loginWithOtp = new LoginWithOtpSteps(page);

        // Navigate to application
        const appUrl = config.url || "https://www.indiahandmade.com/";
        await page.goto(appUrl);

        // Perform login
        await homePage.Click_on_SignIn();
        await homePage.Click_on_LoginInOrSignUP();
        await loginWithOtp.Buyer_Login_With_OTP();

        // Wait for page to navigate to customer dashboard
        await expect(page).toHaveURL(/customer/, { timeout: 60000 });

        // Navigate to My Orders and initiate return
        await myAccount.Click_on_My_Orders();
        await page.waitForTimeout(3000);

        await myOrder.click_on_return();
        await page.waitForTimeout(3000);

        // Fill return request form
        await newReturn.Select_Return_Reason();
        await page.waitForTimeout(3000);

        await newReturn.Select_item_condition();
        await newReturn.Select_Return_Resolution();
        await newReturn.Send_Add_Massage();
        await newReturn.Click_on_Attach_Photo();
        await newReturn.Click_on_Check_Box();
        await newReturn.Click_on_submit_request();
    });

    // Test: TC_001_Verify_Return_Order
    test("TC_001_Verify_Return_Order", async () => {
        const message = await newReturn.return_Raised_Success_Message();
        expect(message).toBe("Thanks for contacting us with your comments and questions. We'll respond to you very soon.");
    });

    test.afterEach(async ({ page }) => {
        // Logout from application
        await homePage.Click_on_ProfileLink();
        await page.waitForTimeout(2000);
        await homePage.Click_on_LogoutButton();
    });
});
