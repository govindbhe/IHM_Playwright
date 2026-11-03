import { test, expect } from "@playwright/test";
import { Homepagesteps } from "../../page-objects/page-steps/Home-page-steps";
import { SellerRegAccountInfoSteps } from "../../page-objects/page-steps/seller-reg-account-info-steps";
import { SellerRegBasicInfoSteps } from "../../page-objects/page-steps/seller-reg-basic-info-steps";
import { SellerRegSellerDetailsSteps } from "../../page-objects/page-steps/seller-reg-seller-details-steps";
import { SellerRegShopInfoSteps } from "../../page-objects/page-steps/seller-reg-shop-info-steps";
import { SellerRegCommunicationAddressSteps } from "../../page-objects/page-steps/seller-reg-communication-address-steps";
import { SellerRegPaymentDetailsSteps } from "../../page-objects/page-steps/seller-reg-payment-details-steps";
import { config } from "../../utils/config-reader";

test.describe("Seller Registration Tests", () => {
    let homePage: Homepagesteps;
    let sellerRegAccountInfoSteps: SellerRegAccountInfoSteps;
    let sellerRegBasicInfoSteps: SellerRegBasicInfoSteps;
    let sellerRegSellerDetailsSteps: SellerRegSellerDetailsSteps;
    let sellerRegShopInfoSteps: SellerRegShopInfoSteps;
    let sellerRegCommunicationAddressSteps: SellerRegCommunicationAddressSteps;
    let sellerRegPaymentDetailsSteps: SellerRegPaymentDetailsSteps;

    test.beforeEach(async ({ page }) => {
        test.setTimeout(180000);

        // Initialize page objects
        homePage = new Homepagesteps(page);
        sellerRegAccountInfoSteps = new SellerRegAccountInfoSteps(page);
        sellerRegBasicInfoSteps = new SellerRegBasicInfoSteps(page);
        sellerRegSellerDetailsSteps = new SellerRegSellerDetailsSteps(page);
        sellerRegShopInfoSteps = new SellerRegShopInfoSteps(page);
        sellerRegCommunicationAddressSteps = new SellerRegCommunicationAddressSteps(page);
        sellerRegPaymentDetailsSteps = new SellerRegPaymentDetailsSteps(page);

        // Navigate to base URL
        const baseUrl = config.url;
        await page.goto(baseUrl);

        // Click on Vendor Registration button
        await homePage.Click_on_Vendar_Resistration();
        await page.waitForTimeout(2000);
    });

    test("Verify_User_Should_Register_Successfully_As_Seller", async ({ page }) => {
        // Step 1: Fill Account Information
        await sellerRegAccountInfoSteps.Account_info();
        
        await page.waitForTimeout(2000);

        // Step 2: Fill Basic Information
        await sellerRegBasicInfoSteps.basic_info();
        await page.waitForTimeout(2000);

        // Step 3: Fill Seller Details
        await sellerRegSellerDetailsSteps.seller_details();
        await page.waitForTimeout(3000);

        // Step 4: Fill Shop Information
        await sellerRegShopInfoSteps.shop_name();
        await page.waitForTimeout(2000);

        // Step 5: Fill Communication Address
        await sellerRegCommunicationAddressSteps.comm_Address();
        await page.waitForTimeout(2000);

        // Step 6: Fill Payment Details
        await sellerRegPaymentDetailsSteps.payment_details();
        await page.waitForTimeout(2000);

        // Step 7: Verify Success Message
        // Wait for the modal popup to appear after registration (max 30 seconds)
        const popupMessage = page.locator(
            "//*[contains(text(),'You must confirm your account')]"
        ).first();

        await expect(popupMessage).toBeVisible({ timeout: 30000 });

        const actualMessage = await popupMessage.textContent();
        console.log("Actual Message: " + actualMessage);

        // Verify the success message contains expected text
        expect(actualMessage).toContain("You must confirm your account");
    });


});
