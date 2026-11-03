import { test, expect } from "@playwright/test";
import { Homepagesteps } from "../../page-objects/page-steps/Home-page-steps";
import { SellerLoginSteps } from "../../page-objects/page-steps/seller-login-steps";
import { DashboardPageSteps } from "../../page-objects/page-steps/dashboard-page-steps";
import { ProductAddSteps } from "../../page-objects/page-steps/product-add-steps";
import { config } from "../../utils/config-reader";
import sellerLoginElements from "../../page-objects/page-elements/seller-login-elements.json" with { type: "json" };
import dashboardElements from "../../page-objects/page-elements/dashboard-elements.json" with { type: "json" };
import productAddElements from "../../page-objects/page-elements/product-add-elements.json" with { type: "json" };

test.describe("Seller Product Management - Single Variant Product", () => {
    test("Verify single-variant product added successfully", async ({ page }) => {
        test.setTimeout(180000);

        const homePage = new Homepagesteps(page);
        const sellerLogin = new SellerLoginSteps(page);
        const dashboard = new DashboardPageSteps(page);
        const productAdd = new ProductAddSteps(page);

        const appUrl = config.url;
        const sellerEmail = config.sellerEmail;
        const sellerPassword = config.sellerPassword;

        if (!sellerEmail || !sellerPassword) {
            throw new Error("Required environment variables SELLER_EMAIL or SELLER_PASSWORD are not set.");
        }

        const waitForVisible = async (selector: string, timeout = 30000): Promise<void> => {
            await expect(page.locator(selector).first()).toBeVisible({ timeout });
        };

        await page.goto(appUrl);

        await homePage.Click_on_Vendar_LogIn();
        await waitForVisible(sellerLoginElements.emailInputXpath);

        await sellerLogin.enter_email(sellerEmail);
        await sellerLogin.enter_Password(sellerPassword);
        await sellerLogin.Click_on_Sign_In_Button();

        await waitForVisible(dashboardElements.products);
        await dashboard.Click_On_Products();
        await waitForVisible(dashboardElements.addProduct);
        await dashboard.Click_On_Add_Product();
        await waitForVisible(productAddElements.productSelect);

        // Select and add simple product
        await productAdd.select_simple_product();
        await productAdd.Add_simple_Product();

        await waitForVisible(productAddElements.productAddSuccessMessage, 45000);

        const message = await productAdd.ProductAdd_Success_Massage();
        expect(message).toContain("Your product has been successfully saved");

        await dashboard.Click_On_Seller_Panel();
        await dashboard.Click_On_Logout();
    });
});
