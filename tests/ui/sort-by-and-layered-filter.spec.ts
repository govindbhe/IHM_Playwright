import { test, expect } from "@playwright/test";
import { Homepagesteps } from "../../page-objects/page-steps/Home-page-steps";
import { BuyerProductListingSteps } from "../../page-objects/page-steps/buyer-product-listing-steps";
import { config } from "../../utils/config-reader";

test.describe("Sort By and Layered Filter Tests", () => {
    let homePage: Homepagesteps;
    let productListingPage: BuyerProductListingSteps;
    let baseUrl: string;

    test.beforeEach(async ({ page }) => {
        test.setTimeout(180000);

        homePage = new Homepagesteps(page);
        productListingPage = new BuyerProductListingSteps(page);

        baseUrl = config.url || "https://www.indiahandmade.com/";
        await page.goto(baseUrl);
        await page.waitForTimeout(2000);

        // Click on Home & Living category
        await homePage.Click_on_Home_And_Living();
        await page.waitForTimeout(3000);
    });

    // Reset before each test case for test isolation
    test.beforeEach(async ({ page }) => {
        await page.goto(baseUrl + "home-and-living.html");
        await page.waitForTimeout(3000);
    });

    test("TC_001_Verify_Sort_By_High_To_Low", async ({ page }) => {
        // Select sorting High to Low
        await productListingPage.Click_on_sortByDropdown("high_to_low");
        await page.waitForTimeout(3000);

        // Verify sorting order
        await productListingPage.Verify_High_to_Low_SortBy();

        const firstPrice = await productListingPage.first_ProductPrice();
        const secondPrice = await productListingPage.second_ProductPrice();
        const thirdPrice = await productListingPage.third_ProductPrice();
        const fourthPrice = await productListingPage.fourth_ProductPrice();

        expect(firstPrice >= secondPrice && secondPrice >= thirdPrice && thirdPrice >= fourthPrice).toBe(true);
    });

    test("TC_002_Verify_Sort_By_Low_To_High", async ({ page }) => {
        // Select sorting Low to High
        await productListingPage.Click_on_sortByDropdown("low_to_high");
        await page.waitForTimeout(3000);

        // Verify sorting order
        await productListingPage.Verify_Low_to_High_SortBy();

        const firstPrice = await productListingPage.first_ProductPrice();
        const secondPrice = await productListingPage.second_ProductPrice();
        const thirdPrice = await productListingPage.third_ProductPrice();
        const fourthPrice = await productListingPage.fourth_ProductPrice();

        expect(firstPrice <= secondPrice && secondPrice <= thirdPrice && thirdPrice <= fourthPrice).toBe(true);
    });

    test("TC_003_Verify_Category_Filter", async ({ page }) => {
        // Get expected product count from the Category filter sidebar item before clicking
        const expectedCount = await productListingPage.Home_DecoreAndUtility_ProductCount();
        console.log("Expected Category Product Count: " + expectedCount);

        // Click on Category Filter: Home Décor and Utility
        await productListingPage.Click_on_CategoryFilter();
        await page.waitForTimeout(3000);

        // Verify URL changed or contains category filter query
        const currentUrl = page.url();
        expect(currentUrl.includes("home-decor-and-utility") || currentUrl.includes("cat=")).toBe(true);
    });

    test("TC_004_Verify_Fabric_Filter", async ({ page }) => {
        // Get expected product count from Fabric Cotton sidebar item before clicking
        const expectedCount = await productListingPage.FabricCotton_ProductCount();
        console.log("Expected Fabric Product Count: " + expectedCount);

        // Click on Fabric Filter: Cotton
        await productListingPage.Click_on_Fabric_cotton();
        await page.waitForTimeout(3000);

        // Verify URL changed to contain fabric filter query
        const currentUrl = page.url();
        expect(currentUrl.includes("cotton") || currentUrl.includes("fabric=")).toBe(true);
    });

    test("TC_005_Verify_State_Of_Origin_Filter", async ({ page }) => {
        // Get expected product count from State sidebar item before clicking
        const expectedCount = await productListingPage.State_ProductCount();
        console.log("Expected State Product Count: " + expectedCount);

        // Click on State Filter: Andhra Pradesh
        await productListingPage.Click_on_state_ap();
        await page.waitForTimeout(3000);

        // Verify URL changed to contain state filter query
        const currentUrl = page.url();
        expect(currentUrl.includes("andhra-pradesh") || currentUrl.includes("state")).toBe(true);
    });

    test.afterEach(async ({ page }) => {
        // Logout if user is logged in
        try {
            await homePage.Click_on_ProfileLink();
            await page.waitForTimeout(2000);
            await homePage.Click_on_LogoutButton();
        } catch (e) {
            console.log("User is guest / not logged in. Skipping logout sequence.");
        }
    });
});
