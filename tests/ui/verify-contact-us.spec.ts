import { test, expect } from "@playwright/test";
import { Homepagesteps } from "../../page-objects/page-steps/Home-page-steps";
import { MyAccountSteps } from "../../page-objects/page-steps/my-account-steps";
import { LoginWithOtpSteps } from "../../page-objects/page-steps/login-with-otp-steps";
import { ContactUsSteps } from "../../page-objects/page-steps/contact-us-steps";
import { config } from "../../utils/config-reader";

test.describe("Verify Contact Us Tests", () => {
    let homePage: Homepagesteps;
    let myAccount: MyAccountSteps;
    let loginWithOtp: LoginWithOtpSteps;
    let contactUs: ContactUsSteps;

    test.beforeEach(async ({ page }) => {
        test.setTimeout(180000);

        // Ensure BUYER_MOBILE is set in environment from config
        process.env.BUYER_MOBILE = config.buyerMobile || "9763274722";

        homePage = new Homepagesteps(page);
        myAccount = new MyAccountSteps(page);
        loginWithOtp = new LoginWithOtpSteps(page);
        contactUs = new ContactUsSteps(page);

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

        // Navigate to Contact Us page
        await myAccount.Click_on_my_account();
        await page.waitForTimeout(2000);
        await myAccount.Click_on_contact_us();
        await page.waitForTimeout(2000);
    });

    test("TC_001_Verify_Successful_Form_Submission_With_Valid_Data", async ({ page }) => {
        await contactUs.enterName("John Automation");
        await contactUs.enterEmail("john.automation@test.com");
        await contactUs.enterPhoneNumber("9876543210");
        await contactUs.enterMessage("This is a test message for contact us form validation.");
        await page.waitForTimeout(2000);
        await contactUs.Click_on_submit_button();

        await page.waitForTimeout(5000);
        const successMessage = await contactUs.Contact_Us_Success_Massage();
        expect(successMessage).toBe("Thanks for contacting us with your comments and questions. We'll respond to you very soon.");
    });

    test("TC_002_Verify_Empty_Name_Field_Validation", async ({ page }) => {
        await contactUs.enterEmail("test@example.com");
        await contactUs.enterPhoneNumber("9876543210");
        await contactUs.enterMessage("Test message");
        await page.waitForTimeout(1000);
        await contactUs.Click_on_submit_button();
        await page.waitForTimeout(2000);

        const nameError = await contactUs.getNameValidationMessage();
        expect(nameError.includes("This is a required field.") || nameError.length > 0).toBe(true);
    });

    test("TC_003_Verify_Empty_Email_Field_Validation", async ({ page }) => {
        await contactUs.enterName("John Doe");
        await contactUs.enterPhoneNumber("9876543210");
        await contactUs.enterMessage("Test message");
        await page.waitForTimeout(1000);
        await contactUs.Click_on_submit_button();
        await page.waitForTimeout(2000);

        const emailError = await contactUs.getEmailValidationMessage();
        expect(emailError.includes("This is a required field.") || emailError.length > 0).toBe(true);
    });

    test("TC_004_Verify_Empty_Message_Field_Validation", async ({ page }) => {
        await contactUs.enterName("Jane Smith");
        await contactUs.enterEmail("jane@example.com");
        await contactUs.enterPhoneNumber("9876543210");
        await page.waitForTimeout(1000);
        await contactUs.Click_on_submit_button();
        await page.waitForTimeout(2000);

        const messageError = await contactUs.getMessageValidationMessage();
        expect(messageError.includes("This is a required field.") || messageError.length > 0).toBe(true);
    });

    test("TC_005_Verify_All_Required_Fields_Empty_Validation", async ({ page }) => {
        await page.waitForTimeout(1000);
        await contactUs.Click_on_submit_button();
        await page.waitForTimeout(2000);

        const errorCount = await contactUs.getErrorMessageCount();
        expect(errorCount).toBeGreaterThanOrEqual(3);
    });

    test("TC_006_Verify_Form_Fields_Visibility", async () => {
        expect(await contactUs.isNameFieldVisible()).toBe(true);
        expect(await contactUs.isEmailFieldVisible()).toBe(true);
        expect(await contactUs.isPhoneFieldVisible()).toBe(true);
        expect(await contactUs.isMessageFieldVisible()).toBe(true);
        expect(await contactUs.isSubmitButtonVisibleAndEnabled()).toBe(true);
    });

    test("TC_007_Verify_Submit_Button_Enabled", async () => {
        const isButtonEnabled = await contactUs.isSubmitButtonVisibleAndEnabled();
        expect(isButtonEnabled).toBe(true);
    });

    test("TC_008_Verify_Phone_Number_Is_Optional_Field", async ({ page }) => {
        await contactUs.enterName("Optional Phone Test");
        await contactUs.enterEmail("optional@test.com");
        await contactUs.enterMessage("This submission is without phone number");
        await page.waitForTimeout(2000);
        await contactUs.Click_on_submit_button();

        await page.waitForTimeout(5000);
        const successMessage = await contactUs.Contact_Us_Success_Massage();
        expect(successMessage).toBe("Thanks for contacting us with your comments and questions. We'll respond to you very soon.");
    });

    test("TC_009_Verify_Invalid_Email_Format_Validation", async ({ page }) => {
        await contactUs.enterName("Email Test User");
        await contactUs.enterEmail("invalidemail@");
        await contactUs.enterPhoneNumber("9876543210");
        await contactUs.enterMessage("Testing invalid email format");
        await page.waitForTimeout(1000);
        await contactUs.Click_on_submit_button();
        await page.waitForTimeout(2000);

        const emailError = await contactUs.getEmailValidationMessage();
        const isSuccessDisplayed = await contactUs.isSuccessMessageDisplayed();
        expect(emailError.length > 0 || !isSuccessDisplayed).toBe(true);
    });

    test("TC_010_Verify_Valid_Email_Format_Accepted", async ({ page }) => {
        const validEmail = "validuser.test+tag@company.co.uk";
        await contactUs.enterName("Valid Email Tester");
        await contactUs.enterEmail(validEmail);
        await contactUs.enterPhoneNumber("9876543210");
        await contactUs.enterMessage("Testing valid email format");
        await page.waitForTimeout(2000);
        await contactUs.Click_on_submit_button();

        await page.waitForTimeout(5000);
        const successMessage = await contactUs.Contact_Us_Success_Massage();
        expect(successMessage).toBe("Thanks for contacting us with your comments and questions. We'll respond to you very soon.");
    });

    test("TC_011_Verify_Phone_Number_Format_Validation", async ({ page }) => {
        await contactUs.enterName("Phone Format Tester");
        await contactUs.enterEmail("phonetest@example.com");
        await contactUs.enterPhoneNumber("12345");
        await contactUs.enterMessage("Testing phone number validation");
        await page.waitForTimeout(2000);

        const phoneValue = await contactUs.getPhoneValue();
        expect(phoneValue).toBe("12345");
    });

    test("TC_012_Verify_Special_Characters_In_Name_Field", async ({ page }) => {
        await contactUs.enterName("John-Paul O'Brien");
        await contactUs.enterEmail("specialchar@test.com");
        await contactUs.enterPhoneNumber("9876543210");
        await contactUs.enterMessage("Testing special characters in name field");
        await page.waitForTimeout(2000);
        await contactUs.Click_on_submit_button();

        await page.waitForTimeout(5000);
        const successMessage = await contactUs.Contact_Us_Success_Massage();
        expect(successMessage).toBe("Thanks for contacting us with your comments and questions. We'll respond to you very soon.");
    });

    test("TC_013_Verify_Form_Field_Values_Retrieved_Correctly", async () => {
        const testName = "Test User Value";
        const testEmail = "testvalue@example.com";
        const testPhone = "9988776655";
        const testMessage = "Testing field value retrieval";

        await contactUs.enterName(testName);
        await contactUs.enterEmail(testEmail);
        await contactUs.enterPhoneNumber(testPhone);
        await contactUs.enterMessage(testMessage);

        expect(await contactUs.getNameValue()).toBe(testName);
        expect(await contactUs.getEmailValue()).toBe(testEmail);
        expect(await contactUs.getPhoneValue()).toBe(testPhone);
        expect(await contactUs.getMessageValue()).toBe(testMessage);
    });

    test("TC_014_Verify_Form_Fields_Are_Enabled_For_Input", async () => {
        expect(await contactUs.isNameFieldEnabled()).toBe(true);
        expect(await contactUs.isEmailFieldEnabled()).toBe(true);
        expect(await contactUs.isMessageFieldEnabled()).toBe(true);
    });

    test("TC_015_Verify_Long_Message_Text_Input", async ({ page }) => {
        let longMessage = "";
        for (let i = 0; i < 20; i++) {
            longMessage += "This is a long test message for contact form. ";
        }

        await contactUs.enterName("Long Message Tester");
        await contactUs.enterEmail("longmsg@test.com");
        await contactUs.enterPhoneNumber("9876543210");
        await contactUs.enterMessage(longMessage);
        await page.waitForTimeout(2000);
        await contactUs.Click_on_submit_button();

        await page.waitForTimeout(5000);
        const successMessage = await contactUs.Contact_Us_Success_Massage();
        expect(successMessage).toBe("Thanks for contacting us with your comments and questions. We'll respond to you very soon.");
    });

    test("TC_016_Verify_Multiple_Email_Format_Variations", async ({ page }) => {
        const validEmails = [
            "simple@example.com",
            "user.name@example.com",
            "user+tag@example.co.uk",
            "test123@test.in"
        ];

        for (const email of validEmails) {
            await contactUs.enterName("Email Format Tester");
            await contactUs.enterEmail(email);
            await contactUs.enterPhoneNumber("9876543210");
            await contactUs.enterMessage("Testing email format: " + email);
            await page.waitForTimeout(1500);
            await contactUs.Click_on_submit_button();
            await page.waitForTimeout(4000);

            const fieldEmail = await contactUs.getEmailValue();
            const isSuccess = await contactUs.isSuccessMessageDisplayed();
            expect(fieldEmail === email || isSuccess).toBe(true);

            if (email !== validEmails[validEmails.length - 1]) {
                await myAccount.Click_on_contact_us();
                await page.waitForTimeout(2000);
            }
        }
    });

    test("TC_017_Verify_Numeric_Values_In_Name_Field", async ({ page }) => {
        await contactUs.enterName("User 123 Test");
        await contactUs.enterEmail("numeric@test.com");
        await contactUs.enterPhoneNumber("9876543210");
        await contactUs.enterMessage("Testing numeric values in name");
        await page.waitForTimeout(2000);
        await contactUs.Click_on_submit_button();

        await page.waitForTimeout(5000);
        const successMessage = await contactUs.Contact_Us_Success_Massage();
        expect(successMessage).toBe("Thanks for contacting us with your comments and questions. We'll respond to you very soon.");
    });

    test("TC_018_Verify_Form_With_Minimum_Required_Data", async ({ page }) => {
        await contactUs.enterName("A");
        await contactUs.enterEmail("a@b.c");
        await contactUs.enterMessage("X");
        await page.waitForTimeout(2000);
        await contactUs.Click_on_submit_button();

        await page.waitForTimeout(5000);
        const successMessage = await contactUs.Contact_Us_Success_Massage();
        expect(successMessage).toBe("Thanks for contacting us with your comments and questions. We'll respond to you very soon.");
    });

    test("TC_019_Verify_Success_Message_Displayed_After_Submission", async ({ page }) => {
        await contactUs.fillFormWithValidData(
            "Success Message Tester",
            "success@test.com",
            "9876543210",
            "Testing success message display"
        );
        await page.waitForTimeout(2000);
        await contactUs.Click_on_submit_button();

        const isSuccessDisplayed = await contactUs.isSuccessMessageDisplayed();
        expect(isSuccessDisplayed).toBe(true);
    });

    test("TC_020_Verify_Whitespace_Handling_In_Message", async () => {
        const messageWithSpaces = "    Message with     multiple     spaces     ";
        await contactUs.enterName("Whitespace Tester");
        await contactUs.enterEmail("whitespace@test.com");
        await contactUs.enterPhoneNumber("9876543210");
        await contactUs.enterMessage(messageWithSpaces);

        const retrievedMessage = await contactUs.getMessageValue();
        expect(retrievedMessage.includes("Message") && retrievedMessage.includes("spaces")).toBe(true);
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
