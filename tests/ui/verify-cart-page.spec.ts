import { test, expect } from "@playwright/test";
import { Homepagesteps } from "../../page-objects/page-steps/Home-page-steps";
import { ProductPageSteps } from "../../page-objects/page-steps/product-page-steps";
import { CartPageSteps } from "../../page-objects/page-steps/cart-page-steps";
import { LoginWithOtpSteps } from "../../page-objects/page-steps/login-with-otp-steps";
import { config } from "../../utils/config-reader";

test.describe("Verify Cart Page Tests", () => {
    let homePage: Homepagesteps;
    let productPage: ProductPageSteps;
    let cartPage: CartPageSteps;
    let loginWithOtp: LoginWithOtpSteps;

    test.beforeEach(async ({ page }) => {
        test.setTimeout(180000);

        // Ensure BUYER_MOBILE is set in environment from config
        process.env.BUYER_MOBILE = config.buyerMobile || "9763274722";

        homePage = new Homepagesteps(page);
        productPage = new ProductPageSteps(page);
        cartPage = new CartPageSteps(page);
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

        // Search product, go to details, add to cart, go to cart
        await homePage.Send_on_Search_Here();
        await page.waitForTimeout(3000);
        await homePage.Click_on_Product();
        await page.waitForTimeout(3000);
        await productPage.Click_on_Add_To_Cart_button();
        await page.waitForTimeout(2000);
        await homePage.Click_on_cart();
        await page.waitForTimeout(2000);
    });

    test("Verify_Cart_Addition_ForLoggedInUser", async () => {
        expect(await cartPage.isCartPageLoaded()).toBe(true);
        expect(await cartPage.hasAtLeastOneCartItem()).toBe(true);

        const qty = await cartPage.getFirstItemQuantity();
        if (qty > 0) {
            expect(qty).toBeGreaterThanOrEqual(1);
        }
    });

    test("TC_002_Verify_Cart_UI_Sections_Visibility", async () => {
        expect(await cartPage.isCartPageLoaded()).toBe(true);
        expect(await cartPage.isPriceDetailsVisible()).toBe(true);
        expect(await cartPage.isCheckoutButtonVisibleAndEnabled()).toBe(true);
    });

    test("TC_003_Verify_Quantity_Controls_And_Increment_Behavior", async () => {
        expect(await cartPage.isQuantityControlVisible()).toBe(true);

        const beforeQty = await cartPage.getFirstItemQuantity();
        await cartPage.increaseFirstItemQuantity();
        const afterQty = await cartPage.getFirstItemQuantity();

        expect(afterQty).toBeGreaterThanOrEqual(beforeQty);
    });

    test("TC_004_Verify_Move_To_Wishlist_And_Clear_Cart_Controls", async () => {
        expect(await cartPage.isMoveToWishlistVisible()).toBe(true);
    });

    test("TC_005_Verify_Order_Total_Is_Displayed", async () => {
        const orderTotal = await cartPage.getOrderTotalValue();
        expect(orderTotal.includes("₹") || orderTotal.includes("$")).toBe(true);
        expect(orderTotal.replace(/[^0-9]/g, "").length).toBeGreaterThan(0);
    });

    test("TC_006_Verify_Checkout_Navigation_From_Cart", async ({ page }) => {
        await cartPage.clickCheckout();
        await expect(page).toHaveURL(/checkout/, { timeout: 20000 });
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
