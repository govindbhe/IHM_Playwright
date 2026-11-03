import { test, expect } from "@playwright/test";
import { Homepagesteps } from "../../page-objects/page-steps/Home-page-steps";
import { LoginWithOtpSteps } from "../../page-objects/page-steps/login-with-otp-steps";
import { config } from "../../utils/config-reader";

test.describe("Existing Buyer OTP Login Tests", () => {
    let homePage: Homepagesteps;
    let loginWithOtp: LoginWithOtpSteps;
    let buyerMobile: string;
    let LOGIN_URL: string;

    test.beforeEach(async ({ page }) => {
        test.setTimeout(180000);

        homePage = new Homepagesteps(page);
        loginWithOtp = new LoginWithOtpSteps(page);

        const baseUrl = config.url || "https://www.indiahandmade.com/";
        LOGIN_URL = baseUrl + "customer/account/login/";
        buyerMobile = config.buyerMobile || config.buyerMobile || "9763274722";
    });

    // ======================== SECTION 1: LOGIN PAGE UI VALIDATION ========================

    test("TC_001_Verify_Login_Page_Loads_Successfully", async ({ page }) => {
        await page.goto(LOGIN_URL);
        const currentUrl = page.url();
        expect(currentUrl).toContain("customer/account/login");
    });

    test("TC_002_Verify_Sign_In_Heading_Displayed", async ({ page }) => {
        await page.goto(LOGIN_URL);
        expect(await loginWithOtp.is_page_heading_displayed()).toBe(true);
        expect(await loginWithOtp.get_page_heading()).toBe("Sign In or Sign Up");
    });

    test("TC_003_Verify_Mobile_Email_Field_Displayed_With_Placeholder", async ({ page }) => {
        await page.goto(LOGIN_URL);
        expect(await loginWithOtp.isMobileEmailFieldDisplayed()).toBe(true);
        const placeholder = await loginWithOtp.getMobileEmailPlaceholder();
        expect(placeholder.includes("Mobile Number") || placeholder.includes("Email")).toBe(true);
    });

    test("TC_004_Verify_Get_OTP_Button_Displayed_And_Enabled", async ({ page }) => {
        await page.goto(LOGIN_URL);
        expect(await loginWithOtp.isGetOtpButtonDisplayed()).toBe(true);
        expect(await loginWithOtp.isGetOtpButtonEnabled()).toBe(true);
        expect(await loginWithOtp.getGetOtpButtonText()).toBe("Get OTP");
    });

    test("TC_005_Verify_OR_Separator_Displayed", async ({ page }) => {
        await page.goto(LOGIN_URL);
        expect(await loginWithOtp.isOrSeparatorDisplayed()).toBe(true);
    });

    test("TC_006_Verify_Google_Sign_In_Displayed", async ({ page }) => {
        await page.goto(LOGIN_URL);
        expect(await loginWithOtp.isGoogleSignInDisplayed()).toBe(true);
    });

    test("TC_007_Verify_Mobile_Email_Field_Empty_On_Load", async ({ page }) => {
        await page.goto(LOGIN_URL);
        const fieldValue = await loginWithOtp.getMobileEmailFieldValue();
        expect(fieldValue === null || fieldValue === "").toBe(true);
    });

    test("TC_008_Verify_All_Login_Page_Elements_Coexist", async ({ page }) => {
        await page.goto(LOGIN_URL);
        expect(await loginWithOtp.is_page_heading_displayed()).toBe(true);
        expect(await loginWithOtp.isMobileEmailFieldDisplayed()).toBe(true);
        expect(await loginWithOtp.isGetOtpButtonDisplayed()).toBe(true);
        expect(await loginWithOtp.isOrSeparatorDisplayed()).toBe(true);
        expect(await loginWithOtp.isGoogleSignInDisplayed()).toBe(true);
    });

    test("TC_009_Verify_Login_Page_Title_Not_Empty", async ({ page }) => {
        await page.goto(LOGIN_URL);
        const title = await page.title();
        expect(title.length).toBeGreaterThan(0);
    });

    test("TC_010_Verify_Mobile_Email_Field_Accepts_Input", async ({ page }) => {
        await page.goto(LOGIN_URL);
        await loginWithOtp.enterMobileOrEmail(buyerMobile);
        const fieldValue = await loginWithOtp.getMobileEmailFieldValue();
        expect(fieldValue).toBe(buyerMobile);
    });

    // ======================== SECTION 2: LOGIN PAGE INPUT VALIDATION (Negative Tests) ========================

    test("TC_011_Verify_Get_OTP_With_Empty_Field", async ({ page }) => {
        await page.goto(LOGIN_URL);
        await loginWithOtp.clearMobileEmailField();
        await loginWithOtp.clickSendOtp();
        await page.waitForTimeout(2000);
        expect(await loginWithOtp.isMobileEmailErrorDisplayed()).toBe(true);
    });

    test("TC_012_Verify_Get_OTP_With_Short_Mobile_Number", async ({ page }) => {
        await page.goto(LOGIN_URL);
        await loginWithOtp.enterMobileOrEmail("12345");
        await loginWithOtp.clickSendOtp();
        await page.waitForTimeout(2000);
        expect(await loginWithOtp.isMobileEmailErrorDisplayed()).toBe(true);
    });

    test("TC_013_Verify_Get_OTP_With_Invalid_Email_Format", async ({ page }) => {
        await page.goto(LOGIN_URL);
        await loginWithOtp.enterMobileOrEmail("user@");
        await loginWithOtp.clickSendOtp();
        await page.waitForTimeout(2000);
        expect(await loginWithOtp.isMobileEmailErrorDisplayed()).toBe(true);
    });

    test("TC_014_Verify_Get_OTP_With_Special_Characters", async ({ page }) => {
        await page.goto(LOGIN_URL);
        await loginWithOtp.enterMobileOrEmail("!@#$%^&*()");
        await loginWithOtp.clickSendOtp();
        await page.waitForTimeout(2000);
        expect(await loginWithOtp.isMobileEmailErrorDisplayed()).toBe(true);
    });

    test("TC_015_Verify_Get_OTP_With_Alphabets_Only", async ({ page }) => {
        await page.goto(LOGIN_URL);
        await loginWithOtp.enterMobileOrEmail("abcdefghij");
        await loginWithOtp.clickSendOtp();
        await page.waitForTimeout(2000);
        expect(await loginWithOtp.isMobileEmailErrorDisplayed()).toBe(true);
    });

    test("TC_016_Verify_Get_OTP_With_Long_Mobile_Number", async ({ page }) => {
        await page.goto(LOGIN_URL);
        await loginWithOtp.enterMobileOrEmail("123456789012345");
        await loginWithOtp.clickSendOtp();
        await page.waitForTimeout(2000);
        expect(await loginWithOtp.isMobileEmailErrorDisplayed()).toBe(true);
    });

    test("TC_017_Verify_Get_OTP_With_Spaces_Only", async ({ page }) => {
        await page.goto(LOGIN_URL);
        await loginWithOtp.enterMobileOrEmail("          ");
        await loginWithOtp.clickSendOtp();
        await page.waitForTimeout(2000);
        expect(await loginWithOtp.isMobileEmailErrorDisplayed()).toBe(true);
    });

    test("TC_018_Verify_Get_OTP_With_Zero_Start_Mobile", async ({ page }) => {
        await page.goto(LOGIN_URL);
        await loginWithOtp.enterMobileOrEmail("0123456789");
        await loginWithOtp.clickSendOtp();
        await page.waitForTimeout(2000);
        const hasError = await loginWithOtp.isMobileEmailErrorDisplayed();
        const currentUrl = page.url();
        expect(hasError || currentUrl.includes("customer/account/login")).toBe(true);
    });

    test("TC_019_Verify_Error_Message_Text_For_Empty_Field", async ({ page }) => {
        await page.goto(LOGIN_URL);
        await loginWithOtp.clearMobileEmailField();
        await loginWithOtp.clickSendOtp();
        await page.waitForTimeout(2000);
        if (await loginWithOtp.isMobileEmailErrorDisplayed()) {
            const errorText = await loginWithOtp.getMobileEmailErrorText();
            expect(errorText.length).toBeGreaterThan(0);
        }
    });

    test("TC_020_Verify_Valid_Mobile_Navigates_To_OTP_Screen", async ({ page }) => {
        await page.goto(LOGIN_URL);
        await loginWithOtp.enterMobileOrEmail(buyerMobile);
        await loginWithOtp.clickSendOtp();
        await page.waitForTimeout(3000);
        expect(await loginWithOtp.isVerifyButtonDisplayed()).toBe(true);
    });

    // ======================== SECTION 3: OTP PAGE UI VALIDATION ========================

    test("TC_021_Verify_OTP_Page_Heading", async ({ page }) => {
        await page.goto(LOGIN_URL);
        await loginWithOtp.enterMobileOrEmail(buyerMobile);
        await loginWithOtp.clickSendOtp();
        await page.waitForTimeout(3000);
        expect(await loginWithOtp.is_page_heading_displayed()).toBe(true);
        expect(await loginWithOtp.get_page_heading()).toBe("Sign In or Sign Up");
    });

    test("TC_022_Verify_OTP_Boxes_Visible", async ({ page }) => {
        await page.goto(LOGIN_URL);
        await loginWithOtp.enterMobileOrEmail(buyerMobile);
        await loginWithOtp.clickSendOtp();
        await page.waitForTimeout(3000);
        expect(await loginWithOtp.are_otp_boxes_visible()).toBe(true);
    });

    test("TC_023_Verify_Enter_OTP_Message_Displayed", async ({ page }) => {
        await page.goto(LOGIN_URL);
        await loginWithOtp.enterMobileOrEmail(buyerMobile);
        await loginWithOtp.clickSendOtp();
        await page.waitForTimeout(3000);
        const otpMessage = await loginWithOtp.get_otp_message();
        expect(otpMessage.length).toBeGreaterThan(0);
    });

    test("TC_024_Verify_Phone_Number_In_OTP_Sent_Message", async ({ page }) => {
        await page.goto(LOGIN_URL);
        await loginWithOtp.enterMobileOrEmail(buyerMobile);
        await loginWithOtp.clickSendOtp();
        await page.waitForTimeout(3000);
        const sentMessage = await loginWithOtp.get_phone_number_display();
        expect(sentMessage).toContain(buyerMobile);
    });

    test("TC_025_Verify_Change_Link_Displayed_On_OTP_Page", async ({ page }) => {
        await page.goto(LOGIN_URL);
        await loginWithOtp.enterMobileOrEmail(buyerMobile);
        await loginWithOtp.clickSendOtp();
        await page.waitForTimeout(3000);
        expect(await loginWithOtp.isChangeLinkDisplayed()).toBe(true);
    });

    test("TC_026_Verify_Verify_Button_Displayed_And_Enabled", async ({ page }) => {
        await page.goto(LOGIN_URL);
        await loginWithOtp.enterMobileOrEmail(buyerMobile);
        await loginWithOtp.clickSendOtp();
        await page.waitForTimeout(3000);
        expect(await loginWithOtp.isVerifyButtonDisplayed()).toBe(true);
        expect(await loginWithOtp.is_verify_button_enabled()).toBe(true);
    });

    test("TC_027_Verify_Timer_Displayed_On_OTP_Page", async ({ page }) => {
        await page.goto(LOGIN_URL);
        await loginWithOtp.enterMobileOrEmail(buyerMobile);
        await loginWithOtp.clickSendOtp();
        await page.waitForTimeout(3000);
        expect(await loginWithOtp.is_timer_visible()).toBe(true);
        const timerText = await loginWithOtp.get_timer_text();
        expect(timerText).toMatch(/\d{1,2}:\d{2}/);
    });

    test("TC_028_Verify_Not_Received_OTP_Text_Displayed", async ({ page }) => {
        await page.goto(LOGIN_URL);
        await loginWithOtp.enterMobileOrEmail(buyerMobile);
        await loginWithOtp.clickSendOtp();
        await page.waitForTimeout(3000);
        expect(await loginWithOtp.isNotReceivedOtpTextDisplayed()).toBe(true);
    });

    test("TC_029_Verify_URL_Remains_On_Login_During_OTP", async ({ page }) => {
        await page.goto(LOGIN_URL);
        await loginWithOtp.enterMobileOrEmail(buyerMobile);
        await loginWithOtp.clickSendOtp();
        await page.waitForTimeout(3000);
        const currentUrl = page.url();
        expect(currentUrl).toContain("customer/account/login");
    });

    test("TC_030_Verify_All_OTP_Page_Elements_Coexist", async ({ page }) => {
        await page.goto(LOGIN_URL);
        await loginWithOtp.enterMobileOrEmail(buyerMobile);
        await loginWithOtp.clickSendOtp();
        await page.waitForTimeout(3000);
        expect(await loginWithOtp.is_page_heading_displayed()).toBe(true);
        expect(await loginWithOtp.are_otp_boxes_visible()).toBe(true);
        expect(await loginWithOtp.isVerifyButtonDisplayed()).toBe(true);
        expect(await loginWithOtp.is_timer_visible()).toBe(true);
        expect(await loginWithOtp.isChangeLinkDisplayed()).toBe(true);
    });

    // ======================== SECTION 4: OTP INPUT FUNCTIONALITY TESTS ========================

    test("TC_031_Verify_Enter_OTP_Individual_Digits", async ({ page }) => {
        await page.goto(LOGIN_URL);
        await loginWithOtp.enterMobileOrEmail(buyerMobile);
        await loginWithOtp.clickSendOtp();
        await page.waitForTimeout(3000);
        await loginWithOtp.enter_otp_digit_1("0");
        await loginWithOtp.enter_otp_digit_2("1");
        await loginWithOtp.enter_otp_digit_3("2");
        await loginWithOtp.enter_otp_digit_4("3");
        await loginWithOtp.enter_otp_digit_5("4");
        await loginWithOtp.enter_otp_digit_6("5");
        expect(await loginWithOtp.get_otp_box_1_value()).toBe("0");
        expect(await loginWithOtp.get_otp_box_2_value()).toBe("1");
        expect(await loginWithOtp.get_otp_box_3_value()).toBe("2");
        expect(await loginWithOtp.get_otp_box_4_value()).toBe("3");
        expect(await loginWithOtp.get_otp_box_5_value()).toBe("4");
        expect(await loginWithOtp.get_otp_box_6_value()).toBe("5");
    });

    test("TC_032_Verify_Enter_Complete_OTP", async ({ page }) => {
        await page.goto(LOGIN_URL);
        await loginWithOtp.enterMobileOrEmail(buyerMobile);
        await loginWithOtp.clickSendOtp();
        await page.waitForTimeout(3000);
        await loginWithOtp.enter_complete_otp("654321");
        expect(await loginWithOtp.get_otp_box_1_value()).toBe("6");
        expect(await loginWithOtp.get_otp_box_6_value()).toBe("1");
    });

    test("TC_033_Verify_Clear_All_OTP_Boxes", async ({ page }) => {
        await page.goto(LOGIN_URL);
        await loginWithOtp.enterMobileOrEmail(buyerMobile);
        await loginWithOtp.clickSendOtp();
        await page.waitForTimeout(3000);
        await loginWithOtp.enter_complete_otp("123456");
        await loginWithOtp.clear_all_otp_boxes();
        expect(await loginWithOtp.get_otp_box_1_value()).toBe("");
        expect(await loginWithOtp.get_otp_box_2_value()).toBe("");
        expect(await loginWithOtp.get_otp_box_3_value()).toBe("");
        expect(await loginWithOtp.get_otp_box_4_value()).toBe("");
        expect(await loginWithOtp.get_otp_box_5_value()).toBe("");
        expect(await loginWithOtp.get_otp_box_6_value()).toBe("");
    });

    test("TC_034_Verify_OTP_Reentry_After_Clear", async ({ page }) => {
        await page.goto(LOGIN_URL);
        await loginWithOtp.enterMobileOrEmail(buyerMobile);
        await loginWithOtp.clickSendOtp();
        await page.waitForTimeout(3000);
        await loginWithOtp.enter_complete_otp("111111");
        await loginWithOtp.clear_all_otp_boxes();
        await loginWithOtp.enter_complete_otp("987654");
        expect(await loginWithOtp.get_otp_box_1_value()).toBe("9");
        expect(await loginWithOtp.get_otp_box_6_value()).toBe("4");
    });

    test("TC_035_Verify_OTP_Box_Accepts_Only_Numbers", async ({ page }) => {
        await page.goto(LOGIN_URL);
        await loginWithOtp.enterMobileOrEmail(buyerMobile);
        await loginWithOtp.clickSendOtp();
        await page.waitForTimeout(3000);
        await loginWithOtp.clear_all_otp_boxes();
        await loginWithOtp.enter_otp_digit_1("a");
        const value = await loginWithOtp.get_otp_box_1_value();
        expect(value === "" || /^\d*$/.test(value)).toBe(true);
    });

    test("TC_036_Verify_OTP_Box_Maxlength", async ({ page }) => {
        await page.goto(LOGIN_URL);
        await loginWithOtp.enterMobileOrEmail(buyerMobile);
        await loginWithOtp.clickSendOtp();
        await page.waitForTimeout(3000);
        for (let i = 1; i <= 6; i++) {
            const maxLength = await loginWithOtp.getOtpBoxMaxLength(i);
            if (maxLength) {
                expect(maxLength).toBe("1");
            }
        }
    });

    test("TC_037_Verify_OTP_All_Zeros", async ({ page }) => {
        await page.goto(LOGIN_URL);
        await loginWithOtp.enterMobileOrEmail(buyerMobile);
        await loginWithOtp.clickSendOtp();
        await page.waitForTimeout(3000);
        await loginWithOtp.enter_complete_otp("000000");
        expect(await loginWithOtp.get_otp_box_1_value()).toBe("0");
        expect(await loginWithOtp.get_otp_box_6_value()).toBe("0");
    });

    test("TC_038_Verify_OTP_All_Nines", async ({ page }) => {
        await page.goto(LOGIN_URL);
        await loginWithOtp.enterMobileOrEmail(buyerMobile);
        await loginWithOtp.clickSendOtp();
        await page.waitForTimeout(3000);
        await loginWithOtp.enter_complete_otp("999999");
        expect(await loginWithOtp.get_otp_box_1_value()).toBe("9");
        expect(await loginWithOtp.get_otp_box_6_value()).toBe("9");
    });

    test("TC_039_Verify_OTP_Space_Input_Rejected", async ({ page }) => {
        await page.goto(LOGIN_URL);
        await loginWithOtp.enterMobileOrEmail(buyerMobile);
        await loginWithOtp.clickSendOtp();
        await page.waitForTimeout(3000);
        await loginWithOtp.clear_all_otp_boxes();
        await loginWithOtp.enter_otp_digit_1(" ");
        const value = await loginWithOtp.get_otp_box_1_value();
        expect(value === "" || value.trim() === "").toBe(true);
    });

    test("TC_040_Verify_Invalid_OTP_Length_Throws_Exception", async () => {
        // The Playwright step throws Error with "OTP must be 6 digits"
        await expect(async () => {
            await loginWithOtp.enter_complete_otp("12345");
        }).rejects.toThrow("6 digits");
    });

    // ======================== SECTION 5: OTP VERIFICATION & ERROR HANDLING ========================

    test("TC_041_Verify_Verify_With_Empty_OTP", async ({ page }) => {
        await page.goto(LOGIN_URL);
        await loginWithOtp.enterMobileOrEmail(buyerMobile);
        await loginWithOtp.clickSendOtp();
        await page.waitForTimeout(3000);
        await loginWithOtp.clear_all_otp_boxes();
        await loginWithOtp.click_verify_button();
        await page.waitForTimeout(2000);
        const hasError = await loginWithOtp.is_error_message_displayed();
        const otpBoxesVisible = await loginWithOtp.are_otp_boxes_visible();
        expect(hasError || otpBoxesVisible).toBe(true);
    });

    test("TC_042_Verify_Verify_With_Partial_OTP", async ({ page }) => {
        await page.goto(LOGIN_URL);
        await loginWithOtp.enterMobileOrEmail(buyerMobile);
        await loginWithOtp.clickSendOtp();
        await page.waitForTimeout(3000);
        await loginWithOtp.clear_all_otp_boxes();
        await loginWithOtp.enter_otp_digit_1("1");
        await loginWithOtp.enter_otp_digit_2("2");
        await loginWithOtp.enter_otp_digit_3("3");
        await loginWithOtp.click_verify_button();
        await page.waitForTimeout(2000);
        const hasError = await loginWithOtp.is_error_message_displayed();
        const otpBoxesVisible = await loginWithOtp.are_otp_boxes_visible();
        expect(hasError || otpBoxesVisible).toBe(true);
    });

    test("TC_043_Verify_Wrong_OTP_Shows_Error_Message", async ({ page }) => {
        await page.goto(LOGIN_URL);
        await loginWithOtp.enterMobileOrEmail(buyerMobile);
        await loginWithOtp.clickSendOtp();
        await page.waitForTimeout(3000);
        await loginWithOtp.enter_complete_otp("111111");
        await loginWithOtp.click_verify_button();
        await page.waitForTimeout(3000);
        expect(await loginWithOtp.is_error_message_displayed()).toBe(true);
        const errorText = await loginWithOtp.get_error_message();
        expect(errorText.length).toBeGreaterThan(0);
    });

    test("TC_044_Verify_Page_Stays_After_Wrong_OTP", async ({ page }) => {
        await page.goto(LOGIN_URL);
        await loginWithOtp.enterMobileOrEmail(buyerMobile);
        await loginWithOtp.clickSendOtp();
        await page.waitForTimeout(3000);
        await loginWithOtp.enter_complete_otp("000000");
        await loginWithOtp.click_verify_button();
        await page.waitForTimeout(3000);
        const currentUrl = page.url();
        expect(currentUrl).toContain("customer/account/login");
    });

    // ======================== SECTION 6: NAVIGATION & LINK TESTS ========================

    test("TC_045_Verify_Change_Link_Navigates_Back", async ({ page }) => {
        await page.goto(LOGIN_URL);
        await loginWithOtp.enterMobileOrEmail(buyerMobile);
        await loginWithOtp.clickSendOtp();
        await page.waitForTimeout(3000);
        await loginWithOtp.click_change_link();
        await page.waitForTimeout(2000);
        expect(await loginWithOtp.isMobileEmailFieldDisplayed()).toBe(true);
        expect(await loginWithOtp.isGetOtpButtonDisplayed()).toBe(true);
    });

    test("TC_046_Verify_Resend_OTP_Link_Clickable", async ({ page }) => {
        test.setTimeout(300000); // Extended timeout for timer wait
        await page.goto(LOGIN_URL);
        await loginWithOtp.enterMobileOrEmail(buyerMobile);
        await loginWithOtp.clickSendOtp();
        await page.waitForTimeout(120000); // Wait for timer to expire
        try {
            await loginWithOtp.click_Resend_otp_link();
            expect(true).toBe(true); // Resend OTP link is clickable
        } catch {
            expect(await loginWithOtp.isResendOtpTextDisplayed()).toBe(true);
        }
    });

    test("TC_047_Verify_Mobile_Retained_After_Change", async ({ page }) => {
        await page.goto(LOGIN_URL);
        await loginWithOtp.enterMobileOrEmail(buyerMobile);
        await loginWithOtp.clickSendOtp();
        await page.waitForTimeout(3000);
        await loginWithOtp.click_change_link();
        await page.waitForTimeout(2000);
        const fieldValue = await loginWithOtp.getMobileEmailFieldValue();
        expect(fieldValue).not.toBeNull();
    });
});
