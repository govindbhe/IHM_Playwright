import { test, expect } from "@playwright/test";
import { Homepagesteps } from "../../page-objects/page-steps/Home-page-steps";
import { MyAccountSteps } from "../../page-objects/page-steps/my-account-steps";
import { AddNewAddressSteps } from "../../page-objects/page-steps/add-new-address-steps";
import { LoginWithOtpSteps } from "../../page-objects/page-steps/login-with-otp-steps";
import { config } from "../../utils/config-reader";

test.describe("Delete Buyer Address Tests", () => {
    let homePage: Homepagesteps;
    let myAccount: MyAccountSteps;
    let addNewAddress: AddNewAddressSteps;
    let loginWithOtp: LoginWithOtpSteps;

    test.beforeEach(async ({ page }) => {
        test.setTimeout(180000);

        // Ensure BUYER_MOBILE is set in environment from config
        process.env.BUYER_MOBILE = config.buyerMobile || "9763274722";

        homePage = new Homepagesteps(page);
        myAccount = new MyAccountSteps(page);
        addNewAddress = new AddNewAddressSteps(page);
        loginWithOtp = new LoginWithOtpSteps(page);

        // Navigate to application
        const appUrl = config.url || "https://www.indiahandmade.com/";
        await page.goto(appUrl);
        await page.waitForTimeout(4000);

        // Perform login
        await homePage.Click_on_SignIn();
        await homePage.Click_on_LoginInOrSignUP();
        await loginWithOtp.Buyer_Login_With_OTP();

        // Wait for page to navigate to customer dashboard
        await expect(page).toHaveURL(/customer/, { timeout: 60000 });
    });

    // Test 1: Verify Delete Buyer Address
    test("TC_001_Verify_Delete_Buyer_Address", async ({ page }) => {
        await myAccount.Click_on_Address_Book();
        await page.waitForTimeout(4000);

        await myAccount.Click_on_delete_address_button();
        await page.waitForTimeout(4000);

        await addNewAddress.Click_on_delete_address_ok_button();
        await page.waitForTimeout(4000);

        const successMessage = await addNewAddress.Delete_Address_Success_Massage();
        console.log(successMessage);
        expect(successMessage).toBe("You deleted the address.");
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
