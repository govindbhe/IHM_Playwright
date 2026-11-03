import { test, expect } from "@playwright/test";
import { Homepagesteps } from "../../page-objects/page-steps/Home-page-steps";
import { MyAccountSteps } from "../../page-objects/page-steps/my-account-steps";
import { MyOrderSteps } from "../../page-objects/page-steps/my-order-steps";
import { BuyerRaiseQuerySteps } from "../../page-objects/page-steps/buyer-raise-query-steps";
import { LoginWithOtpSteps } from "../../page-objects/page-steps/login-with-otp-steps";
import { config } from "../../utils/config-reader";

test.describe("Buyer Raise Query Tests", () => {
    let homePage: Homepagesteps;
    let myAccount: MyAccountSteps;
    let myOrder: MyOrderSteps;
    let buyerRaiseQuery: BuyerRaiseQuerySteps;
    let loginWithOtp: LoginWithOtpSteps;

    test.beforeEach(async ({ page }) => {
        test.setTimeout(180000);

        // Ensure BUYER_MOBILE is set in environment from config
        process.env.BUYER_MOBILE = config.buyerMobile || "9763274722";

        homePage = new Homepagesteps(page);
        myAccount = new MyAccountSteps(page);
        myOrder = new MyOrderSteps(page);
        buyerRaiseQuery = new BuyerRaiseQuerySteps(page);
        loginWithOtp = new LoginWithOtpSteps(page);

        const appUrl = config.url || "https://www.indiahandmade.com/";
        await page.goto(appUrl);

        // Perform login
        await homePage.Click_on_SignIn();
        await homePage.Click_on_LoginInOrSignUP();
        await loginWithOtp.Buyer_Login_With_OTP();

        // Wait for page to navigate to dashboard (customer URL)
        await expect(page).toHaveURL(/customer/, { timeout: 60000 });

        // Navigate to My Orders and open Raise Query Modal
        await myAccount.Click_on_My_Orders();
        
        await page.waitForTimeout(2000);
        await myOrder.click_on_raise_query();

        // Wait for raise query modal to be displayed
        const modalVisible = await buyerRaiseQuery.isRaiseQueryModalDisplayed();
        expect(modalVisible).toBe(true);
    });

    // Test 1: TC_001_Verify_Raise_Query_With_Valid_Data
    test("TC_001_Verify_Raise_Query_With_Valid_Data", async ({ page }) => {
        await buyerRaiseQuery.selectCategoryByVisibleText("Missing Items");
        await buyerRaiseQuery.enterQueryText("Query for missing item in last order.");
        await buyerRaiseQuery.clickOnSubmitButton();

        // Wait for the success message to be displayed and get it
        await expect(page.locator("body")).toContainText("Query raised successfully.", { timeout: 20000 });
        const successMessage = await buyerRaiseQuery.getQueryRaisedSuccessMessage();
        expect(successMessage).toBe("Query raised successfully.");
    });

    // Test 2: TC_002_Verify_Query_Text_Required_Validation
    test("TC_002_Verify_Query_Text_Required_Validation", async () => {
        await buyerRaiseQuery.selectCategoryByVisibleText("Missing Items");
        await buyerRaiseQuery.clearQueryText();
        await buyerRaiseQuery.clickOnSubmitButton();

        const successMessageVisible = await buyerRaiseQuery.isSuccessMessageDisplayed();
        expect(successMessageVisible).toBe(false);

        const modalVisible = await buyerRaiseQuery.isRaiseQueryModalDisplayed();
        expect(modalVisible).toBe(true);
    });

    // Test 3: TC_003_Verify_Category_Dropdown_Options_And_Default
    test("TC_003_Verify_Category_Dropdown_Options_And_Default", async () => {
        const options = await buyerRaiseQuery.getAllCategoryOptions();

        expect(options.length).toBeGreaterThanOrEqual(5);
        expect(options).toContain("Missing Items");
        expect(options).toContain("Quantity Issue");
        expect(options).toContain("Item Mismatch");

        const selected = await buyerRaiseQuery.getSelectedCategory();
        expect(selected).toBe("Missing Items");
    });

    // Test 4: TC_004_Verify_Submit_Button_Enabled_State_And_Modal_Visibility
    test("TC_004_Verify_Submit_Button_Enabled_State_And_Modal_Visibility", async () => {
        const modalVisible = await buyerRaiseQuery.isRaiseQueryModalDisplayed();
        expect(modalVisible).toBe(true);

        const submitEnabled = await buyerRaiseQuery.isSubmitButtonVisibleAndEnabled();
        expect(submitEnabled).toBe(true);
    });

    // Test 5: TC_005_Verify_Close_Button_Closes_Raise_Query_Modal
    test("TC_005_Verify_Close_Button_Closes_Raise_Query_Modal", async () => {
        await buyerRaiseQuery.clickOnCloseButton();
        
        const modalClosed = await buyerRaiseQuery.isModalClosed();
        expect(modalClosed).toBe(true);
    });

    // Test 6: TC_006_Verify_Query_Text_Boundary_Long_Input
    test("TC_006_Verify_Query_Text_Boundary_Long_Input", async () => {
        const longQuery = "A".repeat(800);
        await buyerRaiseQuery.enterQueryText(longQuery);

        const enteredValue = await buyerRaiseQuery.getQueryTextValue();
        expect(enteredValue.length).toBeGreaterThan(0);
        expect(enteredValue.length).toBeLessThanOrEqual(longQuery.length);
    });

    // Test 7: TC_007_Verify_Raise_Query_For_Different_Category
    test("TC_007_Verify_Raise_Query_For_Different_Category", async ({ page }) => {
        await buyerRaiseQuery.selectCategoryByVisibleText("Delayed Delivery");
        const selected = await buyerRaiseQuery.getSelectedCategory();
        expect(selected).toBe("Delayed Delivery");

        await buyerRaiseQuery.enterQueryText("Order delivery is delayed beyond expected date.");
        await buyerRaiseQuery.clickOnSubmitButton();

        await expect(page.locator("body")).toContainText("Query raised successfully.", { timeout: 20000 });
        const successMessage = await buyerRaiseQuery.getQueryRaisedSuccessMessage();
        expect(successMessage).toBe("Query raised successfully.");
    });
});
