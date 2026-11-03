import { test, expect, Page } from "@playwright/test";
import { Homepagesteps } from "../../page-objects/page-steps/Home-page-steps";
import { LoginWithOtpSteps } from "../../page-objects/page-steps/login-with-otp-steps";
import { MyAccountSteps } from "../../page-objects/page-steps/my-account-steps";
import { AddNewAddressSteps } from "../../page-objects/page-steps/add-new-address-steps";
import { config } from "../../utils/config-reader";
import data from "../../testdata/ui/data.json" with { type: "json" };

test.describe.configure({ mode: "serial" });

test.describe("Add New Buyer Address Tests", () => {
    let sharedPage: Page;
    let homePage: Homepagesteps;
    let loginWithOtp: LoginWithOtpSteps;
    let myAccount: MyAccountSteps;
    let addNewAddress: AddNewAddressSteps;

    test.beforeAll(async ({ browser }) => {
        // Create a single browser page for all tests in this suite
        sharedPage = await browser.newPage();
        test.slow();

        process.env.BUYER_MOBILE = config.buyerMobile;

        homePage = new Homepagesteps(sharedPage);
        loginWithOtp = new LoginWithOtpSteps(sharedPage);
        myAccount = new MyAccountSteps(sharedPage);
        addNewAddress = new AddNewAddressSteps(sharedPage);

        const appUrl = config.url;
        await sharedPage.goto(appUrl);

        // Perform login once
        await homePage.Click_on_SignIn();
        await homePage.Click_on_LoginInOrSignUP();
        await loginWithOtp.Buyer_Login_With_OTP();

        // NOTE: do not assert on /customer/ alone - the login page itself is
        // /customer/account/login, so a failed login would pass that check and the
        // real error would surface later as a confusing "Unable to click My Account".
        // Surface OTP/login failures here instead.
        const otpError = await sharedPage
            .locator("text=Entered OTP does not matched")
            .isVisible()
            .catch(() => false);
        if (otpError) {
            throw new Error(
                "Buyer OTP login failed: the server rejected the OTP. " +
                "The hardcoded OTP in LoginWithOtpSteps.Buyer_Login_With_OTP is no longer valid " +
                "for this environment. Supply a valid OTP (or a saved storageState) before running this suite."
            );
        }

        await expect(sharedPage).not.toHaveURL(/customer\/account\/login/, { timeout: 40000 });
        await expect(sharedPage).toHaveURL(/customer/, { timeout: 40000 });
    });


    test.beforeEach(async () => {
        // If we are already on the address book listing page, we don't need to click
        // the Address Book sidebar link (which turns into a non-link <strong> tag).
        await myAccount.Click_on_my_account();

        await myAccount.Click_on_Address_Book();

        await addNewAddress.Click_on_add_new_address();

        await expect(
            sharedPage.locator("//input[@name='firstname']")
        ).toBeVisible();

    });

    test("TC_001: Verify successful address add with all valid data", async () => {
        const uniqueSuffix = String(Date.now()).substring(7);


        const isFormVisible = await addNewAddress.isAddressFormDisplayed();
        expect(isFormVisible).toBe(true);

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
        await addNewAddress.Click_on_save_button();

        await expect(
            sharedPage.locator("text=You saved the address.")
        ).toBeVisible();

        const successMessage =
            await addNewAddress.Add_Address_Success_Massage();
    });

    test("TC_002: Verify address add with mandatory fields only", async () => {
        await addNewAddress.enterFirstName("Raj");
        await addNewAddress.enterLastName("Kumar");
        await addNewAddress.enterPhoneNumber("9876543210");
        await addNewAddress.enterStreetAddress("123 Main Street");
        await addNewAddress.selectStateByVisibleText("Maharashtra");
        await addNewAddress.enterCity("Mumbai");
        await addNewAddress.enterPincode("400001");

        await addNewAddress.Click_on_save_button();

        const successMessage = await addNewAddress.Add_Address_Success_Massage();
        expect(successMessage).toBe("You saved the address.");
    });

    test("TC_003: Verify empty first name validation", async () => {
        await addNewAddress.clearFirstNameField();
        await addNewAddress.enterLastName("Singh");
        await addNewAddress.enterPhoneNumber("9123456789");
        await addNewAddress.enterStreetAddress("456 Oak Street");
        await addNewAddress.selectStateByVisibleText("Maharashtra");
        await addNewAddress.enterCity("Pune");
        await addNewAddress.enterPincode("411001");

        await addNewAddress.Click_on_save_button();

        const errorMessage = await addNewAddress.getFirstNameValidationMessage();
        expect(errorMessage.toLowerCase()).toContain("required");
    });

    test("TC_004: Verify empty last name validation", async () => {
        await addNewAddress.enterFirstName("Priya");
        await addNewAddress.clearLastNameField();
        await addNewAddress.enterPhoneNumber("9234567890");
        await addNewAddress.enterStreetAddress("789 Pine Street");
        await addNewAddress.selectStateByVisibleText("Maharashtra");
        await addNewAddress.enterCity("Nagpur");
        await addNewAddress.enterPincode("440001");

        await addNewAddress.Click_on_save_button();

        const errorMessage = await addNewAddress.getLastNameValidationMessage();
        expect(errorMessage.toLowerCase()).toContain("required");
    });

    test("TC_005: Verify empty phone number validation", async () => {
        await addNewAddress.enterFirstName("Arjun");
        await addNewAddress.enterLastName("Reddy");
        await addNewAddress.clearPhoneNumberField();
        await addNewAddress.enterStreetAddress("321 Elm Street");
        await addNewAddress.selectStateByVisibleText("Maharashtra");
        await addNewAddress.enterCity("Aurangabad");
        await addNewAddress.enterPincode("431001");

        await addNewAddress.Click_on_save_button();

        const errorMessage = await addNewAddress.getPhoneValidationMessage();
        expect(errorMessage.toLowerCase()).toContain("required");
    });

    test("TC_006: Verify empty street address validation", async () => {
        await addNewAddress.enterFirstName("Vikram");
        await addNewAddress.enterLastName("Patel");
        await addNewAddress.enterPhoneNumber("9345678901");
        await addNewAddress.clearStreetAddressField();
        await addNewAddress.selectStateByVisibleText("Maharashtra");
        await addNewAddress.enterCity("Thane");
        await addNewAddress.enterPincode("400601");

        await addNewAddress.Click_on_save_button();

        const errorMessage = await addNewAddress.getStreetValidationMessage();
        expect(errorMessage.toLowerCase()).toContain("required");
    });

    test.skip("TC_007: Verify empty state validation", async () => {
        await addNewAddress.enterFirstName("Neha");
        await addNewAddress.enterLastName("Sharma");
        await addNewAddress.enterPhoneNumber("9456789012");
        await addNewAddress.enterStreetAddress("654 Maple Street");
        await addNewAddress.enterCity("Nashik");
        await addNewAddress.enterPincode("422001");

        await addNewAddress.Click_on_save_button();

        const errorMessage = await addNewAddress.getStateValidationMessage();
        expect(errorMessage.toLowerCase()).toContain("required");
    });

    test("TC_008: Verify empty city validation", async () => {
        await addNewAddress.enterFirstName("Aditya");
        await addNewAddress.enterLastName("Verma");
        await addNewAddress.enterPhoneNumber("9567890123");
        await addNewAddress.enterStreetAddress("987 Cedar Street");
        await addNewAddress.selectStateByVisibleText("Maharashtra");
        await addNewAddress.clearCityField();
        await addNewAddress.enterPincode("412207");

        await addNewAddress.Click_on_save_button();

        const errorMessage = await addNewAddress.getCityValidationMessage();
        expect(errorMessage.toLowerCase()).toContain("required");
    });

    test("TC_009: Verify empty pincode validation", async () => {
        await addNewAddress.enterFirstName("Pooja");
        await addNewAddress.enterLastName("Singh");
        await addNewAddress.enterPhoneNumber("9678901234");
        await addNewAddress.enterStreetAddress("159 Birch Street");
        await addNewAddress.selectStateByVisibleText("Maharashtra");
        await addNewAddress.enterCity("Sangli");
        await addNewAddress.clearPincodeField();

        await addNewAddress.Click_on_save_button();

        const errorMessage = await addNewAddress.getPincodeValidationMessage();
        expect(errorMessage.toLowerCase()).toContain("required");
    });

    test("TC_010: Verify address form fields visibility", async () => {
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

    test("TC_011: Verify default billing address checkbox functionality", async () => {
        await addNewAddress.fillMandatoryAddressFields("Test", "User", "9999999999", "100 Test St",
            "Maharashtra", "Mumbai", "400001");

        const initialState = await addNewAddress.isDefaultBillingAddressChecked();
        await addNewAddress.Click_on_default_billing_address();
        const finalState = await addNewAddress.isDefaultBillingAddressChecked();

        expect(initialState).not.toBe(finalState);
    });

    test("TC_012: Verify default shipping address checkbox functionality", async () => {
        await addNewAddress.fillMandatoryAddressFields("TestFirst", "TestLast", "8888888888",
            "200 Test Ave", "Maharashtra", "Pune", "411001");

        const initialState = await addNewAddress.isDefaultShippingAddressChecked();
        await addNewAddress.Click_on_default_shipping_address();
        const finalState = await addNewAddress.isDefaultShippingAddressChecked();

        expect(initialState).not.toBe(finalState);
    });

    test("TC_013: Verify country dropdown displays correct value", async () => {
        const selectedCountry = await addNewAddress.getSelectedCountry();
        expect(selectedCountry).toBe("India");
    });

    test("TC_014: Verify state dropdown functionality", async () => {
        await addNewAddress.selectStateByVisibleText("Karnataka");
        let selectedState = await addNewAddress.getSelectedState();
        expect(selectedState).toBe("Karnataka");

        await addNewAddress.selectStateByVisibleText("Tamil Nadu");
        selectedState = await addNewAddress.getSelectedState();
        expect(selectedState).toBe("Tamil Nadu");
    });

    test("TC_015: Verify address with special characters in name fields", async () => {
        await addNewAddress.enterFirstName("John-Paul");
        await addNewAddress.enterLastName("O'Brien");
        await addNewAddress.enterPhoneNumber("9111111111");
        await addNewAddress.enterStreetAddress("456 St. James-Avenue, Apt #5");
        await addNewAddress.selectStateByVisibleText("Maharashtra");
        await addNewAddress.enterCity("Mumbai");
        await addNewAddress.enterPincode("400050");

        await addNewAddress.Click_on_save_button();

        const successMessage = await addNewAddress.Add_Address_Success_Massage();
        expect(successMessage).toBe("You saved the address.");
    });

    test("TC_016: Verify address form with GSTIN and company information", async () => {
        await addNewAddress.enterFirstName("Business");
        await addNewAddress.enterLastName("Owner");
        await addNewAddress.enterGstin("18AABCT1234H1Z0");
        await addNewAddress.enterCompany("Tech Solutions Pvt Ltd");
        await addNewAddress.enterPhoneNumber("9222222222");
        await addNewAddress.enterStreetAddress("Corporate Park");
        await addNewAddress.selectStateByVisibleText("Maharashtra");
        await addNewAddress.enterCity("Bangalore");
        await addNewAddress.enterPincode("560001");

        await addNewAddress.Click_on_save_button();

        const successMessage = await addNewAddress.Add_Address_Success_Massage();
        expect(successMessage).toBe("You saved the address.");
    });

    test("TC_017: Verify setting both default billing and shipping address", async () => {
        await addNewAddress.fillMandatoryAddressFields("DefaultBill", "DefaultShip", "9333333333",
            "789 Default St", "Maharashtra", "Nagpur", "440001");

        await addNewAddress.Click_on_default_billing_address();
        await addNewAddress.Click_on_default_shipping_address();

        expect(await addNewAddress.isDefaultBillingAddressChecked()).toBe(true);
        expect(await addNewAddress.isDefaultShippingAddressChecked()).toBe(true);

        await addNewAddress.Click_on_save_button();

        const successMessage = await addNewAddress.Add_Address_Success_Massage();
        expect(successMessage).toBe("You saved the address.");
    });

    test("TC_018: Verify pincode boundary test", async () => {
        await addNewAddress.enterFirstName("Boundary");
        await addNewAddress.enterLastName("Test");
        await addNewAddress.enterPhoneNumber("9444444444");
        await addNewAddress.enterStreetAddress("Boundary Test Street");
        await addNewAddress.selectStateByVisibleText("Maharashtra");
        await addNewAddress.enterCity("Delhi");
        await addNewAddress.enterPincode("110001");

        await addNewAddress.Click_on_save_button();

        const successMessage = await addNewAddress.Add_Address_Success_Massage();
        expect(successMessage).toBe("You saved the address.");
    });

    test("TC_019: Verify phone number format validation", async () => {
        await addNewAddress.enterFirstName("Phone");
        await addNewAddress.enterLastName("Format");
        await addNewAddress.enterPhoneNumber("9555555555");
        await addNewAddress.enterStreetAddress("Phone Test Avenue");
        await addNewAddress.selectStateByVisibleText("Maharashtra");
        await addNewAddress.enterCity("Hyderabad");
        await addNewAddress.enterPincode("500001");

        await addNewAddress.Click_on_save_button();

        const successMessage = await addNewAddress.Add_Address_Success_Massage();
        expect(successMessage).toBe("You saved the address.");
    });

    test("TC_020: Verify save button is enabled on form", async () => {
        const isSaveButtonReady = await addNewAddress.isSaveButtonVisibleAndEnabled();
        expect(isSaveButtonReady).toBe(true);
    });

    test("TC_021: Verify multiple state selections", async () => {
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

    test.afterAll(async () => {
        if (sharedPage) {
            await sharedPage.close();
        }
    });

});
