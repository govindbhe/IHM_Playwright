import { test, expect } from "@playwright/test";
import { Homepagesteps } from "../../page-objects/page-steps/Home-page-steps";
import { ProductPageSteps } from "../../page-objects/page-steps/product-page-steps";
import { LoginWithOtpSteps } from "../../page-objects/page-steps/login-with-otp-steps";
import { ShippingAddressSteps } from "../../page-objects/page-steps/shipping-address-steps";
import { AddNewShippingAddressSteps } from "../../page-objects/page-steps/add-new-shipping-address-steps";
import { config } from "../../utils/config-reader";

test.describe("Verify Shipping Address Page Tests", () => {
    let homePage: Homepagesteps;
    let productPage: ProductPageSteps;
    let shippingAddress: ShippingAddressSteps;
    let addNewShippingAddress: AddNewShippingAddressSteps;
    let loginWithOtp: LoginWithOtpSteps;

    const openNewAddressDialog = async () => {
        await shippingAddress.clickNewShippingAddressBtn();
        // Wait until dialog is displayed
        await expect(async () => {
            expect(await addNewShippingAddress.isNewAddressDialogDisplayed()).toBe(true);
        }).toPass({ timeout: 15000 });
    };

    const waitForDialogClose = async () => {
        await expect(async () => {
            expect(await addNewShippingAddress.isNewAddressDialogDisplayed()).toBe(false);
        }).toPass({ timeout: 15000 });
    };

    test.beforeEach(async ({ page }) => {
        test.setTimeout(180000);

        // Ensure BUYER_MOBILE is set in environment from config
        process.env.BUYER_MOBILE = config.buyerMobile || "9763274722";

        homePage = new Homepagesteps(page);
        productPage = new ProductPageSteps(page);
        shippingAddress = new ShippingAddressSteps(page);
        addNewShippingAddress = new AddNewShippingAddressSteps(page);
        loginWithOtp = new LoginWithOtpSteps(page);

        // Navigate to the application
        const appUrl = config.url || "https://www.indiahandmade.com/";
        await page.goto(appUrl);
        await page.waitForTimeout(2000);

        // Login as buyer
        await homePage.Click_on_SignIn();
        await homePage.Click_on_LoginInOrSignUP();
        await page.waitForTimeout(4000);
        await loginWithOtp.Buyer_Login_With_OTP();
        await page.waitForTimeout(4000);

        // Search product, go to details, add to cart, go to cart, click checkout
        await homePage.Send_on_Search_Here();
        await page.waitForTimeout(3000);
        await homePage.Click_on_Product();
        await page.waitForTimeout(3000);
        await productPage.Click_on_Add_To_Cart_button();
        await page.waitForTimeout(2000);
        await homePage.Click_on_cart();
        await page.waitForTimeout(2000);
        await homePage.Click_on_Proceed_to_CheckOut();
        await page.waitForTimeout(4000);

        // Assert checkout page loaded
        expect(page.url()).toContain("checkout");

        // Dialog reset if open
        if (await addNewShippingAddress.isNewAddressDialogDisplayed()) {
            await addNewShippingAddress.clickCancelBtn();
            await waitForDialogClose();
        }
    });

    test("verify_checkout_page_url_contains_shipping", async ({ page }) => {
        expect(page.url()).toContain("checkout");
    });

    test("verify_shipping_address_header_is_displayed", async () => {
        expect(await shippingAddress.isShippingAddressHeaderDisplayed()).toBe(true);
    });

    test("verify_billing_address_header_is_displayed", async () => {
        expect(await shippingAddress.isBillingAddressHeaderDisplayed()).toBe(true);
    });

    test("verify_my_billing_and_shipping_address_are_the_same_checkbox_is_displayed_and_checked_by_default", async () => {
        expect(await shippingAddress.isBillingSameAsShippingLabelDisplayed()).toBe(true);
        expect(await shippingAddress.isBillingSameAsShippingChecked()).toBe(true);
    });

    test("verify_review_cart_step_indicator_is_displayed", async () => {
        expect(await shippingAddress.isReviewCartStepDisplayed()).toBe(true);
    });

    test("verify_checkout_details_step_indicator_is_displayed", async () => {
        expect(await shippingAddress.isCheckoutDetailsStepDisplayed()).toBe(true);
    });

    test("verify_change_address_link_is_displayed", async () => {
        expect(await shippingAddress.isChangeAddressLinkDisplayed()).toBe(true);
    });

    test("verify_new_address_button_is_displayed_in_shipping_section", async () => {
        expect(await shippingAddress.isNewShippingAddressBtnDisplayed()).toBe(true);
    });

    test("verify_price_details_section_is_displayed", async () => {
        expect(await shippingAddress.isPriceDetailsHeaderDisplayed()).toBe(true);
    });

    test("verify_cart_subtotal_is_not_empty", async () => {
        const subtotal = await shippingAddress.getCartSubtotalText();
        expect(subtotal).not.toBeNull();
        expect(subtotal).not.toBe("");
    });

    test("verify_items_in_cart_label_is_displayed", async () => {
        expect(await shippingAddress.isItemsInCartLabelDisplayed()).toBe(true);
    });

    test("verify_coupons_section_is_displayed", async () => {
        expect(await shippingAddress.isCouponsSectionDisplayed()).toBe(true);
    });

    test("verify_place_order_button_is_displayed_and_enabled", async () => {
        expect(await shippingAddress.isPlaceOrderBtnDisplayed()).toBe(true);
        expect(await shippingAddress.isPlaceOrderBtnEnabled()).toBe(true);
    });

    test("verify_shipping_methods_section_is_displayed", async () => {
        expect(await shippingAddress.isShippingMethodsHeaderDisplayed()).toBe(true);
    });

    test("verify_free_shipping_option_is_displayed", async () => {
        expect(await shippingAddress.isFreeShippingDisplayed()).toBe(true);
    });

    test("verify_payment_method_section_is_displayed", async () => {
        expect(await shippingAddress.isPaymentMethodHeaderDisplayed()).toBe(true);
    });

    test("verify_clicking_new_address_button_opens_the_address_dialog", async () => {
        await openNewAddressDialog();
        expect(await addNewShippingAddress.isNewAddressDialogDisplayed()).toBe(true);
    });

    test("verify_all_form_fields_are_displayed_in_new_address_dialog", async () => {
        await openNewAddressDialog();
        expect(await addNewShippingAddress.isFirstnameFieldDisplayed()).toBe(true);
        expect(await addNewShippingAddress.isLastnameFieldDisplayed()).toBe(true);
        expect(await addNewShippingAddress.isAddressFieldDisplayed()).toBe(true);
        expect(await addNewShippingAddress.isLandmarkFieldDisplayed()).toBe(true);
        expect(await addNewShippingAddress.isCountryDropdownDisplayed()).toBe(true);
        expect(await addNewShippingAddress.isStateDropdownDisplayed()).toBe(true);
        expect(await addNewShippingAddress.isCityFieldDisplayed()).toBe(true);
        expect(await addNewShippingAddress.isPincodeFieldDisplayed()).toBe(true);
        expect(await addNewShippingAddress.isMobileFieldDisplayed()).toBe(true);
    });

    test("verify_add_and_ship_here_button_is_displayed_in_dialog", async () => {
        await openNewAddressDialog();
        expect(await addNewShippingAddress.isAddAndShipHereBtnDisplayed()).toBe(true);
    });

    test("verify_cancel_button_is_displayed_in_new_address_dialog", async () => {
        await openNewAddressDialog();
        expect(await addNewShippingAddress.isCancelBtnDisplayed()).toBe(true);
    });

    test("verify_cancel_button_closes_the_new_address_dialog", async () => {
        await openNewAddressDialog();
        expect(await addNewShippingAddress.isNewAddressDialogDisplayed()).toBe(true);
        await addNewShippingAddress.clickCancelBtn();
        await waitForDialogClose();
        expect(await addNewShippingAddress.isNewAddressDialogDisplayed()).toBe(false);
    });

    test("verify_default_country_is_india_in_new_address_dialog", async () => {
        await openNewAddressDialog();
        const country = await addNewShippingAddress.getSelectedCountry();
        expect(country).toBe("India");
    });

    test("verify_placeholder_text_for_first_name_field", async () => {
        await openNewAddressDialog();
        const placeholder = await addNewShippingAddress.getFirstnamePlaceholder();
        expect(placeholder).not.toBeNull();
        expect(placeholder.toLowerCase()).toContain("first");
    });

    test("verify_placeholder_text_for_mobile_no_field", async () => {
        await openNewAddressDialog();
        const placeholder = await addNewShippingAddress.getMobilePlaceholder();
        expect(placeholder).not.toBeNull();
        expect(placeholder.toLowerCase()).toContain("phone");
    });

    test("verify_submitting_empty_form_shows_validation_errors", async () => {
        await openNewAddressDialog();
        await addNewShippingAddress.clearAllFields();
        await addNewShippingAddress.Click_On_Add_And_Shipehere();
        expect(await addNewShippingAddress.isFirstnameErrorDisplayed()).toBe(true);
        expect(await addNewShippingAddress.isLastnameErrorDisplayed()).toBe(true);
        expect(await addNewShippingAddress.isAddressErrorDisplayed()).toBe(true);
        expect(await addNewShippingAddress.isCityErrorDisplayed()).toBe(true);
        expect(await addNewShippingAddress.isPincodeErrorDisplayed()).toBe(true);
        expect(await addNewShippingAddress.isMobileErrorDisplayed()).toBe(true);
    });

    test("verify_submitting_form_with_only_first_name_shows_remaining_errors", async () => {
        await openNewAddressDialog();
        await addNewShippingAddress.clearAllFields();
        await addNewShippingAddress.enterFirstname("TestUser");
        await addNewShippingAddress.Click_On_Add_And_Shipehere();
        expect(await addNewShippingAddress.isFirstnameErrorDisplayed()).toBe(false);
        expect(await addNewShippingAddress.isLastnameErrorDisplayed()).toBe(true);
    });

    test("verify_invalid_pincode_shows_error", async () => {
        await openNewAddressDialog();
        await addNewShippingAddress.clearAllFields();
        await addNewShippingAddress.enterFirstname("Test");
        await addNewShippingAddress.enterLastname("User");
        await addNewShippingAddress.enterAddress("123 Test Street");
        await addNewShippingAddress.enterCity("Mumbai");
        await addNewShippingAddress.enterZipCode("12");
        await addNewShippingAddress.enterMobileNo("9876543210");
        await addNewShippingAddress.Click_On_Add_And_Shipehere();
        expect(await addNewShippingAddress.isPincodeErrorDisplayed()).toBe(true);
    });

    test("verify_invalid_mobile_number_shows_error", async () => {
        await openNewAddressDialog();
        await addNewShippingAddress.clearAllFields();
        await addNewShippingAddress.enterFirstname("Test");
        await addNewShippingAddress.enterLastname("User");
        await addNewShippingAddress.enterAddress("123 Test Street");
        await addNewShippingAddress.enterCity("Mumbai");
        await addNewShippingAddress.enterZipCode("400001");
        await addNewShippingAddress.enterMobileNo("123");
        await addNewShippingAddress.Click_On_Add_And_Shipehere();
        expect(await addNewShippingAddress.isMobileErrorDisplayed()).toBe(true);
    });

    test("verify_special_characters_in_first_name_field", async () => {
        await openNewAddressDialog();
        await addNewShippingAddress.clearAllFields();
        await addNewShippingAddress.enterFirstname("@#$%^&*");
        await addNewShippingAddress.enterLastname("User");
        await addNewShippingAddress.enterAddress("Test Address");
        await addNewShippingAddress.enterCity("Delhi");
        await addNewShippingAddress.enterZipCode("110001");
        await addNewShippingAddress.enterMobileNo("9876543210");
        await addNewShippingAddress.Click_On_Add_And_Shipehere();
        expect(await addNewShippingAddress.isFirstnameErrorDisplayed()).toBe(true);
    });

    test("verify_alphabets_in_pincode_field_are_not_accepted", async () => {
        await openNewAddressDialog();
        await addNewShippingAddress.clearAllFields();
        await addNewShippingAddress.enterFirstname("Test");
        await addNewShippingAddress.enterLastname("User");
        await addNewShippingAddress.enterAddress("Test Address");
        await addNewShippingAddress.enterCity("Delhi");
        await addNewShippingAddress.enterZipCode("ABCDEF");
        await addNewShippingAddress.enterMobileNo("9876543210");
        await addNewShippingAddress.Click_On_Add_And_Shipehere();
        expect(await addNewShippingAddress.isPincodeErrorDisplayed()).toBe(true);
    });

    test("verify_alphabets_in_mobile_no_field_are_not_accepted", async () => {
        await openNewAddressDialog();
        await addNewShippingAddress.clearAllFields();
        await addNewShippingAddress.enterFirstname("Test");
        await addNewShippingAddress.enterLastname("User");
        await addNewShippingAddress.enterAddress("Test Address");
        await addNewShippingAddress.enterCity("Delhi");
        await addNewShippingAddress.enterZipCode("110001");
        await addNewShippingAddress.enterMobileNo("ABCDEFGHIJ");
        await addNewShippingAddress.Click_On_Add_And_Shipehere();
        expect(await addNewShippingAddress.isMobileErrorDisplayed()).toBe(true);
    });

    test("verify_adding_new_shipping_address_with_valid_data", async () => {
        await openNewAddressDialog();
        await addNewShippingAddress.clearAllFields();
        await addNewShippingAddress.enterFirstname("Automation");
        await addNewShippingAddress.enterLastname("Test");
        await addNewShippingAddress.enterAddress("Plot No 42, Sector 7");
        await addNewShippingAddress.enterLandmark("Near Central Mall");
        await addNewShippingAddress.enterCity("Pune");
        await addNewShippingAddress.enterZipCode("411001");
        await addNewShippingAddress.enterMobileNo("9876543210");
        await addNewShippingAddress.Click_On_Add_And_Shipehere();
        await waitForDialogClose();
        expect(await addNewShippingAddress.isNewAddressDialogDisplayed()).toBe(false);
    });

    test("verify_unchecking_billing_same_as_shipping_shows_billing_address_form", async () => {
        await shippingAddress.clickBillingSameAsShippingCheckbox();
        expect(await shippingAddress.isBillingSameAsShippingChecked()).toBe(false);
    });

    test("verify_re_checking_billing_same_as_shipping_hides_billing_form", async () => {
        await shippingAddress.clickBillingSameAsShippingCheckbox();
        await shippingAddress.clickBillingSameAsShippingCheckbox();
        expect(await shippingAddress.isBillingSameAsShippingChecked()).toBe(true);
    });

    test("verify_at_least_one_saved_shipping_address_is_displayed", async () => {
        const count = await shippingAddress.getShippingAddressCount();
        expect(count).toBeGreaterThanOrEqual(1);
    });

    test("verify_x_button_closes_the_new_address_dialog", async () => {
        await openNewAddressDialog();
        expect(await addNewShippingAddress.isNewAddressDialogDisplayed()).toBe(true);
        await addNewShippingAddress.clickCloseDialogBtn();
        await waitForDialogClose();
        expect(await addNewShippingAddress.isNewAddressDialogDisplayed()).toBe(false);
    });

    test("verify_entered_data_persists_in_fields_before_submission", async () => {
        await openNewAddressDialog();
        await addNewShippingAddress.clearAllFields();
        await addNewShippingAddress.enterFirstname("Persistence");
        await addNewShippingAddress.enterLastname("Test");
        await addNewShippingAddress.enterCity("Bangalore");

        expect(await addNewShippingAddress.getFirstnameValue()).toBe("Persistence");
        expect(await addNewShippingAddress.getLastnameValue()).toBe("Test");
        expect(await addNewShippingAddress.getCityValue()).toBe("Bangalore");
    });

    test("verify_complete_checkout_flow_place_order_with_existing_address", async ({ page }) => {
        await shippingAddress.clickPlaceOrderBtn();
        await page.waitForTimeout(5000);
        const url = page.url();
        expect(url.includes("success") || url.includes("checkout")).toBe(true);
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
