import { test, expect } from "@playwright/test";
import { Homepagesteps } from "../../page-objects/page-steps/Home-page-steps";
import { LoginWithOtpSteps } from "../../page-objects/page-steps/login-with-otp-steps";
import { MyAccountSteps } from "../../page-objects/page-steps/my-account-steps";
import { MyOrderSteps } from "../../page-objects/page-steps/my-order-steps";
import { config } from "../../utils/config-reader";

test.describe("Verify Buyer Order Listing Page Tests", () => {
    let homePage: Homepagesteps;
    let loginWithOtp: LoginWithOtpSteps;
    let myAccount: MyAccountSteps;
    let myOrder: MyOrderSteps;

    test.beforeEach(async ({ page }) => {
        test.setTimeout(180000);

        // Ensure BUYER_MOBILE is set in environment from config
        process.env.BUYER_MOBILE = config.buyerMobile || "9763274722";

        homePage = new Homepagesteps(page);
        loginWithOtp = new LoginWithOtpSteps(page);
        myAccount = new MyAccountSteps(page);
        myOrder = new MyOrderSteps(page);

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

        // Navigate to My Orders
        await myAccount.Click_on_My_Orders();
        await page.waitForTimeout(2000);
    });

    test("TC_01_Verify_Order_Listing_Page_Loads", async ({ page }) => {
        const url = page.url();
        expect(url).toContain("historynew");
        expect(url).toContain("order");
    });

    test("TC_02_Verify_Multiple_Orders_Displayed", async () => {
        const orderCount = await myOrder.getOrderListCount();
        expect(orderCount).toBeGreaterThan(0);
    });

    test("TC_03_Verify_Order_Details_Visibility", async () => {
        if (await myOrder.getOrderListCount() > 0) {
            const orderId = await myOrder.getOrderIdByIndex(0);
            const orderDate = await myOrder.getOrderDateByIndex(0);
            const orderStatus = await myOrder.getOrderStatusByIndex(0);

            expect(orderId).not.toBe("");
            expect(orderDate).not.toBe("");
            expect(orderStatus).not.toBe("");
        }
    });

    test("TC_04_Verify_Order_Status_Values_Are_Valid", async () => {
        if (await myOrder.getOrderListCount() > 0) {
            const orderStatus = await myOrder.getOrderStatusByIndex(0);
            const validStatuses = ["Processing", "Pending", "Shipped", "Cancelled", "Invoiced", "Waiting Pickup"];
            const isValid = validStatuses.some(status => orderStatus.toLowerCase() === status.toLowerCase());
            expect(isValid).toBe(true);
        }
    });

    test("TC_05_Verify_Product_Details_Displayed", async () => {
        if (await myOrder.getOrderListCount() > 0) {
            const productName = await myOrder.getProductNameByIndex(0);
            const sku = await myOrder.getSKUByIndex(0);
            const quantity = await myOrder.getOrderedQuantityByIndex(0);
            const color = await myOrder.getColorByIndex(0);

            expect(productName).not.toBe("");
            expect(sku).not.toBe("");
            expect(quantity).not.toBe("");
            expect(color).not.toBe("");
        }
    });

    test("TC_06_Verify_Seller_Information_Displayed", async () => {
        if (await myOrder.getOrderListCount() > 0) {
            const sellerName = await myOrder.getSellerNameByIndex(0);
            expect(sellerName).not.toBe("");
        }
    });

    test("TC_07_Verify_Order_Total_Price_Displayed", async () => {
        if (await myOrder.getOrderListCount() > 0) {
            const orderTotal = await myOrder.getOrderTotalByIndex(0);
            expect(orderTotal).not.toBe("");
            expect(orderTotal.includes("₹") || orderTotal.includes("Rs")).toBe(true);
        }
    });

    test("TC_08_Verify_Ship_To_Address_Displayed", async () => {
        if (await myOrder.getOrderListCount() > 0) {
            const shipToAddress = await myOrder.getShipToAddressByIndex(0);
            expect(shipToAddress).not.toBe("");
        }
    });

    test("TC_09_Verify_Track_Order_Button_Visibility_For_Shipped", async () => {
        if (await myOrder.getOrderListCount() > 0) {
            const orderStatus = await myOrder.getOrderStatusByIndex(0);
            if (orderStatus.toLowerCase() === "shipped" || orderStatus.toLowerCase() === "waiting pickup") {
                const isTrackOrderVisible = await myOrder.isTrackOrderButtonVisibleByIndex(0);
                expect(isTrackOrderVisible).toBe(true);
            }
        }
    });

    test("TC_10_Verify_Reorder_Button_Visibility", async () => {
        if (await myOrder.getOrderListCount() > 0) {
            const orderStatus = await myOrder.getOrderStatusByIndex(0);
            if (orderStatus.toLowerCase() !== "processing" && orderStatus.toLowerCase() !== "pending") {
                const isReorderVisible = await myOrder.isReorderButtonVisibleByIndex(0);
                expect(isReorderVisible).toBe(true);
            }
        }
    });

    test("TC_11_Verify_Raise_Query_Button_Visibility", async () => {
        if (await myOrder.getOrderListCount() > 0) {
            const isRaiseQueryVisible = await myOrder.isRaiseQueryButtonVisibleByIndex(0);
            expect(isRaiseQueryVisible).toBe(true);
        }
    });

    test("TC_12_Verify_Cancel_Item_Button_For_Processing_Orders", async () => {
        if (await myOrder.getOrderListCount() > 0) {
            const orderStatus = await myOrder.getOrderStatusByIndex(0);
            if (orderStatus.toLowerCase() === "processing") {
                const isCancelItemVisible = await myOrder.isCancelItemButtonVisibleByIndex(0);
                expect(isCancelItemVisible).toBe(true);
            }
        }
    });

    test("TC_13_Verify_Download_Invoice_Button_For_Invoiced_Orders", async () => {
        if (await myOrder.getOrderListCount() > 0) {
            const orderStatus = await myOrder.getOrderStatusByIndex(0);
            if (orderStatus.toLowerCase() === "invoiced") {
                const isInvoiceVisible = await myOrder.isDownloadInvoiceButtonVisibleByIndex(0);
                expect(isInvoiceVisible).toBe(true);
            }
        }
    });

    test("TC_14_Verify_Multiple_Orders_Distinct_Information", async () => {
        const orderCount = await myOrder.getOrderListCount();
        if (orderCount >= 2) {
            const orderId1 = await myOrder.getOrderIdByIndex(0);
            const orderId2 = await myOrder.getOrderIdByIndex(1);
            expect(orderId1).not.toBe(orderId2);
        }
    });

    test("TC_15_Verify_Order_Date_Format", async () => {
        if (await myOrder.getOrderListCount() > 0) {
            const orderDate = await myOrder.getOrderDateByIndex(0);
            expect(orderDate).toMatch(/.*\d{1,4}.*-.*\d{1,4}.*|.*\d{1,4}\/.*\d{1,4}.*/);
        }
    });

    test("TC_16_Verify_Order_ID_Format", async () => {
        if (await myOrder.getOrderListCount() > 0) {
            const orderId = await myOrder.getOrderIdByIndex(0);
            expect(orderId).toMatch(/^\d+$/);
        }
    });

    test("TC_17_Verify_Track_Order_Navigation", async ({ page }) => {
        if (await myOrder.getOrderListCount() > 0) {
            const orderStatus = await myOrder.getOrderStatusByIndex(0);
            if (orderStatus.toLowerCase() === "shipped" || orderStatus.toLowerCase() === "waiting pickup") {
                await myOrder.clickTrackOrderByIndex(0);
                await page.waitForTimeout(1000);
                expect(page.url()).toContain("track");
                await page.goBack();
                await page.waitForTimeout(500);
            }
        }
    });

    test("TC_18_Verify_Order_Quantity_Format", async () => {
        if (await myOrder.getOrderListCount() > 0) {
            const quantity = await myOrder.getOrderedQuantityByIndex(0);
            expect(quantity).toMatch(/^\d+$/);
        }
    });

    test("TC_19_Verify_SKU_Format", async () => {
        if (await myOrder.getOrderListCount() > 0) {
            const sku = await myOrder.getSKUByIndex(0);
            expect(sku).toMatch(/^[a-zA-Z0-9]+$/);
        }
    });

    test("TC_20_Verify_Raise_Query_Button_Navigation", async ({ page }) => {
        if (await myOrder.getOrderListCount() > 0) {
            await myOrder.clickRaiseQueryByIndex(0);
            await page.waitForTimeout(1000);
            const currentUrl = page.url();
            expect(currentUrl.includes("raise") || currentUrl.includes("query")).toBe(true);
            await page.goBack();
            await page.waitForTimeout(500);
        }
    });

    test("TC_21_Verify_Filter_Dropdowns_Visible", async () => {
        expect(await myOrder.isOrderNumberFilterVisible()).toBe(true);
        expect(await myOrder.isStatusFilterVisible()).toBe(true);
        expect(await myOrder.isDateRangeFilterVisible()).toBe(true);
        expect(await myOrder.isSearchOrderInputVisible()).toBe(true);
        expect(await myOrder.isSearchButtonVisible()).toBe(true);
    });

    test("TC_22_Verify_Order_Number_Sort_DESC", async ({ page }) => {
        await myOrder.selectOrderNumberSort("DESC");
        await page.waitForTimeout(1000);
        expect(await myOrder.verifyOrdersSortedByIdDescending()).toBe(true);
    });

    test("TC_23_Verify_Order_Number_Sort_ASC", async ({ page }) => {
        await myOrder.selectOrderNumberSort("ASC");
        await page.waitForTimeout(1000);
        expect(await myOrder.verifyOrdersSortedByIdAscending()).toBe(true);
    });

    test("TC_24_Verify_Status_Filter_Options_Available", async () => {
        const statusOptions = await myOrder.getAvailableStatusFilters();
        expect(statusOptions.length).toBeGreaterThan(0);
        const hasAll = statusOptions.some(opt => opt.toLowerCase() === "all");
        expect(hasAll).toBe(true);
    });

    test("TC_25_Verify_Date_Range_Filter_Options_Available", async () => {
        const dateOptions = await myOrder.getAvailableDateRangeFilters();
        expect(dateOptions.length).toBeGreaterThan(0);
        const hasValidDate = dateOptions.some(d => d.includes("Month") || d.includes("2025") || d.includes("2024"));
        expect(hasValidDate).toBe(true);
    });

    test("TC_26_Verify_Status_Filter_Processing", async ({ page }) => {
        await myOrder.selectStatusFilter("Processing");
        await page.waitForTimeout(1000);
        const count = await myOrder.getOrderListCount();
        expect(count).toBeGreaterThanOrEqual(0);
    });

    test("TC_27_Verify_Status_Filter_Delivered", async ({ page }) => {
        await myOrder.selectStatusFilter("Delivered");
        await page.waitForTimeout(1000);
        const count = await myOrder.getOrderListCount();
        expect(count).toBeGreaterThanOrEqual(0);
    });

    test("TC_28_Verify_Status_Filter_Cancelled", async ({ page }) => {
        await myOrder.selectStatusFilter("Cancelled");
        await page.waitForTimeout(1000);
        if (await myOrder.getOrderListCount() > 0) {
            const firstStatus = await myOrder.getOrderStatusByIndex(0);
            expect(firstStatus.toLowerCase()).toBe("cancelled");
        }
    });

    test("TC_29_Verify_Date_Range_Filter_6_Months", async ({ page }) => {
        await myOrder.selectDateRangeFilter("Last 6 Months");
        await page.waitForTimeout(1000);
        const count = await myOrder.getOrderListCount();
        expect(count).toBeGreaterThanOrEqual(0);
    });

    test("TC_30_Verify_Date_Range_Filter_2025", async ({ page }) => {
        await myOrder.selectDateRangeFilter("2025");
        await page.waitForTimeout(1000);
        const count = await myOrder.getOrderListCount();
        expect(count).toBeGreaterThanOrEqual(0);
    });

    test("TC_31_Verify_Date_Range_Filter_2024", async ({ page }) => {
        await myOrder.selectDateRangeFilter("2024");
        await page.waitForTimeout(1000);
        const count = await myOrder.getOrderListCount();
        expect(count).toBeGreaterThanOrEqual(0);
    });

    test("TC_32_Verify_Search_With_Valid_Order_Number", async ({ page }) => {
        if (await myOrder.getOrderListCount() > 0) {
            const orderId = await myOrder.getOrderIdByIndex(0);
            if (orderId !== "") {
                await myOrder.clearSearchInput();
                await myOrder.searchOrderByNumber(orderId);
                await page.waitForTimeout(1000);
                const orderCount = await myOrder.getOrderListCount();
                expect(orderCount).toBeGreaterThan(0);
            }
        }
    });

    test("TC_33_Verify_Search_With_Invalid_Order_Number", async ({ page }) => {
        await myOrder.clearSearchInput();
        await myOrder.searchOrderByNumber("999999999");
        await page.waitForTimeout(1000);
        const orderCount = await myOrder.getOrderListCount();
        const noOrdersMsg = await myOrder.isNoOrdersMessageDisplayed();
        expect(orderCount === 0 || noOrdersMsg).toBe(true);
    });

    test("TC_34_Verify_Current_Filter_Values", async () => {
        const currentSort = await myOrder.getCurrentOrderNumberSort();
        const currentStatus = await myOrder.getCurrentStatusFilter();
        const currentDateRange = await myOrder.getCurrentDateRangeFilter();

        expect(currentSort).not.toBe("");
        expect(currentStatus).not.toBe("");
        expect(currentDateRange).not.toBe("");
    });

    test("TC_35_Verify_Filter_All_Shows_All_Orders", async ({ page }) => {
        await myOrder.selectStatusFilter("All");
        await page.waitForTimeout(1000);
        const count = await myOrder.getOrderListCount();
        expect(count).toBeGreaterThan(0);
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
