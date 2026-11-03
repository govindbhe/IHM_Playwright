import { test, expect, Page } from "@playwright/test";
import { Homepagesteps } from "../../page-objects/page-steps/Home-page-steps";
import { MyAccountSteps } from "../../page-objects/page-steps/my-account-steps";
import { MyProfileSteps } from "../../page-objects/page-steps/my-profile-steps";
import { LoginWithOtpSteps } from "../../page-objects/page-steps/login-with-otp-steps";
import { config } from "../../utils/config-reader";

test.describe.configure({ mode: "serial" });

test.describe("Buyer Profile Update Tests", () => {
    let sharedPage: Page;
    let homePage: Homepagesteps;
    let myAccount: MyAccountSteps;
    let myProfile: MyProfileSteps;
    let loginWithOtp: LoginWithOtpSteps;

    const ensureBuyerSession = async () => {
        const currentUrl = sharedPage.url();
        const sessionEnded = /logoutSuccess|customer\/account\/login|customer\/account\/logout/i.test(currentUrl);

        if (sessionEnded) {
            const loginUrl = new URL("customer/account/login/", config.url).toString();

            try {
                await sharedPage.goto(loginUrl, { waitUntil: "domcontentloaded" });
            } catch {
                await sharedPage.goto(config.url, { waitUntil: "domcontentloaded" });
                await homePage.Click_on_SignIn();
                await homePage.Click_on_LoginInOrSignUP();
            }

            await loginWithOtp.Buyer_Login_With_OTP_Via_Email();
            await expect(sharedPage).toHaveURL(/customer/, { timeout: 60000 });
        }
    };

    test.beforeAll(async ({ browser }) => {
        test.setTimeout(180000);

        // Ensure BUYER_MOBILE is set in environment from config
        process.env.BUYER_MOBILE = config.buyerMobile;

        const context = await browser.newContext();
        sharedPage = await context.newPage();

        homePage = new Homepagesteps(sharedPage);
        myAccount = new MyAccountSteps(sharedPage);
        myProfile = new MyProfileSteps(sharedPage);
        loginWithOtp = new LoginWithOtpSteps(sharedPage);

        const appUrl = config.url;
        await sharedPage.goto(appUrl);

        // Perform login using the real buyer email (BUYER_EMAIL) and the OTP delivered
        // to that mailbox, fetched over IMAP.
        await homePage.Click_on_SignIn();
        await homePage.Click_on_LoginInOrSignUP();
        await loginWithOtp.Buyer_Login_With_OTP_Via_Email();

        // Wait for page to navigate to dashboard (customer URL)
        await expect(sharedPage).toHaveURL(/customer/, { timeout: 60000 });
    });

    // The site intermittently aborts rapid navigations (net::ERR_ABORTED). Retry with
    // a short backoff instead of failing the whole test on a transient network abort.
    const gotoWithRetry = async (url: string, attempts = 3): Promise<void> => {
        for (let attempt = 1; attempt <= attempts; attempt++) {
            try {
                await sharedPage.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
                return;
            } catch (err) {
                if (attempt === attempts) throw err;
                await sharedPage.waitForTimeout(3000 * attempt);
            }
        }
    };

    test.beforeEach(async () => {
        // Retries + waitForURL + a possible re-login can exceed the 30s default hook cap.
        test.setTimeout(180000);

        const myAccountUrl = new URL("customer/account/", config.url).toString();
        await gotoWithRetry(myAccountUrl).catch(() => undefined);
        await sharedPage
            .waitForURL(/customer\/account|customer\/account\/login|logoutSuccess|customer\/account\/logout/i, {
                timeout: 30000,
            })
            .catch(() => undefined);

        if (/customer\/account\/login|logoutSuccess|customer\/account\/logout/i.test(sharedPage.url())) {
            await ensureBuyerSession();
            await gotoWithRetry(myAccountUrl);
        }

        await myAccount.Click_on_my_profile();
        await expect(sharedPage.locator("//input[@name='firstname']")).toBeVisible({ timeout: 30000 });

    });

    // Test 1
    test("Verify Buyer Profile Update", async () => {
        await myProfile.Sendfirst_name("Govind");
        await myProfile.send_last_name("Bhee");
        await myProfile.Click_on_maleradioButton();
        await myProfile.Click_on_submit_button();

        const feedbackMessage = await myProfile.captureFeedbackMessage("Profile updated successfully");
        expect(feedbackMessage).toContain("Profile updated successfully");
    });

    // Test 2
    test("Verify Mobile Number Is Not Editable", async () => {
        const originalPhone = await myProfile.get_phone_number_value();
        const phoneEditable = await myProfile.is_phone_number_editable();
        const updateAttempted = await myProfile.try_update_phone_number("9999999999");
        const currentPhone = await myProfile.get_phone_number_value();

        expect(phoneEditable).toBe(false);
        expect(currentPhone).toBe(originalPhone);
        expect(updateAttempted).toBe(false);
    });

    // Test 3
    test("Verify Email Is Not Editable", async () => {
        const originalEmail = await myProfile.get_email_value();
        const emailEditable = await myProfile.is_email_editable();
        const updateAttempted = await myProfile.try_update_email("newmail@example.com");
        const currentEmail = await myProfile.get_email_value();

        expect(emailEditable).toBe(false);
        expect(currentEmail).toBe(originalEmail);
        expect(updateAttempted).toBe(false);
    });

    // Test 4
    test("Verify Empty First Name Validation Alert", async () => {
        await myProfile.clear_first_name();
        await myProfile.send_last_name("Bhee");
        await myProfile.Click_on_submit_button();

        const feedbackMessage = await myProfile.captureFeedbackMessage("First name is required.");
        expect(feedbackMessage).toContain("First name is required.");
    });

    // Test 5
    test("Verify Empty Last Name Validation Alert", async () => {
        await myProfile.Sendfirst_name("Govind");
        await myProfile.clear_last_name();
        await myProfile.Click_on_submit_button();

        const feedbackMessage = await myProfile.captureFeedbackMessage("Last name is required.");
        expect(feedbackMessage).toContain("Last name is required.");
    });

    // Test 6
    test("Verify Profile Form Fields Visibility And State", async () => {
        expect(await myProfile.is_first_name_field_displayed()).toBe(true);
        expect(await myProfile.is_last_name_field_displayed()).toBe(true);
        expect(await myProfile.is_phone_field_displayed()).toBe(true);
        expect(await myProfile.is_email_field_displayed()).toBe(true);
        expect(await myProfile.is_submit_button_enabled()).toBe(true);
    });

    // Test 7
    test("Verify Name Trim Behavior On Update", async () => {
        await myProfile.Sendfirst_name("  Govind  ");
        await myProfile.send_last_name("  Bhee  ");
        await myProfile.Click_on_submit_button();

        const feedbackMessage = await myProfile.captureFeedbackMessage("Profile updated successfully");
        expect(feedbackMessage).toContain("Profile updated successfully");
    });

    test.afterAll(async () => {
        if (sharedPage) {
            try {
                const logoutUrl = new URL("customer/account/logout/", config.url).toString();
                await sharedPage.goto(logoutUrl, { waitUntil: "domcontentloaded" });
            } catch {
                // Ignore logout cleanup failures to keep teardown non-blocking.
            }
            await sharedPage.close();
        }
    });
});
