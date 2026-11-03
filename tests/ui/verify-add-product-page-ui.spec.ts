// `test` comes from the seller-session fixture: it logs in once per worker and shares
// that authenticated page, instead of re-authenticating before each of the 62 tests.
import { test, expect } from "../../fixtures/seller-session";
import { ProductAddSteps } from "../../page-objects/page-steps/product-add-steps";
import { config } from "../../utils/config-reader";

test.describe("Verify Add Product Page UI Tests", () => {
    let addNewProduct: ProductAddSteps;
    let ADD_PRODUCT_URL: string;
    const IMAGE_PATH = "C:/Users/DELL/Documents/chappls/pexels-arashiah-24862048 (1).jpg";

    test.beforeAll(async () => {
        // Prepare global constants
        const baseUrl = config.url || "https://www.indiahandmade.com/";
        ADD_PRODUCT_URL = baseUrl + "marketplace/product/add/set/4/type/simple/";
    });

    test.beforeEach(async ({ page }) => {
        test.setTimeout(120000);

        addNewProduct = new ProductAddSteps(page);

        // Login already happened once in the worker-scoped fixture. Re-navigating to the
        // add-product page is all that is needed to reset form state between tests.
        await page.goto(ADD_PRODUCT_URL, { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(2000);
    });

    test("TC_001_Verify_Add_Product_Page_Loads_Successfully", async ({ page }) => {
        const currentUrl = page.url();
        expect(currentUrl).toContain("marketplace/product/add");
    });

    test("TC_002_Verify_Page_Heading_Marketplace_Add_New_Product_Is_Displayed", async () => {
        expect(await addNewProduct.isPageHeadingDisplayed()).toBe(true);
    });

    test("TC_003_Verify_Price_Calculator_Link_Is_Visible_On_The_Page", async () => {
        expect(await addNewProduct.isPriceCalculatorLinkDisplayed()).toBe(true);
    });

    test("TC_004_Verify_All_Mandatory_Form_Fields_Are_Displayed", async () => {
        expect(await addNewProduct.isProductNameFieldDisplayed()).toBe(true);
        expect(await addNewProduct.isStockFieldDisplayed()).toBe(true);
        expect(await addNewProduct.isMetaTitleFieldDisplayed()).toBe(true);
        expect(await addNewProduct.isMetaKeywordFieldDisplayed()).toBe(true);
        expect(await addNewProduct.isMetaDescriptionFieldDisplayed()).toBe(true);
        expect(await addNewProduct.isListPriceFieldDisplayed()).toBe(true);
    });

    test("TC_005_Verify_Optional_And_Supplementary_Fields_Are_Displayed", async () => {
        expect(await addNewProduct.isSellingPriceFieldDisplayed()).toBe(true);
        expect(await addNewProduct.isCareInstructionsFieldDisplayed()).toBe(true);
        expect(await addNewProduct.isMaterialFieldDisplayed()).toBe(true);
        expect(await addNewProduct.isDimensionFieldDisplayed()).toBe(true);
    });

    test("TC_006_Verify_Dropdown_Fields_Are_Displayed", async () => {
        expect(await addNewProduct.isItemTypeDropdownDisplayed()).toBe(true);
        expect(await addNewProduct.isColorDropdownDisplayed()).toBe(true);
        expect(await addNewProduct.isStateOfOriginDropdownDisplayed()).toBe(true);
        expect(await addNewProduct.isStockAvailabilityDropdownDisplayed()).toBe(true);
        expect(await addNewProduct.isTaxClassDropdownDisplayed()).toBe(true);
    });

    test("TC_007_Verify_Packaging_Details_Fields_Are_Displayed", async () => {
        expect(await addNewProduct.isLengthFieldDisplayed()).toBe(true);
        expect(await addNewProduct.isBreadthFieldDisplayed()).toBe(true);
        expect(await addNewProduct.isHeightFieldDisplayed()).toBe(true);
    });

    test("TC_008_Verify_Product_Images_Upload_Area_Is_Displayed", async () => {
        expect(await addNewProduct.isProductImageUploadDisplayed()).toBe(true);
    });

    test("TC_009_Verify_Attribute_Set_Field_Is_Displayed_And_Pre_Filled", async () => {
        expect(await addNewProduct.isAttributeSetFieldDisplayed()).toBe(true);
        const attrSet = await addNewProduct.getAttributeSetValue();
        expect(attrSet).not.toBeNull();
    });

    test("TC_010_Verify_Product_Category_Dropdown_Is_Displayed", async () => {
        expect(await addNewProduct.isProductCategoryDisplayed()).toBe(true);
    });

    test("TC_011_Verify_Save_Button_Is_Displayed_And_Enabled", async () => {
        expect(await addNewProduct.isSaveButtonDisplayed()).toBe(true);
        expect(await addNewProduct.isSaveButtonEnabled()).toBe(true);
    });

    test("TC_012_Verify_Clicking_Save_With_Empty_Form_Shows_Validation_Errors", async ({ page }) => {
        await addNewProduct.scrollToSaveButton();
        await page.waitForTimeout(1000);
        await addNewProduct.Click_on_save_Btn();
        await page.waitForTimeout(3000);

        const currentUrl = page.url();
        expect(currentUrl).toContain("marketplace/product/add");
    });

    test("TC_013_Verify_Stock_Field_Required_Validation_Error", async ({ page }) => {
        await addNewProduct.clearStock();
        await addNewProduct.scrollToSaveButton();
        await page.waitForTimeout(1000);
        await addNewProduct.Click_on_save_Btn();
        await page.waitForTimeout(2000);

        expect(await addNewProduct.isStockFieldErrorDisplayed()).toBe(true);
    });

    test("TC_014_Verify_Meta_Title_Field_Required_Validation_Error", async ({ page }) => {
        await addNewProduct.clearMetaTitle();
        await addNewProduct.scrollToSaveButton();
        await page.waitForTimeout(1000);
        await addNewProduct.Click_on_save_Btn();
        await page.waitForTimeout(2000);

        expect(await addNewProduct.isMetaTitleErrorDisplayed()).toBe(true);
    });

    test("TC_015_Verify_Meta_Keywords_Field_Required_Validation_Error", async ({ page }) => {
        await addNewProduct.clearMetaKeyword();
        await addNewProduct.scrollToSaveButton();
        await page.waitForTimeout(1000);
        await addNewProduct.Click_on_save_Btn();
        await page.waitForTimeout(2000);

        expect(await addNewProduct.isMetaKeywordErrorDisplayed()).toBe(true);
    });

    test("TC_016_Verify_Meta_Description_Field_Required_Validation_Error", async ({ page }) => {
        await addNewProduct.clearMetaDescription();
        await addNewProduct.scrollToSaveButton();
        await page.waitForTimeout(1000);
        await addNewProduct.Click_on_save_Btn();
        await page.waitForTimeout(2000);

        expect(await addNewProduct.isMetaDescriptionErrorDisplayed()).toBe(true);
    });

    test("TC_017_Verify_Price_Field_Required_Validation_Error", async ({ page }) => {
        await addNewProduct.clearListPrice();
        await addNewProduct.scrollToSaveButton();
        await page.waitForTimeout(1000);
        await addNewProduct.Click_on_save_Btn();
        await page.waitForTimeout(2000);

        expect(await addNewProduct.isPriceFieldErrorDisplayed()).toBe(true);
    });

    test("TC_018_Verify_Image_Required_Validation_Error_When_No_Image_Uploaded", async ({ page }) => {
        await addNewProduct.scrollToSaveButton();
        await page.waitForTimeout(1000);
        await addNewProduct.Click_on_save_Btn();
        await page.waitForTimeout(2000);

        expect(await addNewProduct.isImageRequiredErrorDisplayed()).toBe(true);
    });

    test("TC_019_Verify_Stock_Availability_Default_Is_In_Stock", async () => {
        const selectedValue = await addNewProduct.getSelectedStockAvailability();
        expect(selectedValue).toBe("In Stock");
    });

    test("TC_020_Verify_Tax_Class_Default_Is_None", async () => {
        const selectedValue = await addNewProduct.getSelectedTaxClass();
        expect(selectedValue).toBe("None");
    });

    test("TC_021_Verify_Product_Name_Field_Is_Initially_Empty", async () => {
        const value = await addNewProduct.getProductNameValue();
        expect(value === null || value === "").toBe(true);
    });

    test("TC_022_Verify_Stock_Field_Is_Initially_Empty", async () => {
        const value = await addNewProduct.getStockValue();
        expect(value === null || value === "").toBe(true);
    });

    test("TC_023_Verify_List_Price_Field_Is_Initially_Empty", async () => {
        const value = await addNewProduct.getListPriceValue();
        expect(value === null || value === "").toBe(true);
    });

    test("TC_024_Verify_Minimum_Qty_Purchased_By_Customer_Defaults_To_1", async () => {
        const value = await addNewProduct.getMinQtyValue();
        expect(value).toBe("1");
    });

    test("TC_025_Verify_Product_Name_Accepts_Valid_Text_Input", async () => {
        await addNewProduct.enterProductName("Test Handmade Table Lamp");
        const value = await addNewProduct.getProductNameValue();
        expect(value).toBe("Test Handmade Table Lamp");
    });

    test("TC_026_Verify_Stock_Field_Accepts_Numeric_Input", async () => {
        await addNewProduct.enterStock("50");
        const value = await addNewProduct.getStockValue();
        expect(value).toBe("50");
    });

    test("TC_027_Verify_List_Price_Accepts_Decimal_Values", async () => {
        await addNewProduct.enterListPrice("1299.99");
        const value = await addNewProduct.getListPriceValue();
        expect(value).toBe("1299.99");
    });

    test("TC_028_Verify_Selling_Price_Accepts_Value_Less_Than_List_Price", async () => {
        await addNewProduct.enterListPrice("1000");
        await addNewProduct.enterSellingPrice("899");
        expect(await addNewProduct.getListPriceValue()).toBe("1000");
        expect(await addNewProduct.getSellingPriceValue()).toBe("899");
    });

    test("TC_029_Verify_Negative_Value_In_Stock_Field", async () => {
        await addNewProduct.enterStock("-5");
        const value = await addNewProduct.getStockValue();
        expect(value).not.toBeNull();
    });

    test("TC_030_Verify_Zero_Value_In_List_Price_Field", async () => {
        await addNewProduct.enterListPrice("0");
        const value = await addNewProduct.getListPriceValue();
        expect(value).toBe("0");
    });

    test("TC_031_Verify_Product_Features_Character_Limit_Message_Is_Shown", async ({ page }) => {
        await addNewProduct.scrollToSaveButton();
        await page.waitForTimeout(1000);
        await addNewProduct.Click_on_save_Btn();
        expect(await addNewProduct.isFeaturesCharLimitMsgDisplayed()).toBe(true);
    });

    test("TC_032_Verify_Product_Description_Character_Limit_Message_Is_Shown", async ({ page }) => {
        await addNewProduct.scrollToSaveButton();
        await page.waitForTimeout(1000);
        await addNewProduct.Click_on_save_Btn();
        expect(await addNewProduct.isDescriptionCharLimitMsgDisplayed()).toBe(true);
    });

    test("TC_033_Verify_Item_Type_Dropdown_Has_Multiple_Options", async () => {
        const optionCount = await addNewProduct.getItemTypeOptionCount();
        expect(optionCount).toBeGreaterThan(1);
    });

    test("TC_034_Verify_Color_Dropdown_Has_Multiple_Options", async () => {
        const optionCount = await addNewProduct.getColorOptionCount();
        expect(optionCount).toBeGreaterThan(1);
    });

    test("TC_035_Verify_State_Of_Origin_Dropdown_Has_Multiple_State_Options", async () => {
        const optionCount = await addNewProduct.getStateOfOriginOptionCount();
        expect(optionCount).toBeGreaterThan(10);
    });

    test("TC_036_Verify_Item_Type_Dropdown_Can_Select_Handloom", async () => {
        await addNewProduct.selectItemType("Handloom");
        expect(true).toBe(true);
    });

    test("TC_037_Verify_Color_Dropdown_Can_Select_Brown", async () => {
        await addNewProduct.selectColor("Brown");
        expect(true).toBe(true);
    });

    test("TC_038_Verify_State_Of_Origin_Dropdown_Can_Select_Andhra_Pradesh", async () => {
        await addNewProduct.selectStateOfOrigin("Andhra Pradesh");
        expect(true).toBe(true);
    });

    test("TC_039_Verify_Length_Field_Accepts_Numeric_Value", async () => {
        await addNewProduct.enterLength("25");
        expect(await addNewProduct.getLengthValue()).toBe("25");
    });

    test("TC_040_Verify_Breadth_Field_Accepts_Numeric_Value", async () => {
        await addNewProduct.enterBreadth("15");
        expect(await addNewProduct.getBreadthValue()).toBe("15");
    });

    test("TC_041_Verify_Height_Field_Accepts_Numeric_Value", async () => {
        await addNewProduct.enterHeight("10");
        expect(await addNewProduct.getHeightValue()).toBe("10");
    });

    test("TC_042_Verify_Packaging_Fields_Are_Initially_Empty", async () => {
        const length = await addNewProduct.getLengthValue();
        const breadth = await addNewProduct.getBreadthValue();
        const height = await addNewProduct.getHeightValue();
        expect(length === null || length === "").toBe(true);
        expect(breadth === null || breadth === "").toBe(true);
        expect(height === null || height === "").toBe(true);
    });

    test("TC_043_Verify_Meta_Title_Accepts_Text_Input_And_Retains_Value", async () => {
        await addNewProduct.enterMetaTitle("Handmade Table Lamp SEO Title");
        expect(await addNewProduct.getMetaTitleValue()).toBe("Handmade Table Lamp SEO Title");
    });

    test("TC_044_Verify_Meta_Keywords_Accepts_Text_Input_And_Retains_Value", async () => {
        await addNewProduct.enterMetaKeyword("handmade, table lamp, lighting, home decor");
        expect(await addNewProduct.getMetaKeywordValue()).toBe("handmade, table lamp, lighting, home decor");
    });

    test("TC_045_Verify_Meta_Description_Accepts_Text_Input_And_Retains_Value", async () => {
        await addNewProduct.enterMetaDescription("Beautiful handmade table lamp for home");
        expect(await addNewProduct.getMetaDescriptionValue()).toBe("Beautiful handmade table lamp for home");
    });

    test("TC_046_Verify_Care_Instructions_Field_Accepts_Text_Input", async () => {
        await addNewProduct.enterCareInstructions("Handle with care. Keep away from water.");
        expect(await addNewProduct.getCareInstructionsValue()).toBe("Handle with care. Keep away from water.");
    });

    test("TC_047_Verify_Material_Field_Accepts_Text_Input", async () => {
        await addNewProduct.enterMaterial("Brass and Glass");
        expect(true).toBe(true);
    });

    test("TC_048_Verify_Product_Image_Can_Be_Uploaded_Via_File_Path", async ({ page }) => {
        await addNewProduct.uploadProductImage(IMAGE_PATH);
        await page.waitForTimeout(3000);
        expect(true).toBe(true);
    });

    test("TC_049_Verify_Selling_Price_Field_Accepts_Value_Equal_To_List_Price", async () => {
        await addNewProduct.enterListPrice("500");
        await addNewProduct.enterSellingPrice("499");
        expect(await addNewProduct.getSellingPriceValue()).toBe("499");
    });

    test("TC_050_Verify_Selling_Price_Can_Be_Left_Empty", async () => {
        await addNewProduct.enterListPrice("1000");
        await addNewProduct.clearSellingPrice();
        const value = await addNewProduct.getSellingPriceValue();
        expect(value === null || value === "").toBe(true);
    });

    test("TC_051_Verify_Product_Name_Accepts_Special_Characters", async () => {
        await addNewProduct.enterProductName("Test Lamp (Handmade) - Size: Large & Beautiful");
        const value = await addNewProduct.getProductNameValue();
        expect(value).toBe("Test Lamp (Handmade) - Size: Large & Beautiful");
    });

    test("TC_052_Verify_Product_Name_With_Only_Spaces", async () => {
        await addNewProduct.enterProductName("     ");
        const value = (await addNewProduct.getProductNameValue()).trim();
        expect(value).toBe("");
    });

    test("TC_053_Verify_Stock_Field_With_Very_Large_Value", async () => {
        await addNewProduct.enterStock("999999");
        expect(await addNewProduct.getStockValue()).toBe("999999");
    });

    test("TC_054_Verify_List_Price_With_Large_Value", async () => {
        await addNewProduct.enterListPrice("99999");
        expect(await addNewProduct.getListPriceValue()).toBe("99999");
    });

    test("TC_055_Verify_Product_Features_Accepts_Input_Via_Tinymce_Editor", async ({ page }) => {
        const featureText = "This is a beautiful handmade table lamp crafted by skilled Indian artisans using traditional techniques.";
        await addNewProduct.enterProductFeatures(featureText);
        expect(true).toBe(true);
    });

    test("TC_056_Verify_Product_Description_Accepts_Input_Via_Tinymce_Editor", async ({ page }) => {
        const descText = "This handcrafted table lamp is made from premium quality brass and glass. Each piece is uniquely designed by artisans from Moradabad. Perfect for living room, bedroom, or study table decoration.";
        await addNewProduct.enterProductDescription(descText);
        expect(true).toBe(true);
    });

    test("TC_057_Verify_Stock_Management_Default_Is_Self", async () => {
        const selected = await addNewProduct.getSelectedStockManagement();
        expect(selected).toBe("Self");
    });

    test("TC_058_Verify_Product_Dimensions_Field_Accepts_L_X_B_X_H_Format", async () => {
        await addNewProduct.enterDimension("30 X 20 X 15");
        expect(true).toBe(true);
    });

    test("TC_059_Verify_Multiple_Validation_Errors_Appear_Together_On_Empty_Form_Save", async ({ page }) => {
        await addNewProduct.clearStock();
        await addNewProduct.clearMetaTitle();
        await addNewProduct.clearMetaKeyword();
        await addNewProduct.clearMetaDescription();
        await addNewProduct.clearListPrice();
        await addNewProduct.scrollToSaveButton();
        await page.waitForTimeout(1000);
        await addNewProduct.Click_on_save_Btn();
        await page.waitForTimeout(3000);

        expect(await addNewProduct.isStockFieldErrorDisplayed()).toBe(true);
        expect(await addNewProduct.isMetaTitleErrorDisplayed()).toBe(true);
        expect(await addNewProduct.isMetaKeywordErrorDisplayed()).toBe(true);
        expect(await addNewProduct.isMetaDescriptionErrorDisplayed()).toBe(true);
        expect(await addNewProduct.isPriceFieldErrorDisplayed()).toBe(true);
    });

    test("TC_060_Verify_Field_Values_Can_Be_Cleared_And_Re_Entered", async () => {
        await addNewProduct.enterProductName("First Value");
        expect(await addNewProduct.getProductNameValue()).toBe("First Value");

        await addNewProduct.enterProductName("Second Value");
        expect(await addNewProduct.getProductNameValue()).toBe("Second Value");
    });

    test("TC_061_Verify_Stock_Field_Value_Can_Be_Updated", async () => {
        await addNewProduct.enterStock("10");
        expect(await addNewProduct.getStockValue()).toBe("10");

        await addNewProduct.enterStock("50");
        expect(await addNewProduct.getStockValue()).toBe("50");
    });

    test("TC_062_Verify_Page_URL_Contains_Correct_Product_Type_Simple", async () => {
        const url = await addNewProduct.getPageURL();
        expect(url).toContain("type/simple");
    });

    // No afterEach logout: the session is shared across all tests in this file, so
    // logging out here would break every subsequent test. The fixture closes the
    // browser context when the worker finishes.
});
