import { test, expect, Page } from "@playwright/test";
import { Homepagesteps } from "../../page-objects/page-steps/Home-page-steps";
import { SellerLoginSteps } from "../../page-objects/page-steps/seller-login-steps";
import { DashboardPageSteps } from "../../page-objects/page-steps/dashboard-page-steps";
import { ProductPageSteps } from "../../page-objects/page-steps/product-page-steps";
import { config } from "../../utils/config-reader";
import sellerLoginElements from "../../page-objects/page-elements/seller-login-elements.json" with { type: "json" };
import dashboardElements from "../../page-objects/page-elements/dashboard-elements.json" with { type: "json" };

test.describe.serial("Add To Cart Button Tests", () => {
    let sharedPage: Page;
    let homePage: Homepagesteps;
    let sellerLogin: SellerLoginSteps;
    let dashboard: DashboardPageSteps;
    let productPage: ProductPageSteps;

    test.beforeAll(async ({ browser }) => {
        test.setTimeout(180000);
        // Create a single browser context and page for the entire serial suite
        const context = await browser.newContext();
        sharedPage = await context.newPage();

        homePage = new Homepagesteps(sharedPage);
        sellerLogin = new SellerLoginSteps(sharedPage);
        dashboard = new DashboardPageSteps(sharedPage);
        productPage = new ProductPageSteps(sharedPage);

        const appUrl = config.url;
        const sellerEmail = config.sellerEmail;
        const sellerPassword = config.sellerPassword;

        if (!sellerEmail || !sellerPassword) {
            throw new Error("Required environment variables seller_email/SELLER_EMAIL or seller_password/SELLER_PASSWORD are not set.");
        }

        // Navigate and log in as seller
        await sharedPage.goto(appUrl);
        await homePage.Click_on_Vendar_LogIn();

        // Wait for email input to be visible before entering credentials
        await sharedPage.locator(sellerLoginElements.emailInputXpath).first().waitFor({ state: "visible", timeout: 30000 });

        await sellerLogin.enter_email(sellerEmail);
        await sellerLogin.enter_Password(sellerPassword);
        await sellerLogin.Click_on_Sign_In_Button();

        // Wait for dashboard and return to storefront
        await sharedPage.locator(dashboardElements.products).first().waitFor({ state: "visible", timeout: 30000 });
        await dashboard.Click_On_SellerLogo();
    });

    test.beforeEach(async () => {
        test.setTimeout(120000);
        // Return to home page storefront before each test
        const appUrl = config.url || "https://www.indiahandmade.com/";
        await sharedPage.goto(appUrl);
        await sharedPage.waitForTimeout(2000);
    });

    test.afterAll(async () => {
        test.setTimeout(60000);
        // Logout from the application and close the page
        try {
            await homePage.Click_on_ProfileLink();
            await sharedPage.waitForTimeout(2000);
            await homePage.Click_on_LogoutButton();
        } catch (error) {
            console.log("Seller Logout failed: " + (error as Error).message);
        }
        await sharedPage.close();
    });

    // Test 4 in Java (Priority 1)
    test("Verify Add To Cart Button Workflow For Guest User", async () => {
        await homePage.Send_on_Search_Here_Raal_Product();
        await sharedPage.waitForTimeout(4000);
        await homePage.Click_on_Product();
        await sharedPage.waitForTimeout(4000);
        await productPage.Click_on_Add_To_Cart_button();
        await sharedPage.waitForTimeout(4000);

        await homePage.Click_on_cart();
        await sharedPage.waitForTimeout(2000);
        const actualQty = await homePage.getCartProductQuantity();
        expect(actualQty).toBeGreaterThanOrEqual(1);
    });

    // Test 2 in Java (Priority 2)
    test("Verify Add To Cart Button Hidden For Out Of Stock Product", async () => {
        await sharedPage.waitForTimeout(2000);
        await homePage.Send_on_Search_Here_Outoff_stock();
        await homePage.Click_on_Product();
        await sharedPage.waitForTimeout(2000);

        const isVisible = await productPage.Check_Visibility_for_Add_To_Cart_button();
        expect(isVisible).toBe(false);
    });

    // Test 3 in Java (Priority 3)
    test("Verify Add To Cart Button Workflow For Logged In User", async () => {
        await homePage.Send_on_Search_Here_Raal_Product();
        await homePage.Click_on_Product();
        await sharedPage.waitForTimeout(4000);
        await productPage.Click_on_Add_To_Cart_button();
        await sharedPage.waitForTimeout(4000);

        await homePage.Click_on_cart();
        await sharedPage.waitForTimeout(2000);
        const actualQty = await homePage.getCartProductQuantity();
        expect(actualQty).toBeGreaterThanOrEqual(1);
    });

    // Test 1 in Java (Priority 4)
    test("Verify Add To Cart Button Visible For In Stock Product", async () => {
        await homePage.Send_on_Search_Here_Raal_Product();
        await homePage.Click_on_Product();
        await sharedPage.waitForTimeout(2000);

        const isVisible = await productPage.Check_Visibility_for_Add_To_Cart_button();
        expect(isVisible).toBe(true);
    });
});
