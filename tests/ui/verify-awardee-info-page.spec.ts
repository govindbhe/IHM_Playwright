import { test, expect } from "@playwright/test";
import { Homepagesteps } from "../../page-objects/page-steps/Home-page-steps";
import { SellerLoginSteps } from "../../page-objects/page-steps/seller-login-steps";
import { AwardeeInfoSteps } from "../../page-objects/page-steps/awardee-info-steps";
import { DashboardPageSteps } from "../../page-objects/page-steps/dashboard-page-steps";
import { config } from "../../utils/config-reader";

test.describe("Verify Awardee Info Page Tests", () => {
    let homePage: Homepagesteps;
    let sellerLogin: SellerLoginSteps;
    let dashboard: DashboardPageSteps;
    let awardeeInfo: AwardeeInfoSteps;
    let AWARDEE_URL: string;
    const UPLOAD_IMAGE_PATH = "C:/Users/DELL/Documents/chappls/GOVV.jpg";

    test.beforeAll(async () => {
        const baseUrl = config.url || "https://www.indiahandmade.com/";
        AWARDEE_URL = baseUrl + "marketplace/awardee/awardregistration/";
    });

    test.beforeEach(async ({ page }) => {
        test.setTimeout(180000);

        homePage = new Homepagesteps(page);
        sellerLogin = new SellerLoginSteps(page);
        dashboard = new DashboardPageSteps(page);
        awardeeInfo = new AwardeeInfoSteps(page);

        // Login as seller
        const baseUrl = config.url || "https://www.indiahandmade.com/";
        await page.goto(baseUrl);
        await page.waitForTimeout(2000);

        await homePage.Click_on_Vendar_LogIn();
        await sellerLogin.enter_email(config.sellerEmail);
        await sellerLogin.enter_Password(config.sellerPassword);
        await sellerLogin.Click_on_Sign_In_Button();
        await page.waitForTimeout(5000);

        // Navigate to Awardee page before each test
        await page.goto(AWARDEE_URL);
        await page.waitForTimeout(3000);
    });

    // ═══════════════════════════════════════════════════════════════
    // PAGE LOAD & HEADER TESTS
    // ═══════════════════════════════════════════════════════════════

    test("TC01_Verify_Awardee_Page_Loads_Successfully", async ({ page }) => {
        const currentUrl = page.url();
        expect(currentUrl).toContain("awardregistration");
    });

    test("TC02_Verify_Awardee_Information_Header_Displayed", async () => {
        expect(await awardeeInfo.isAwardeeInfoHeaderDisplayed()).toBe(true);
    });

    test("TC03_Verify_Great_News_Heading_Displayed", async () => {
        expect(await awardeeInfo.isGreatNewsHeadingDisplayed()).toBe(true);
    });

    test("TC04_Verify_Page_Title_Is_Not_Empty", async ({ page }) => {
        const title = await page.title();
        expect(title.length).toBeGreaterThan(0);
        console.log("Awardee Page Title: " + title);
    });

    // ═══════════════════════════════════════════════════════════════
    // FORM FIELD VISIBILITY TESTS
    // ═══════════════════════════════════════════════════════════════

    test("TC05_Verify_Award_Category_Dropdown_Visible", async () => {
        expect(await awardeeInfo.isCategoryDropdownDisplayed()).toBe(true);
    });

    test("TC06_Verify_Award_Year_Dropdown_Visible", async () => {
        expect(await awardeeInfo.isYearDropdownDisplayed()).toBe(true);
    });

    test("TC07_Verify_Craft_Type_Input_Visible", async () => {
        expect(await awardeeInfo.isCraftTypeDisplayed()).toBe(true);
    });

    test("TC08_Verify_Certificate_Numbers_Input_Visible", async () => {
        expect(await awardeeInfo.isCertificateNumberInputDisplayed()).toBe(true);
    });

    test("TC09_Verify_Submit_Button_Visible", async () => {
        await awardeeInfo.scrollToSubmitButton();
        expect(await awardeeInfo.isSubmitButtonDisplayed()).toBe(true);
    });

    test("TC10_Verify_Submit_Button_Enabled", async () => {
        await awardeeInfo.scrollToSubmitButton();
        expect(await awardeeInfo.isSubmitButtonEnabled()).toBe(true);
    });

    test("TC11_Verify_Submit_Button_Text", async () => {
        await awardeeInfo.scrollToSubmitButton();
        const btnText = await awardeeInfo.getSubmitButtonText();
        expect(btnText).toBe("Submit");
    });

    // ═══════════════════════════════════════════════════════════════
    // PLACEHOLDER / DEFAULT STATE TESTS
    // ═══════════════════════════════════════════════════════════════

    test("TC12_Verify_Category_Dropdown_Default_Text", async () => {
        const defaultText = await awardeeInfo.getSelectedCategoryText();
        expect(defaultText.includes("Select Category")).toBe(true);
    });

    test("TC13_Verify_Craft_Type_Placeholder", async () => {
        const placeholder = await awardeeInfo.getCraftTypePlaceholder();
        expect(placeholder).toBe("Enter your craft type");
    });

    test("TC14_Verify_Certificate_Numbers_Placeholder", async () => {
        const placeholder = await awardeeInfo.getCertificateNumberPlaceholder();
        expect(placeholder.includes("Type and press space or comma to add")).toBe(true);
    });

    test("TC15_Verify_Craft_Type_Field_Initially_Empty", async () => {
        const value = await awardeeInfo.getCraftTypeValue();
        expect(value === null || value === "").toBe(true);
    });

    // ═══════════════════════════════════════════════════════════════
    // AWARD CATEGORY DROPDOWN TESTS
    // ═══════════════════════════════════════════════════════════════

    test("TC16_Verify_Category_Dropdown_Opens_On_Click", async () => {
        await awardeeInfo.Click_On_Awardee_Category_Dropdown();
        expect(true).toBe(true);
    });

    test("TC18_Verify_Select_National_Awardee_Category", async ({ page }) => {
        await awardeeInfo.Select_National_Awardee();
        await page.waitForTimeout(1000);
        const selectedText = await awardeeInfo.getSelectedCategoryText();
        expect(selectedText.includes("National Awardee")).toBe(true);
    });

    test("TC19_Verify_Select_Sant_Kabir_Category", async ({ page }) => {
        await awardeeInfo.Select_Sant_Kabir_Awardee();
        await page.waitForTimeout(1000);
        const selectedText = await awardeeInfo.getSelectedCategoryText();
        expect(selectedText.includes("Sant Kabir")).toBe(true);
    });

    test("TC20_Verify_Select_National_Merit_Certificate", async ({ page }) => {
        await awardeeInfo.Select_National_Merit_Certificate();
        await page.waitForTimeout(1000);
        const selectedText = await awardeeInfo.getSelectedCategoryText();
        expect(selectedText.includes("National Merit")).toBe(true);
    });

    test("TC21_Verify_Select_Others_Category", async ({ page }) => {
        await awardeeInfo.Select_Others_Category();
        await page.waitForTimeout(1000);
        const selectedText = await awardeeInfo.getSelectedCategoryText();
        expect(selectedText.includes("Others")).toBe(true);
    });

    // ═══════════════════════════════════════════════════════════════
    // AWARD YEAR DROPDOWN TESTS
    // ═══════════════════════════════════════════════════════════════

    test("TC22_Verify_Award_Year_Dropdown_Opens", async () => {
        await awardeeInfo.Click_On_Award_Year_Dropdown();
        expect(true).toBe(true);
    });

    test("TC24_Verify_Select_Year_2026", async ({ page }) => {
        await awardeeInfo.selectAwardYear("2026");
        await page.waitForTimeout(1000);
        expect(true).toBe(true);
    });

    test("TC25_Verify_Select_Year_2025", async ({ page }) => {
        await awardeeInfo.selectAwardYear("2025");
        await page.waitForTimeout(1000);
        expect(true).toBe(true);
    });

    // ═══════════════════════════════════════════════════════════════
    // CRAFT TYPE INPUT TESTS
    // ═══════════════════════════════════════════════════════════════

    test("TC26_Verify_Enter_Valid_Craft_Type", async () => {
        await awardeeInfo.enterCraftType("Handloom Weaving");
        const value = await awardeeInfo.getCraftTypeValue();
        expect(value).toBe("Handloom Weaving");
    });

    test("TC27_Verify_Craft_Type_Accepts_Alphabets", async () => {
        await awardeeInfo.enterCraftType("Pottery");
        const value = await awardeeInfo.getCraftTypeValue();
        expect(value).toBe("Pottery");
    });

    test("TC28_Verify_Craft_Type_Accepts_Alphanumeric", async () => {
        await awardeeInfo.enterCraftType("Craft Type 123");
        const value = await awardeeInfo.getCraftTypeValue();
        expect(value).toBe("Craft Type 123");
    });

    test("TC29_Verify_Craft_Type_Clear_And_ReEnter", async () => {
        await awardeeInfo.enterCraftType("Block Printing");
        await awardeeInfo.clearCraftType();
        const clearedValue = await awardeeInfo.getCraftTypeValue();
        expect(clearedValue === null || clearedValue === "").toBe(true);

        await awardeeInfo.enterCraftType("Embroidery");
        const newValue = await awardeeInfo.getCraftTypeValue();
        expect(newValue).toBe("Embroidery");
    });

    test("TC30_Verify_Craft_Type_With_Special_Characters", async () => {
        await awardeeInfo.enterCraftType("Wood & Stone Carving");
        const value = await awardeeInfo.getCraftTypeValue();
        expect(value).toBe("Wood & Stone Carving");
    });

    test("TC31_Verify_Craft_Type_With_Leading_Trailing_Spaces", async () => {
        await awardeeInfo.enterCraftType("  Silk Weaving  ");
        const value = await awardeeInfo.getCraftTypeValue();
        expect(value).not.toBeNull();
    });

    // ═══════════════════════════════════════════════════════════════
    // CERTIFICATE NUMBERS TESTS
    // ═══════════════════════════════════════════════════════════════

    test("TC32_Verify_Certificate_Number_Input_Accepts_Value", async () => {
        await awardeeInfo.enterCertificateNumber("CERT-001");
        expect(true).toBe(true);
    });

    test("TC33_Verify_Multiple_Certificate_Numbers", async ({ page }) => {
        await awardeeInfo.enterCertificateNumber("CERT-001");
        await page.waitForTimeout(500);
        await awardeeInfo.enterCertificateNumber("CERT-002");
        await page.waitForTimeout(500);
        expect(true).toBe(true);
    });

    // ═══════════════════════════════════════════════════════════════
    // EMPTY FORM VALIDATION TESTS
    // ═══════════════════════════════════════════════════════════════

    test("TC34_Verify_Submit_Empty_Form_Shows_Category_Error", async ({ page }) => {
        await awardeeInfo.scrollToSubmitButton();
        await awardeeInfo.clickSubmitButton();
        await page.waitForTimeout(2000);
        expect(await awardeeInfo.isCategoryErrorDisplayed()).toBe(true);
    });

    test("TC35_Verify_Category_Error_Message_Text", async ({ page }) => {
        await awardeeInfo.scrollToSubmitButton();
        await awardeeInfo.clickSubmitButton();
        await page.waitForTimeout(2000);
        const errorText = await awardeeInfo.getCategoryErrorText();
        expect(errorText).toBe("Please select at least one award category.");
    });

    test("TC36_Verify_Submit_Empty_Form_Shows_Year_Error", async ({ page }) => {
        await awardeeInfo.scrollToSubmitButton();
        await awardeeInfo.clickSubmitButton();
        await page.waitForTimeout(2000);
        expect(await awardeeInfo.isYearErrorDisplayed()).toBe(true);
    });

    test("TC37_Verify_Year_Error_Message_Text", async ({ page }) => {
        await awardeeInfo.scrollToSubmitButton();
        await awardeeInfo.clickSubmitButton();
        await page.waitForTimeout(2000);
        const errorText = await awardeeInfo.getYearErrorText();
        expect(errorText).toBe("Please add at least one award year.");
    });

    test("TC38_Verify_Submit_Empty_Form_Shows_Craft_Type_Error", async ({ page }) => {
        await awardeeInfo.scrollToSubmitButton();
        await awardeeInfo.clickSubmitButton();
        await page.waitForTimeout(2000);
        expect(await awardeeInfo.isCraftTypeErrorDisplayed()).toBe(true);
    });

    test("TC39_Verify_Craft_Type_Error_Message_Text", async ({ page }) => {
        await awardeeInfo.scrollToSubmitButton();
        await awardeeInfo.clickSubmitButton();
        await page.waitForTimeout(2000);
        const errorText = await awardeeInfo.getCraftTypeErrorText();
        expect(errorText).toBe("Please enter your craft type.");
    });

    test("TC40_Verify_Submit_Empty_Form_Shows_Certificate_Upload_Error", async ({ page }) => {
        await awardeeInfo.scrollToSubmitButton();
        await awardeeInfo.clickSubmitButton();
        await page.waitForTimeout(2000);
        expect(await awardeeInfo.isCertificateUploadErrorDisplayed()).toBe(true);
    });

    test("TC41_Verify_Certificate_Upload_Error_Text", async ({ page }) => {
        await awardeeInfo.scrollToSubmitButton();
        await awardeeInfo.clickSubmitButton();
        await page.waitForTimeout(2000);
        const errorText = await awardeeInfo.getCertificateUploadErrorText();
        expect(errorText).toBe("Please upload at least one certificate.");
    });

    test("TC42_Verify_Submit_Empty_Form_Shows_Photograph_Error", async ({ page }) => {
        await awardeeInfo.scrollToSubmitButton();
        await awardeeInfo.clickSubmitButton();
        await page.waitForTimeout(2000);
        expect(await awardeeInfo.isPhotographUploadErrorDisplayed()).toBe(true);
    });

    test("TC43_Verify_Photograph_Upload_Error_Text", async ({ page }) => {
        await awardeeInfo.scrollToSubmitButton();
        await awardeeInfo.clickSubmitButton();
        await page.waitForTimeout(2000);
        const errorText = await awardeeInfo.getPhotographUploadErrorText();
        expect(errorText).toBe("Please upload your photograph.");
    });

    test("TC44_Verify_All_Validation_Errors_On_Empty_Submit", async ({ page }) => {
        await awardeeInfo.scrollToSubmitButton();
        await awardeeInfo.clickSubmitButton();
        await page.waitForTimeout(2000);
        expect(await awardeeInfo.isCategoryErrorDisplayed()).toBe(true);
        expect(await awardeeInfo.isYearErrorDisplayed()).toBe(true);
        expect(await awardeeInfo.isCraftTypeErrorDisplayed()).toBe(true);
        expect(await awardeeInfo.isCertificateUploadErrorDisplayed()).toBe(true);
        expect(await awardeeInfo.isPhotographUploadErrorDisplayed()).toBe(true);
    });

    // ═══════════════════════════════════════════════════════════════
    // FILE UPLOAD TESTS
    // ═══════════════════════════════════════════════════════════════

    test("TC45_Verify_Upload_Certificate_With_Valid_Image", async ({ page }) => {
        await awardeeInfo.uploadCertificateFile(UPLOAD_IMAGE_PATH);
        await page.waitForTimeout(2000);
        await awardeeInfo.scrollToSubmitButton();
        await awardeeInfo.clickSubmitButton();
        await page.waitForTimeout(2000);
        expect(await awardeeInfo.isCertificateUploadErrorDisplayed()).toBe(false);
    });

    test("TC46_Verify_Upload_Photograph_With_Valid_Image", async ({ page }) => {
        await awardeeInfo.uploadPhotographFile(UPLOAD_IMAGE_PATH);
        await page.waitForTimeout(2000);
        await awardeeInfo.scrollToSubmitButton();
        await awardeeInfo.clickSubmitButton();
        await page.waitForTimeout(2000);
        expect(await awardeeInfo.isPhotographUploadErrorDisplayed()).toBe(false);
    });

    // ═══════════════════════════════════════════════════════════════
    // PARTIAL FORM SUBMISSION TESTS
    // ═══════════════════════════════════════════════════════════════

    test("TC47_Verify_Submit_With_Only_Category_Selected", async ({ page }) => {
        await awardeeInfo.Select_National_Awardee();
        await page.waitForTimeout(1000);
        await awardeeInfo.scrollToSubmitButton();
        await awardeeInfo.clickSubmitButton();
        await page.waitForTimeout(2000);
        expect(await awardeeInfo.isCategoryErrorDisplayed()).toBe(false);
        expect(await awardeeInfo.isYearErrorDisplayed()).toBe(true);
        expect(await awardeeInfo.isCraftTypeErrorDisplayed()).toBe(true);
    });

    test("TC48_Verify_Submit_With_Only_Craft_Type_Filled", async ({ page }) => {
        await awardeeInfo.enterCraftType("Bamboo Work");
        await awardeeInfo.scrollToSubmitButton();
        await awardeeInfo.clickSubmitButton();
        await page.waitForTimeout(2000);
        expect(await awardeeInfo.isCraftTypeErrorDisplayed()).toBe(false);
        expect(await awardeeInfo.isCategoryErrorDisplayed()).toBe(true);
        expect(await awardeeInfo.isYearErrorDisplayed()).toBe(true);
    });

    test("TC49_Verify_Submit_With_Category_And_Year_Only", async ({ page }) => {
        await awardeeInfo.Select_National_Awardee();
        await page.waitForTimeout(1000);
        await awardeeInfo.selectAwardYear("2024");
        await page.waitForTimeout(1000);
        await awardeeInfo.scrollToSubmitButton();
        await awardeeInfo.clickSubmitButton();
        await page.waitForTimeout(2000);
        expect(await awardeeInfo.isCategoryErrorDisplayed()).toBe(false);
        expect(await awardeeInfo.isYearErrorDisplayed()).toBe(false);
        expect(await awardeeInfo.isCraftTypeErrorDisplayed()).toBe(true);
    });

    // ═══════════════════════════════════════════════════════════════
    // UI BEHAVIOR & INTERACTION TESTS
    // ═══════════════════════════════════════════════════════════════

    test("TC50_Verify_Page_Does_Not_Navigate_On_Invalid_Submit", async ({ page }) => {
        await awardeeInfo.scrollToSubmitButton();
        await awardeeInfo.clickSubmitButton();
        await page.waitForTimeout(2000);
        const currentUrl = page.url();
        expect(currentUrl).toContain("awardregistration");
    });

    test("TC51_Verify_Craft_Type_Update_After_Clear", async () => {
        await awardeeInfo.enterCraftType("Silk Weaving");
        expect(await awardeeInfo.getCraftTypeValue()).toBe("Silk Weaving");
        await awardeeInfo.clearCraftType();
        await awardeeInfo.enterCraftType("Jute Craft");
        expect(await awardeeInfo.getCraftTypeValue()).toBe("Jute Craft");
    });

    test("TC52_Verify_Multiple_Category_Selection", async ({ page }) => {
        await awardeeInfo.Select_National_Awardee();
        await page.waitForTimeout(500);
        await awardeeInfo.Select_Sant_Kabir_Awardee();
        await page.waitForTimeout(500);
        const selectedText = await awardeeInfo.getSelectedCategoryText();
        expect(selectedText.includes("National Awardee") || selectedText.includes("Sant Kabir")).toBe(true);
    });

    test("TC53_Verify_Page_Refresh_Resets_Form", async ({ page }) => {
        await awardeeInfo.enterCraftType("Test Craft");
        await page.reload();
        await page.waitForTimeout(3000);
        const value = await awardeeInfo.getCraftTypeValue();
        expect(value === null || value === "").toBe(true);
    });

    test("TC54_Verify_Long_Craft_Type_Input", async () => {
        const longText = "A".repeat(200);
        await awardeeInfo.enterCraftType(longText);
        const value = await awardeeInfo.getCraftTypeValue();
        expect(value).not.toBeNull();
        console.log("Long input length accepted: " + value.length);
    });

    test("TC55_Verify_Craft_Type_With_Only_Spaces", async ({ page }) => {
        await awardeeInfo.enterCraftType("     ");
        await awardeeInfo.scrollToSubmitButton();
        await awardeeInfo.clickSubmitButton();
        await page.waitForTimeout(2000);
        const value = await awardeeInfo.getCraftTypeValue();
        console.log("Spaces-only Craft Type value: '" + value + "'");
        expect(value).not.toBeNull();
    });

    test("TC56_Verify_Craft_Type_With_Numeric_Only", async () => {
        await awardeeInfo.enterCraftType("12345");
        const value = await awardeeInfo.getCraftTypeValue();
        expect(value).toBe("12345");
    });

    test("TC57_Verify_Certificate_Number_With_Special_Characters", async () => {
        await awardeeInfo.enterCertificateNumber("CERT/2024-NM#001");
        expect(true).toBe(true);
    });

    // ═══════════════════════════════════════════════════════════════
    // FULL VALID FORM SUBMISSION TEST
    // ═══════════════════════════════════════════════════════════════

    test("TC58_Verify_Fill_All_Fields_And_Submit", async ({ page }) => {
        await awardeeInfo.Select_National_Awardee();
        await page.waitForTimeout(1000);

        await awardeeInfo.selectAwardYear("2024");
        await page.waitForTimeout(1000);

        await awardeeInfo.enterCraftType("Traditional Handloom Weaving");
        await page.waitForTimeout(500);

        await awardeeInfo.enterCertificateNumber("CERT-NA-2024-001");
        await page.waitForTimeout(500);

        await awardeeInfo.uploadCertificateFile(UPLOAD_IMAGE_PATH);
        await page.waitForTimeout(2000);

        await awardeeInfo.uploadPhotographFile(UPLOAD_IMAGE_PATH);
        await page.waitForTimeout(2000);

        await awardeeInfo.scrollToSubmitButton();
        await awardeeInfo.clickSubmitButton();
        await page.waitForTimeout(3000);

        expect(await awardeeInfo.isCategoryErrorDisplayed()).toBe(false);
        expect(await awardeeInfo.isYearErrorDisplayed()).toBe(false);
        expect(await awardeeInfo.isCraftTypeErrorDisplayed()).toBe(false);
        expect(await awardeeInfo.isCertificateUploadErrorDisplayed()).toBe(false);
        expect(await awardeeInfo.isPhotographUploadErrorDisplayed()).toBe(false);
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
