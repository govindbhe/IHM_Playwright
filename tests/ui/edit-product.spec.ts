import { test, expect } from "@playwright/test";
import { Homepagesteps } from "../../page-objects/page-steps/Home-page-steps";
import { SellerLoginSteps } from "../../page-objects/page-steps/seller-login-steps";
import { DashboardPageSteps } from "../../page-objects/page-steps/dashboard-page-steps";
import { ProductListingSteps } from "../../page-objects/page-steps/product-listing-steps";
import { config } from "../../utils/config-reader";

test.describe("Edit Product Tests", () => {
    let homePage: Homepagesteps;
    let sellerLogin: SellerLoginSteps;
    let dashboard: DashboardPageSteps;
    let productListing: ProductListingSteps;

    test.beforeEach(async ({ page }) => {
        test.setTimeout(180000);

        homePage = new Homepagesteps(page);
        sellerLogin = new SellerLoginSteps(page);
        dashboard = new DashboardPageSteps(page);
        productListing = new ProductListingSteps(page);

        // Navigate to application and login as seller
        const appUrl = config.url || "https://www.indiahandmade.com/";
        await page.goto(appUrl);

        await homePage.Click_on_Vendar_LogIn();
        await sellerLogin.enter_email(config.sellerEmail);
        await sellerLogin.enter_Password(config.sellerPassword);
        await sellerLogin.Click_on_Sign_In_Button();

        // Navigate to Products > My Product List
        await dashboard.Click_On_Products();
        await page.waitForTimeout(2000);
        await dashboard.Click_On_My_Product_List();
        await page.waitForTimeout(2000);

        // Refresh and edit the product
        await page.reload();
        await page.waitForTimeout(5000);

        await productListing.Click_on_pencileIcon();
        await page.waitForTimeout(2000);
        await productListing.Click_on_OK_button();
        await page.waitForTimeout(2000);
        await productListing.send_on_New_Product_Name();
        await productListing.Click_on_Save_button();
    });

    // Test: Verify product edited successfully
    test("TC_001_Verify_Product_Edited_Successfully", async () => {
        const message = await productListing.Product_Save_Success_Massage();
        expect(message).toBe("Your product has been successfully saved");
    });

    test.afterEach(async ({ page }) => {
        // Logout from seller panel
        await dashboard.Click_On_Seller_Panel();
        await dashboard.Click_On_Logout();
    });
});
