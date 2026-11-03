// `test` comes from the buyer-session fixture: it restores a session seeded once via
// `npx tsx utils/seed-buyer-auth.ts`, so no test performs an OTP login.
import { test, expect, buyerAuthExists, BUYER_AUTH_MISSING_REASON } from "../../fixtures/buyer-session";
import { Homepagesteps } from "../../page-objects/page-steps/Home-page-steps";
import { MyAccountSteps } from "../../page-objects/page-steps/my-account-steps";
import { AddNewAddressSteps } from "../../page-objects/page-steps/add-new-address-steps";

test.describe("Edit Buyer Address Tests", () => {
    let homePage: Homepagesteps;
    let myAccount: MyAccountSteps;
    let addNewAddress: AddNewAddressSteps;

    // Buyer login is OTP-only and cannot be automated, so the session is seeded once by
    // hand. Skip with actionable instructions when that has not been done yet.
    test.skip(!buyerAuthExists(), BUYER_AUTH_MISSING_REASON);

    test.beforeEach(async ({ page }) => {
        test.slow();

        homePage = new Homepagesteps(page);
        myAccount = new MyAccountSteps(page);
        addNewAddress = new AddNewAddressSteps(page);

        // Already authenticated via the seeded session; go straight to the address book.
        await myAccount.Click_on_my_account();
        await page.waitForTimeout(2000);
        await myAccount.Click_on_Address_Book();
        await page.waitForTimeout(2000);
        await myAccount.Click_on_my_Edit_address_button();
        await page.waitForTimeout(2000);
    });

    // TC_001: Verify successful address edit with all valid data
    test("TC_001_Verify_Edit_Buyer_Address_With_All_Valid_Data", async ({ page }) => {
        const uniqueSuffix = String(Date.now()).substring(7);

        await addNewAddress.enterFirstName("Govind" + uniqueSuffix);
        await addNewAddress.enterLastName("Bhee" + uniqueSuffix);
        await addNewAddress.enterGstin("27AAACB5678R1ZP");
        await addNewAddress.enterCompany("IHM Pvt Ltd");
        await addNewAddress.enterPhoneNumber("9663636265");
        await addNewAddress.enterStreetAddress("Express park noida IHM Pvt Ltd 201301");
        await addNewAddress.selectStateByVisibleText("Maharashtra");
        await addNewAddress.enterCity("Nanded");
        await addNewAddress.enterPincode("201301");
        await addNewAddress.Click_on_default_billing_address();
        await addNewAddress.Click_on_default_shipping_address();
        await page.waitForTimeout(2000);
        await addNewAddress.Click_on_save_button();
        await page.waitForTimeout(3000);

        const successMessage = await addNewAddress.Add_Address_Success_Massage();
        console.log("Success Message: " + successMessage);
        expect(successMessage).toBe("You saved the address.");
    });

    // TC_002: Verify address edit with mandatory fields only
    test("TC_002_Verify_Edit_Address_With_Mandatory_Fields_Only", async ({ page }) => {
        await addNewAddress.enterFirstName("Raj");
        await addNewAddress.enterLastName("Kumar");
        await addNewAddress.enterPhoneNumber("9876543210");
        await addNewAddress.enterStreetAddress("123 Main Street");
        await addNewAddress.selectStateByVisibleText("Maharashtra");
        await addNewAddress.enterCity("Mumbai");
        await addNewAddress.enterPincode("400001");

        await page.waitForTimeout(2000);
        await addNewAddress.Click_on_save_button();
        await page.waitForTimeout(3000);

        const successMessage = await addNewAddress.Add_Address_Success_Massage();
        expect(successMessage).toBe("You saved the address.");
    });

    // TC_003: Verify empty first name validation
    test("TC_003_Verify_Empty_First_Name_Validation", async ({ page }) => {
        await addNewAddress.clearFirstNameField();
        await addNewAddress.enterLastName("Singh");
        await addNewAddress.enterPhoneNumber("9123456789");
        await addNewAddress.enterStreetAddress("456 Oak Street");
        await addNewAddress.selectStateByVisibleText("Maharashtra");
        await addNewAddress.enterCity("Pune");
        await addNewAddress.enterPincode("411001");

        await page.waitForTimeout(1000);
        await addNewAddress.Click_on_save_button();
        await page.waitForTimeout(2000);

        const errorMessage = await addNewAddress.getFirstNameValidationMessage();
        expect(errorMessage.toLowerCase()).toContain("required");
    });

    // TC_004: Verify empty last name validation
    test("TC_004_Verify_Empty_Last_Name_Validation", async ({ page }) => {
        await addNewAddress.enterFirstName("Priya");
        await addNewAddress.clearLastNameField();
        await addNewAddress.enterPhoneNumber("9234567890");
        await addNewAddress.enterStreetAddress("789 Pine Street");
        await addNewAddress.selectStateByVisibleText("Maharashtra");
        await addNewAddress.enterCity("Nagpur");
        await addNewAddress.enterPincode("440001");

        await page.waitForTimeout(1000);
        await addNewAddress.Click_on_save_button();
        await page.waitForTimeout(2000);

        const errorMessage = await addNewAddress.getLastNameValidationMessage();
        expect(errorMessage.toLowerCase()).toContain("required");
    });

    // TC_005: Verify empty phone number validation
    test("TC_005_Verify_Empty_Phone_Number_Validation", async ({ page }) => {
        await addNewAddress.enterFirstName("Arjun");
        await addNewAddress.enterLastName("Reddy");
        await addNewAddress.clearPhoneNumberField();
        await addNewAddress.enterStreetAddress("321 Elm Street");
        await addNewAddress.selectStateByVisibleText("Maharashtra");
        await addNewAddress.enterCity("Aurangabad");
        await addNewAddress.enterPincode("431001");

        await page.waitForTimeout(1000);
        await addNewAddress.Click_on_save_button();
        await page.waitForTimeout(2000);

        const errorMessage = await addNewAddress.getPhoneValidationMessage();
        expect(errorMessage.toLowerCase()).toContain("required");
    });

    // TC_006: Verify empty street address validation
    test("TC_006_Verify_Empty_Street_Address_Validation", async ({ page }) => {
        await addNewAddress.enterFirstName("Vikram");
        await addNewAddress.enterLastName("Patel");
        await addNewAddress.enterPhoneNumber("9345678901");
        await addNewAddress.clearStreetAddressField();
        await addNewAddress.selectStateByVisibleText("Maharashtra");
        await addNewAddress.enterCity("Thane");
        await addNewAddress.enterPincode("400601");

        await page.waitForTimeout(1000);
        await addNewAddress.Click_on_save_button();
        await page.waitForTimeout(2000);

        const errorMessage = await addNewAddress.getStreetValidationMessage();
        expect(errorMessage.toLowerCase()).toContain("required");
    });

    // TC_007: Verify empty state validation (skipped — matches original commented-out test)
    test.skip("TC_007_Verify_Empty_State_Validation", async ({ page }) => {
        await addNewAddress.enterFirstName("Neha");
        await addNewAddress.enterLastName("Sharma");
        await addNewAddress.enterPhoneNumber("9456789012");
        await addNewAddress.enterStreetAddress("654 Maple Street");
        await addNewAddress.enterCity("Nashik");
        await addNewAddress.enterPincode("422001");

        await page.waitForTimeout(1000);
        await addNewAddress.Click_on_save_button();
        await page.waitForTimeout(2000);

        const errorMessage = await addNewAddress.getStateValidationMessage();
        expect(errorMessage.toLowerCase()).toContain("required");
    });

    // TC_008: Verify empty city validation
    test("TC_008_Verify_Empty_City_Validation", async ({ page }) => {
        await addNewAddress.enterFirstName("Aditya");
        await addNewAddress.enterLastName("Verma");
        await addNewAddress.enterPhoneNumber("9567890123");
        await addNewAddress.enterStreetAddress("987 Cedar Street");
        await addNewAddress.selectStateByVisibleText("Maharashtra");
        await addNewAddress.clearCityField();
        await addNewAddress.enterPincode("412207");

        await page.waitForTimeout(1000);
        await addNewAddress.Click_on_save_button();
        await page.waitForTimeout(2000);

        const errorMessage = await addNewAddress.getCityValidationMessage();
        expect(errorMessage.toLowerCase()).toContain("required");
    });

    // TC_009: Verify empty pincode validation
    test("TC_009_Verify_Empty_Pincode_Validation", async ({ page }) => {
        await addNewAddress.enterFirstName("Pooja");
        await addNewAddress.enterLastName("Singh");
        await addNewAddress.enterPhoneNumber("9678901234");
        await addNewAddress.enterStreetAddress("159 Birch Street");
        await addNewAddress.selectStateByVisibleText("Maharashtra");
        await addNewAddress.enterCity("Sangli");
        await addNewAddress.clearPincodeField();

        await page.waitForTimeout(1000);
        await addNewAddress.Click_on_save_button();
        await page.waitForTimeout(2000);

        const errorMessage = await addNewAddress.getPincodeValidationMessage();
        expect(errorMessage.toLowerCase()).toContain("required");
    });

    // TC_010: Verify address form fields visibility
    test("TC_010_Verify_Address_Form_Fields_Visibility", async () => {
        expect(await addNewAddress.isFirstNameFieldVisible()).toBe(true);
        expect(await addNewAddress.isLastNameFieldVisible()).toBe(true);
        expect(await addNewAddress.isPhoneNumberFieldVisible()).toBe(true);
        expect(await addNewAddress.isStreetAddressFieldVisible()).toBe(true);
        expect(await addNewAddress.isStateDropdownVisible()).toBe(true);
        expect(await addNewAddress.isCityFieldVisible()).toBe(true);
        expect(await addNewAddress.isPincodeFieldVisible()).toBe(true);
        expect(await addNewAddress.isCountryDropdownVisible()).toBe(true);
        expect(await addNewAddress.isSaveButtonVisibleAndEnabled()).toBe(true);
    });

    // TC_011: Verify default billing address checkbox functionality
    test("TC_011_Verify_Default_Billing_Address_Checkbox", async ({ page }) => {
        await addNewAddress.fillMandatoryAddressFields("Test", "User", "9999999999", "100 Test St",
                "Maharashtra", "Mumbai", "400001");

        const initialState = await addNewAddress.isDefaultBillingAddressChecked();
        await addNewAddress.Click_on_default_billing_address();
        await page.waitForTimeout(1000);
        const finalState = await addNewAddress.isDefaultBillingAddressChecked();

        expect(initialState).not.toBe(finalState);
    });

    // TC_012: Verify default shipping address checkbox functionality
    test("TC_012_Verify_Default_Shipping_Address_Checkbox", async ({ page }) => {
        await addNewAddress.fillMandatoryAddressFields("TestFirst", "TestLast", "8888888888",
                "200 Test Ave", "Maharashtra", "Pune", "411001");

        const initialState = await addNewAddress.isDefaultShippingAddressChecked();
        await addNewAddress.Click_on_default_shipping_address();
        await page.waitForTimeout(1000);
        const finalState = await addNewAddress.isDefaultShippingAddressChecked();

        expect(initialState).not.toBe(finalState);
    });

    // TC_013: Verify country dropdown displays correct value
    test("TC_013_Verify_Country_Dropdown_Value", async () => {
        const selectedCountry = await addNewAddress.getSelectedCountry();
        expect(selectedCountry).toBe("India");
    });

    // TC_014: Verify state dropdown functionality
    test("TC_014_Verify_State_Dropdown_Functionality", async () => {
        await addNewAddress.selectStateByVisibleText("Karnataka");
        let selectedState = await addNewAddress.getSelectedState();
        expect(selectedState).toBe("Karnataka");

        await addNewAddress.selectStateByVisibleText("Tamil Nadu");
        selectedState = await addNewAddress.getSelectedState();
        expect(selectedState).toBe("Tamil Nadu");
    });

    // TC_015: Verify address with special characters in name fields
    test("TC_015_Verify_Address_With_Special_Characters_In_Name", async ({ page }) => {
        await addNewAddress.enterFirstName("John-Paul");
        await addNewAddress.enterLastName("O'Brien");
        await addNewAddress.enterPhoneNumber("9111111111");
        await addNewAddress.enterStreetAddress("456 St. James-Avenue, Apt #5");
        await addNewAddress.selectStateByVisibleText("Maharashtra");
        await addNewAddress.enterCity("Mumbai");
        await addNewAddress.enterPincode("400050");

        await page.waitForTimeout(2000);
        await addNewAddress.Click_on_save_button();
        await page.waitForTimeout(3000);

        const successMessage = await addNewAddress.Add_Address_Success_Massage();
        expect(successMessage).toBe("You saved the address.");
    });

    // TC_016: Verify address form with GSTIN and company information
    test("TC_016_Verify_Address_With_GSTIN_And_Company", async ({ page }) => {
        await addNewAddress.enterFirstName("Business");
        await addNewAddress.enterLastName("Owner");
        await addNewAddress.enterGstin("18AABCT1234H1Z0");
        await addNewAddress.enterCompany("Tech Solutions Pvt Ltd");
        await addNewAddress.enterPhoneNumber("9222222222");
        await addNewAddress.enterStreetAddress("Corporate Park");
        await addNewAddress.selectStateByVisibleText("Maharashtra");
        await addNewAddress.enterCity("Bangalore");
        await addNewAddress.enterPincode("560001");

        await page.waitForTimeout(2000);
        await addNewAddress.Click_on_save_button();
        await page.waitForTimeout(3000);

        const successMessage = await addNewAddress.Add_Address_Success_Massage();
        expect(successMessage).toBe("You saved the address.");
    });

    // TC_017: Verify setting both default billing and shipping address
    test("TC_017_Verify_Both_Default_Billing_And_Shipping_Address", async ({ page }) => {
        await addNewAddress.fillMandatoryAddressFields("DefaultBill", "DefaultShip", "9333333333",
                "789 Default St", "Maharashtra", "Nagpur", "440001");

        await addNewAddress.Click_on_default_billing_address();
        await page.waitForTimeout(1000);
        await addNewAddress.Click_on_default_shipping_address();
        await page.waitForTimeout(1000);

        expect(await addNewAddress.isDefaultBillingAddressChecked()).toBe(true);
        expect(await addNewAddress.isDefaultShippingAddressChecked()).toBe(true);

        await page.waitForTimeout(1000);
        await addNewAddress.Click_on_save_button();
        await page.waitForTimeout(3000);

        const successMessage = await addNewAddress.Add_Address_Success_Massage();
        expect(successMessage).toBe("You saved the address.");
    });

    // TC_018: Verify pincode boundary test
    test("TC_018_Verify_Pincode_Boundary_Length", async ({ page }) => {
        await addNewAddress.enterFirstName("Boundary");
        await addNewAddress.enterLastName("Test");
        await addNewAddress.enterPhoneNumber("9444444444");
        await addNewAddress.enterStreetAddress("Boundary Test Street");
        await addNewAddress.selectStateByVisibleText("Maharashtra");
        await addNewAddress.enterCity("Delhi");
        await addNewAddress.enterPincode("110001");

        await page.waitForTimeout(2000);
        await addNewAddress.Click_on_save_button();
        await page.waitForTimeout(3000);

        const successMessage = await addNewAddress.Add_Address_Success_Massage();
        expect(successMessage).toBe("You saved the address.");
    });

    // TC_019: Verify phone number format validation
    test("TC_019_Verify_Phone_Number_Format_Validation", async ({ page }) => {
        await addNewAddress.enterFirstName("Phone");
        await addNewAddress.enterLastName("Format");
        await addNewAddress.enterPhoneNumber("9555555555");
        await addNewAddress.enterStreetAddress("Phone Test Avenue");
        await addNewAddress.selectStateByVisibleText("Maharashtra");
        await addNewAddress.enterCity("Hyderabad");
        await addNewAddress.enterPincode("500001");

        await page.waitForTimeout(2000);
        await addNewAddress.Click_on_save_button();
        await page.waitForTimeout(3000);

        const successMessage = await addNewAddress.Add_Address_Success_Massage();
        expect(successMessage).toBe("You saved the address.");
    });

    // TC_020: Verify save button is enabled on form
    test("TC_020_Verify_Save_Button_Enabled_State", async () => {
        const isSaveButtonReady = await addNewAddress.isSaveButtonVisibleAndEnabled();
        expect(isSaveButtonReady).toBe(true);
    });

    // TC_021: Verify multiple state selections
    test("TC_021_Verify_Multiple_State_Selections", async () => {
        await addNewAddress.selectStateByVisibleText("Gujarat");
        let state = await addNewAddress.getSelectedState();
        expect(state).toBe("Gujarat");

        await addNewAddress.selectStateByVisibleText("Rajasthan");
        state = await addNewAddress.getSelectedState();
        expect(state).toBe("Rajasthan");

        await addNewAddress.selectStateByVisibleText("Uttar Pradesh");
        state = await addNewAddress.getSelectedState();
        expect(state).toBe("Uttar Pradesh");
    });

    test.afterEach(async ({ page }) => {
        // Only attempt logout if we are actually signed in. If login failed, the Profile
        // link never renders and clicking it waits out the whole hook timeout, adding 90s
        // of dead time to every already-failing test.
        if (!(await homePage.isProfileLinkVisible())) {
            return;
        }

        try {
            await homePage.Click_on_ProfileLink();
            await page.waitForTimeout(2000);
            await homePage.Click_on_LogoutButton();
        } catch (e) {
            console.log("Logout failed: " + e);
        }
    });
});
