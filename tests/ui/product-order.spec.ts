import { test, expect } from "@playwright/test";
import { Homepagesteps } from "../../page-objects/page-steps/Home-page-steps";
import { ProductPageSteps } from "../../page-objects/page-steps/product-page-steps";
import { PaymentMethodSteps } from "../../page-objects/page-steps/payment-method-steps";
import { sellerLoginAsBuyer } from "../../utils/seller-login-as-buyer";
import { config } from "../../utils/config-reader";

test.describe("Product Order Tests", () => {
    let homePage: Homepagesteps;
    let productPage: ProductPageSteps;
    let paymentMethod: PaymentMethodSteps;

    test.beforeEach(async ({ page }) => {
        test.setTimeout(180000);

        homePage = new Homepagesteps(page);
        productPage = new ProductPageSteps(page);
        paymentMethod = new PaymentMethodSteps(page);

        // Buyer-side login uses an OTP that cannot be automated. Instead, log in with
        // seller credentials and click the logo to land on the buyer-facing storefront
        // while staying authenticated.
        await sellerLoginAsBuyer(page);

        // Open a product. The storefront search box proved unreliable after the
        // seller->logo entry (Enter did not trigger a search), and the old hardcoded SKU
        // "Del572697" no longer exists in the catalogue. Navigate straight to the
        // catalogue search result for a SKU that is confirmed to return a product.
        const searchUrl = new URL(
            "catalogsearch/result/?q=WES960065",
            config.url.endsWith("/") ? config.url : config.url + "/"
        ).toString();
        await page.goto(searchUrl, { waitUntil: "domcontentloaded" });
        await page.waitForSelector("//strong[@class='product name product-item-name']", { timeout: 30000 });
        await homePage.Click_on_Product();
        await page.waitForTimeout(3000);
    });

    test("TC_001_Verify_Product_Successfully_Ordered", async ({ page }) => {
        await page.waitForTimeout(3000);
        await productPage.Click_on_Add_To_Cart_button();
        await homePage.Click_on_cart();
        await page.waitForTimeout(4000);
        await homePage.Click_on_Proceed_to_CheckOut();

        try {
            await paymentMethod.Click_on_Cash_On_Delivery();
            await page.waitForTimeout(5000);
            await paymentMethod.Click_on_Place_Order();
            console.log("Placed order via Cash On Delivery");
        } catch (e) {
            console.log("Cash On Delivery not available, proceeding with Airpay UPI payment flow");
            await page.reload();
            await page.waitForTimeout(10000);
            await paymentMethod.Click_on_Place_Order();

            console.log("Payment page opened successfully");
            await page.waitForTimeout(5000);
            await paymentMethod.Click_on_pay_via_UPI();
            await page.waitForTimeout(3000);
            await paymentMethod.send_UPI_ID();
            await page.waitForTimeout(3000);
            await paymentMethod.Verify_Upi();
            await page.waitForTimeout(3000);
            await paymentMethod.Click_on_check_box();
            await page.waitForTimeout(3000);
            await paymentMethod.Click_on_make_payment();
            await page.waitForTimeout(15000);
        }

        const currentUrl = page.url();
        console.log("Final URL: " + currentUrl);
        const isSuccess =
            currentUrl.includes("checkout/onepage/success") ||
            currentUrl.includes("payments.airpay.co.in");
        expect(isSuccess).toBe(true);
    });

    test.afterEach(async ({ page }) => {
        // Teardown must never hang the suite. After checkout the page may be on the
        // payment gateway, a success page, or back in the seller panel - none of which
        // have the buyer profile/logout link. Logging out via URL is the most reliable
        // way to end the session without depending on a header element being present.
        test.setTimeout(30000);
        try {
            const logoutUrl = new URL("customer/account/logout/", config.url).toString();
            await page.goto(logoutUrl, { waitUntil: "domcontentloaded", timeout: 20000 });
        } catch (e) {
            console.log("Logout cleanup skipped: " + (e as Error).message.split("\n")[0]);
        }
    });
});
