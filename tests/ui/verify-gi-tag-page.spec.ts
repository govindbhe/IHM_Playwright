import { test, expect } from "@playwright/test";
import { Homepagesteps } from "../../page-objects/page-steps/Home-page-steps";
import { SellerLoginSteps } from "../../page-objects/page-steps/seller-login-steps";
import { DashboardPageSteps } from "../../page-objects/page-steps/dashboard-page-steps";
import { GiTagSteps } from "../../page-objects/page-steps/gi-tag-steps";
import { config } from "../../utils/config-reader";

test.describe("Verify GI Tag Page Tests", () => {
    let homePage: Homepagesteps;
    let sellerLogin: SellerLoginSteps;
    let dashboard: DashboardPageSteps;
    let giTagePage: GiTagSteps;
    let GI_URL: string;

    // This suite needs a dedicated GI-enabled seller account, which is separate from
    // the regular SELLER_* credentials. When it is not configured, skip with a clear
    // reason instead of reporting a misleading failure. Supplying the two env vars
    // re-enables the suite automatically.
    test.skip(
        !config.giSellerEmail || !config.giSellerPassword,
        "GI_SELLER_EMAIL / GI_SELLER_PASSWORD are not set in .env - this suite requires a GI-enabled seller account"
    );

    const fillAndSubmitValidGIForm = async (giTagePage: GiTagSteps) => {
        const randomCertNo = "152" + Math.floor(100 + Math.random() * 900);
        await giTagePage.send_gi_certificate_no(randomCertNo);
        await giTagePage.select_Gi_Number();
        await giTagePage.sendDateInMMDDYYYYFormat("06/15/2024");
        await giTagePage.Upload_certificate_img("C:/Users/DELL/Documents/chappls/GOVV.jpg");
        await giTagePage.sendDate_registration_valid_upto_date("25/06/2030");
        await giTagePage.Click_GI_submit();
    };

    test.beforeEach(async ({ page }) => {
        test.setTimeout(180000);

        homePage = new Homepagesteps(page);
        sellerLogin = new SellerLoginSteps(page);
        dashboard = new DashboardPageSteps(page);
        giTagePage = new GiTagSteps(page);

        // Navigate to base URL
        const appUrl = config.url || "https://www.indiahandmade.com/";
        GI_URL = appUrl + "marketplace/awardee/awardregistration/"; // Note: Java code navigates dynamically via click info

        await page.goto(appUrl);
        await page.waitForTimeout(2000);

        // Login as seller
        await homePage.Click_on_Vendar_LogIn();
        await sellerLogin.enter_email(config.giSellerEmail);
        await sellerLogin.enter_Password(config.giSellerPassword);
        await sellerLogin.Click_on_Sign_In_Button();
        await page.waitForTimeout(3000);

        // Click GI Tagged Products section
        await dashboard.Click_On_Click_GI_Taged_Products();
        await page.waitForTimeout(1000);
        await dashboard.Click_On_Click_GI_Taged_Products_info();
        await page.waitForTimeout(2000);
    });

    test("TC_002_Verify_GI_Tage_Added_Successfully", async () => {
        await fillAndSubmitValidGIForm(giTagePage);
        const successMessage = await giTagePage.GI_Add_Success_Massage();
        expect(successMessage).toBe("Data saved successfully!");
    });

    test("TC_003_Verify_GI_Form_Heading_Is_Displayed", async () => {
        const headingDisplayed = await giTagePage.isFormHeadingDisplayed();
        expect(headingDisplayed).toBe(true);
        if (headingDisplayed) {
            expect(await giTagePage.getFormHeadingText()).toBe("GI Tagged Product Info");
        }
    });

    test("TC_004_Verify_All_Form_Fields_Are_Displayed", async () => {
        expect(await giTagePage.isGiCertificateNoDisplayed()).toBe(true);
        expect(await giTagePage.isSelectGiNumberDisplayed()).toBe(true);
        expect(await giTagePage.isCertificateDateDisplayed()).toBe(true);
        expect(await giTagePage.isCertificateUploadDisplayed()).toBe(true);
        expect(await giTagePage.isValidUptoDateDisplayed()).toBe(true);
        expect(await giTagePage.isSubmitButtonDisplayed()).toBe(true);
    });

    test("TC_005_Verify_All_Form_Labels_Are_Displayed", async () => {
        expect(await giTagePage.isLabelGiCertificateNoDisplayed()).toBe(true);
        expect(await giTagePage.isLabelSelectGiNumberDisplayed()).toBe(true);
        expect(await giTagePage.isLabelCertificateDateDisplayed()).toBe(true);
        expect(await giTagePage.isLabelUploadCertificateDisplayed()).toBe(true);
    });

    test("TC_006_Verify_Submit_Button_Is_Enabled", async () => {
        expect(await giTagePage.isSubmitButtonEnabled()).toBe(true);
    });

    test("TC_007_Verify_Allowed_Extensions_Text_Is_Displayed", async () => {
        const extText = await giTagePage.getAllowedExtensionsText();
        const hasJpegJpg = extText.includes("jpeg") || extText.includes("jpg");
        expect(hasJpegJpg).toBe(true);
        expect(extText.includes("png")).toBe(true);
        expect(extText.includes("pdf")).toBe(true);
    });

    test("TC_008_Verify_GI_Number_Dropdown_Has_Options", async () => {
        const optionCount = await giTagePage.getGiNumberDropdownOptionsCount();
        expect(optionCount).toBeGreaterThan(1);
    });

    test("TC_009_Verify_GI_Number_Dropdown_Default_Selection", async () => {
        const defaultText = await giTagePage.getFirstSelectedGiNumberText();
        expect(defaultText).toBe("Select GI Number");
    });

    test("TC_010_Verify_Submit_With_All_Empty_Fields", async () => {
        await giTagePage.Click_GI_submit();
        expect(await giTagePage.isSuccessMessageDisplayed()).toBe(false);
    });

    test("TC_011_Verify_Submit_Without_GI_Certificate_Number", async () => {
        await giTagePage.select_Gi_Number();
        await giTagePage.sendDateInMMDDYYYYFormat("06/15/2024");
        await giTagePage.Upload_certificate_img("C:/Users/DELL/Documents/chappls/GOVV.jpg");
        await giTagePage.sendDate_registration_valid_upto_date("25/06/2030");
        await giTagePage.Click_GI_submit();
        expect(await giTagePage.isSuccessMessageDisplayed()).toBe(false);
    });

    test("TC_012_Verify_Submit_Without_GI_Number_Selection", async () => {
        await giTagePage.send_gi_certificate_no("152656");
        await giTagePage.sendDateInMMDDYYYYFormat("06/15/2024");
        await giTagePage.Upload_certificate_img("C:/Users/DELL/Documents/chappls/GOVV.jpg");
        await giTagePage.sendDate_registration_valid_upto_date("25/06/2030");
        await giTagePage.Click_GI_submit();
        expect(await giTagePage.isSuccessMessageDisplayed()).toBe(false);
    });

    test("TC_013_Verify_Submit_Without_Certificate_Date", async () => {
        await giTagePage.send_gi_certificate_no("152656");
        await giTagePage.select_Gi_Number();
        await giTagePage.Upload_certificate_img("C:/Users/DELL/Documents/chappls/GOVV.jpg");
        await giTagePage.sendDate_registration_valid_upto_date("25/06/2030");
        await giTagePage.Click_GI_submit();
        expect(await giTagePage.isSuccessMessageDisplayed()).toBe(false);
    });

    test("TC_0144_Verify_Submit_Without_Certificate_Upload", async () => {
        await giTagePage.send_gi_certificate_no("152656");
        await giTagePage.select_Gi_Number();
        await giTagePage.sendDateInMMDDYYYYFormat("06/15/2024");
        await giTagePage.sendDate_registration_valid_upto_date("25/06/2030");
        await giTagePage.Click_GI_submit();
        expect(await giTagePage.isSuccessMessageDisplayed()).toBe(false);
    });

    test("TC_015_Verify_GI_Certificate_No_With_Special_Characters", async () => {
        await giTagePage.send_gi_certificate_no("@#$%^&*!");
        await giTagePage.select_Gi_Number();
        await giTagePage.sendDateInMMDDYYYYFormat("06/15/2024");
        await giTagePage.Upload_certificate_img("C:/Users/DELL/Documents/chappls/GOVV.jpg");
        await giTagePage.sendDate_registration_valid_upto_date("25/06/2030");
        await giTagePage.Click_GI_submit();
        expect(await giTagePage.isSuccessMessageDisplayed()).toBe(false);
    });

    test("TC_016_Verify_GI_Certificate_No_With_Alphabets_Only", async () => {
        await giTagePage.send_gi_certificate_no("ABCDEF");
        await giTagePage.select_Gi_Number();
        await giTagePage.sendDateInMMDDYYYYFormat("06/15/2024");
        await giTagePage.Upload_certificate_img("C:/Users/DELL/Documents/chappls/GOVV.jpg");
        await giTagePage.sendDate_registration_valid_upto_date("25/06/2030");
        await giTagePage.Click_GI_submit();
        expect(await giTagePage.isSuccessMessageDisplayed()).toBe(false);
    });

    test("TC_017_Verify_GI_Certificate_No_With_Spaces_Only", async () => {
        await giTagePage.send_gi_certificate_no("      ");
        await giTagePage.select_Gi_Number();
        await giTagePage.sendDateInMMDDYYYYFormat("06/15/2024");
        await giTagePage.Upload_certificate_img("C:/Users/DELL/Documents/chappls/GOVV.jpg");
        await giTagePage.sendDate_registration_valid_upto_date("25/06/2030");
        await giTagePage.Click_GI_submit();
        expect(await giTagePage.isSuccessMessageDisplayed()).toBe(false);
    });

    test("TC_018_Verify_GI_Certificate_No_Single_Character", async () => {
        await giTagePage.send_gi_certificate_no("1");
        await giTagePage.select_Gi_Number();
        await giTagePage.sendDateInMMDDYYYYFormat("06/15/2024");
        await giTagePage.Upload_certificate_img("C:/Users/DELL/Documents/chappls/GOVV.jpg");
        await giTagePage.sendDate_registration_valid_upto_date("25/06/2030");
        await giTagePage.Click_GI_submit();

        const success = await giTagePage.isSuccessMessageDisplayed();
        const validation = await giTagePage.isValidationErrorDisplayed();
        expect(success || validation).toBe(true);
    });

    test("TC_019_Verify_GI_Certificate_No_Very_Long_Input", async () => {
        const longInput = "1234567890".repeat(20);
        await giTagePage.send_gi_certificate_no(longInput);
        await giTagePage.select_Gi_Number();
        await giTagePage.sendDateInMMDDYYYYFormat("06/15/2024");
        await giTagePage.Upload_certificate_img("C:/Users/DELL/Documents/chappls/GOVV.jpg");
        await giTagePage.sendDate_registration_valid_upto_date("25/06/2030");
        await giTagePage.Click_GI_submit();

        const success = await giTagePage.isSuccessMessageDisplayed();
        const validation = await giTagePage.isValidationErrorDisplayed();
        expect(success || validation).toBe(true);
    });

    test("TC_020_Verify_Past_Valid_Upto_Date", async () => {
        await giTagePage.send_gi_certificate_no("152656");
        await giTagePage.select_Gi_Number();
        await giTagePage.sendDateInMMDDYYYYFormat("06/15/2024");
        await giTagePage.Upload_certificate_img("C:/Users/DELL/Documents/chappls/GOVV.jpg");
        await giTagePage.sendDate_registration_valid_upto_date("01/01/2020");
        await giTagePage.Click_GI_submit();

        const success = await giTagePage.isSuccessMessageDisplayed();
        const validation = await giTagePage.isValidationErrorDisplayed();
        expect(success || validation).toBe(true);
    });

    test("TC_021_Verify_Submit_Without_Valid_Upto_Date", async () => {
        await giTagePage.send_gi_certificate_no("152656");
        await giTagePage.select_Gi_Number();
        await giTagePage.sendDateInMMDDYYYYFormat("06/15/2024");
        await giTagePage.Upload_certificate_img("C:/Users/DELL/Documents/chappls/GOVV.jpg");
        await giTagePage.Click_GI_submit();
        expect(await giTagePage.isSuccessMessageDisplayed()).toBe(false);
    });

    test("TC_022_Verify_GI_Certificate_No_Field_Accepts_And_Retains_Input", async () => {
        await giTagePage.send_gi_certificate_no("998877");
        const enteredValue = await giTagePage.getGiCertificateNoValue();
        expect(enteredValue).toBe("998877");
    });

    test("TC_023_Verify_GI_Certificate_No_Field_Clear_Works", async () => {
        await giTagePage.send_gi_certificate_no("123456");
        await giTagePage.clearGiCertificateNo();
        const clearedValue = await giTagePage.getGiCertificateNoValue();
        expect(clearedValue).toBe("");
    });

    test("TC_024_Verify_Certificate_Date_Accepts_And_Retains_Input", async () => {
        await giTagePage.sendDateInMMDDYYYYFormat("12/25/2025");
        const dateValue = await giTagePage.getCertificateDateValue();
        expect(dateValue !== "").toBe(true);
    });

    test("TC_025_Verify_GI_Number_Dropdown_Selection_Change", async () => {
        await giTagePage.select_Gi_Number();
        const selectedText = await giTagePage.getFirstSelectedGiNumberText();
        expect(selectedText).not.toBe("Select GI Number");
    });

    test("TC_026_Verify_GI_Form_Page_URL", async () => {
        const currentUrl = await giTagePage.getCurrentPageUrl();
        expect(currentUrl.includes("indiahandmade")).toBe(true);
    });

    test("TC_027_Verify_Form_Reset_On_Page_Refresh", async ({ page }) => {
        await giTagePage.send_gi_certificate_no("999999");
        await giTagePage.select_Gi_Number();
        await page.reload();
        await page.waitForTimeout(3000);

        const certValue = await giTagePage.getGiCertificateNoValue();
        const dropdownText = await giTagePage.getFirstSelectedGiNumberText();
        expect(certValue).toBe("");
        expect(dropdownText).toBe("Select GI Number");
    });

    test.afterEach(async ({ page }) => {
        // Logout from vendor panel
        try {
            await page.waitForTimeout(2000);
            await dashboard.Click_On_Seller_Panel();
            await page.waitForTimeout(2000);
            await dashboard.Click_On_Logout();
        } catch (e) {
            console.log("Seller Logout failed: " + e);
        }
    });
});
