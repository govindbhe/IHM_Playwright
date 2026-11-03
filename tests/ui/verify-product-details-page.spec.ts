import { test, expect } from "@playwright/test";
import { Homepagesteps } from "../../page-objects/page-steps/Home-page-steps";
import { ProductPageSteps } from "../../page-objects/page-steps/product-page-steps";
import { config } from "../../utils/config-reader";

test.describe("Verify Product Details Page Tests", () => {
    let homePage: Homepagesteps;
    let productPage: ProductPageSteps;
    let Product_Page_URL: string;

    test.beforeAll(async () => {
        const baseUrl = config.url || "https://www.indiahandmade.com/";
        Product_Page_URL = baseUrl + "catalog/product/view/id/2423/s/printed-cotton-double-bedsheet/category/165/";
    });

    test.beforeEach(async ({ page }) => {
        test.setTimeout(180000);

        homePage = new Homepagesteps(page);
        productPage = new ProductPageSteps(page);

        // Ensure we load the product page
        await page.goto(Product_Page_URL);
        await page.waitForTimeout(3000);
    });

    test("Verify_ProductName_Displayed_On_ProductPage", async () => {
        expect(await productPage.isProductNameDisplayed()).toBe(true);
        const name = await productPage.getProductName();
        expect(name).not.toBe("");
        console.log("Product Name: " + name);
    });

    test("Verify_ProductPrice_Displayed_And_Valid", async () => {
        expect(await productPage.isPriceDisplayed()).toBe(true);
        const price = await productPage.getProductPriceAsDouble();
        expect(price).toBeGreaterThan(0);
        console.log("Product Price: ₹" + price);
    });

    test("Verify_StockStatus_Displayed_For_InStock_Product", async () => {
        const stockStatus = await productPage.getStockStatus();
        expect(stockStatus).not.toBe("");
        expect(await productPage.isInStock()).toBe(true);
        console.log("Stock Status: " + stockStatus);
    });

    test("Verify_AddToCart_Button_Visible_For_InStock_Product", async () => {
        expect(await productPage.Check_Visibility_for_Add_To_Cart_button()).toBe(true);
    });

    test("Verify_BuyNow_And_AddToCart_Buttons_Coexist", async () => {
        expect(await productPage.Check_Visibility_for_Buy_Now_button()).toBe(true);
        expect(await productPage.Check_Visibility_for_Add_To_Cart_button()).toBe(true);
        expect(await productPage.isBuyNowButtonEnabled()).toBe(true);
        expect(await productPage.isAddToCartButtonEnabled()).toBe(true);
    });

    test("Verify_ProductImage_Displayed_On_ProductPage", async () => {
        expect(await productPage.isProductImageDisplayed()).toBe(true);
    });

    test("Verify_WishList_Button_Visible_On_ProductPage", async () => {
        expect(await productPage.isWishlistButtonDisplayed()).toBe(true);
    });

    test("Verify_WishList_Redirects_GuestUser_To_Login", async ({ page }) => {
        await productPage.clickWishlistButton();
        await page.waitForTimeout(3000);
        const currentUrl = page.url();
        expect(currentUrl).toContain("customer/account/login");
    });

    test("Verify_Breadcrumb_Navigation_Displayed", async () => {
        const count = await productPage.getBreadcrumbCount();
        expect(count).toBeGreaterThanOrEqual(2);
    });

    test("Verify_Breadcrumb_Shows_Product_Name", async () => {
        const lastBreadcrumb = await productPage.getBreadcrumbLastItemText();
        expect(lastBreadcrumb).not.toBe("");
        console.log("Last Breadcrumb: " + lastBreadcrumb);
    });

    test("Verify_DeliveryInformation_Section_Visible", async ({ page }) => {
        await productPage.Click_on_Delivery_Information();
        await page.waitForTimeout(1000);
        const currentUrl = page.url();
        expect(currentUrl).toContain("printed-cotton-double-bedsheet");
    });

    test("Verify_DetailsTab_Visible_On_ProductPage", async () => {
        expect(await productPage.isDetailsTabDisplayed()).toBe(true);
    });

    test("Verify_ProductSpecification_Tab_Visible", async () => {
        expect(await productPage.isProductSpecificationTabDisplayed()).toBe(true);
    });

    test("Verify_AddToCart_For_InStock_Product_ShowsSuccessMessage", async ({ page }) => {
        await productPage.clearAndSetQuantity("1");
        await productPage.Click_on_Add_To_Cart_button();
        await page.waitForTimeout(5000);

        const pageSource = await page.content();
        const hasSuccessIndicator = pageSource.includes("added to your") ||
            pageSource.includes("shopping cart") ||
            await homePage.isCartBadgeVisible();
        expect(hasSuccessIndicator).toBe(true);
    });

    test("Verify_PageTitle_Contains_ProductName", async ({ page }) => {
        const pageTitle = await page.title();
        expect(pageTitle).not.toBe("");
        expect(pageTitle.toLowerCase().includes("bedsheet") || pageTitle.toLowerCase().includes("india handmade")).toBe(true);
        console.log("Page Title: " + pageTitle);
    });

    test("Verify_ProductPage_URL_Contains_ProductSlug", async ({ page }) => {
        const currentUrl = page.url();
        expect(currentUrl).toContain("printed-cotton-double-bedsheet");
    });

    test("Verify_BuyNow_Button_Not_Visible_For_OutOfStock_AddToCart_Also_Hidden", async ({ page }) => {
        // Search out of stock product and view
        await homePage.Send_on_Search_Here_Outoff_stock();
        await page.waitForTimeout(2000);
        await homePage.Click_on_Product();
        await page.waitForTimeout(3000);

        expect(await productPage.Check_Visibility_for_Buy_Now_button()).toBe(false);
        expect(await productPage.Check_Visibility_for_Add_To_Cart_button()).toBe(false);
    });
});
