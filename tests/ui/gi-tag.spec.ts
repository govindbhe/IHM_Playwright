import { test, expect } from "@playwright/test";
import { Homepagesteps } from "../../page-objects/page-steps/Home-page-steps";
import { SellerLoginSteps } from "../../page-objects/page-steps/seller-login-steps";
import { DashboardPageSteps } from "../../page-objects/page-steps/dashboard-page-steps";
import { GiTagSteps } from "../../page-objects/page-steps/gi-tag-steps";
import { config } from "../../utils/config-reader";

test.describe("GI Tag Tests", () => {
    let homePage: Homepagesteps;
    let sellerLogin: SellerLoginSteps;
    let dashboard: DashboardPageSteps;
    let giTag: GiTagSteps;

    // This suite needs a dedicated GI-enabled seller account, which is separate from
    // the regular SELLER_* credentials. When it is not configured, skip with a clear
    // reason instead of reporting a misleading failure. Supplying the two env vars
    // re-enables the suite automatically.
    test.skip(
        !config.giSellerEmail || !config.giSellerPassword,
        "GI_SELLER_EMAIL / GI_SELLER_PASSWORD are not set in .env - this suite requires a GI-enabled seller account"
    );

    test.beforeEach(async ({ page }) => {
        test.setTimeout(180000);

        homePage = new Homepagesteps(page);
        sellerLogin = new SellerLoginSteps(page);
        dashboard = new DashboardPageSteps(page);
        giTag = new GiTagSteps(page);

        // Navigate to the application
        const appUrl = config.url || "https://www.indiahandmade.com/";
        await page.goto(appUrl);

        // Login as seller
        await homePage.Click_on_Vendar_LogIn();
        await sellerLogin.enter_email(config.giSellerEmail);
        await sellerLogin.enter_Password(config.giSellerPassword);
        await sellerLogin.Click_on_Sign_In_Button();

        // Navigate to GI Tagged Products Info page
        await dashboard.Click_On_Click_GI_Taged_Products();
        await page.waitForTimeout(2000);
        await dashboard.Click_On_Click_GI_Taged_Products_info();
        await page.waitForTimeout(2000);

        // Fill GI Tag details
        await giTag.send_gi_certificate_no();
        await giTag.select_Gi_Number();
        await giTag.sendDateInMMDDYYYYFormat("06/15/2024");
        await giTag.Upload_certificate_img();
        await giTag.sendDate_registration_valid_upto_date("25/06/2030");
        await giTag.Click_GI_submit();
    });

    // Test: Verify GI Tag Added Successfully
    test("TC_001_Verify_GI_Tage_Added_Successfully", async () => {
        const message = await giTag.GI_Add_Success_Massage();
        // Assert on substring: the matched element may include surrounding text.
        expect(message).toContain("saved successfully");
    });

    test.afterEach(async ({ page }) => {
        // Logout from application
        try {
            await dashboard.Click_On_Seller_Panel();
            await page.waitForTimeout(2000);
            await dashboard.Click_On_Logout();
        } catch (e) {
            console.log("Logout failed: " + e);
        }
    });
});
