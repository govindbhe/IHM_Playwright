import { test, expect } from "@playwright/test";
import { ProductListingSteps } from "../../page-objects/page-steps/product-listing-steps";
import { config } from "../../utils/config-reader";
import { SanityReportHelper } from "../../utils/excel-util";

test.describe("Zero Prices Products Tests", () => {
    let baseUrl: string;

    test.beforeEach(async ({ page }) => {
        test.setTimeout(300000);
        baseUrl = config.url || "https://www.indiahandmade.com/";
    });

    /**
     * Builds a listing URL for a specific page. Paging via the `p` query param is
     * deterministic; clicking the pager is not. Magento renders the pagination toolbar
     * twice, and an unscoped `//span[text()='2']` also matches price and count spans,
     * so `.first()` silently clicked a non-pager element and the page never advanced -
     * which is why the same products were reported once per "page".
     */
    const buildPageUrl = (urlPath: string, pageNo: number, limit?: number): string => {
        const url = new URL(urlPath, baseUrl.endsWith("/") ? baseUrl : baseUrl + "/");
        url.searchParams.set("p", String(pageNo));
        if (limit) {
            url.searchParams.set("product_list_limit", String(limit));
        }
        return url.toString();
    };

    /**
     * Navigates to a listing page, retrying transient failures. Sustained scans of this
     * site get rate-limited and intermittently answer HTTP 403; a dedicated `goto`
     * timeout also stops one slow page consuming the whole test budget.
     */
    const gotoListingPage = async (page: any, url: string, attempts = 3): Promise<number | undefined> => {
        let lastStatus: number | undefined;

        for (let attempt = 1; attempt <= attempts; attempt++) {
            try {
                const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
                lastStatus = response?.status();

                if (lastStatus && lastStatus < 400) {
                    await page
                        .locator("li.item.product, .product-item")
                        .first()
                        .waitFor({ state: "attached", timeout: 20000 })
                        .catch(() => { });
                    return lastStatus;
                }

                console.log(`   HTTP ${lastStatus} on attempt ${attempt}/${attempts}, backing off`);
            } catch (err) {
                console.log(`   navigation error on attempt ${attempt}/${attempts}: ${(err as Error).message.split("\n")[0]}`);
            }

            if (attempt < attempts) {
                await page.waitForTimeout(5000 * attempt);
            }
        }

        return lastStatus;
    };

    const verifyCategoryZeroPriceProducts = async (
        page: any,
        urlPath: string,
        categoryName: string,
        totalProductsXpath: string,
        productsPerPage: number = 240
    ) => {
        console.log(`**-Checking ${categoryName} Categoried Zero/Null Price Products-**`);

        const firstPageUrl = buildPageUrl(urlPath, 1);
        const firstStatus = await gotoListingPage(page, firstPageUrl);

        if (!firstStatus || firstStatus >= 400) {
            throw new Error(
                `${categoryName}: listing page returned HTTP ${firstStatus ?? "no response"} after retries ` +
                `(${firstPageUrl}). The site rate-limits sustained scans, so re-run this category on its own.`
            );
        }

        await page.waitForTimeout(2000);

        // Prefer the page size the limiter actually applied over the caller's assumption.
        let perPage = productsPerPage;
        let appliedLimit: number | undefined;

        const limiter = page.locator("//select[@id='limiter']").first();
        if (await limiter.isVisible().catch(() => false)) {
            await limiter.selectOption({ label: "240" }).catch(() => { });
            await page.waitForTimeout(3000);
            perPage = 240;
            appliedLimit = 240;
        }

        // The callers' positional indexes are unreliable in both directions: "[3]" assumes
        // the three-span multi-page toolbar ("Items 1-240 of 685") and matches nothing on a
        // single-page category, while "[1]" returns the range start ("1"). The total is
        // always the largest number across the toolbar-number spans, so read them all.
        const unindexedXpath = totalProductsXpath.replace(/^\((.*)\)\s*\[\d+\]$/, "$1");
        const totalTexts: string[] = await page.locator(unindexedXpath).allTextContents().catch(() => [] as string[]);
        const totalProducts = totalTexts
            .map((t) => parseInt(t.replace(/[^0-9]/g, ""), 10))
            .filter((n) => Number.isFinite(n))
            .reduce((max: number, n: number) => (n > max ? n : max), 0);

        if (totalProducts <= 0) {
            throw new Error(
                `${categoryName}: could not read a product total from "${unindexedXpath}" ` +
                `(raw: ${JSON.stringify(totalTexts)}). The page loaded with HTTP ${firstStatus}, so this is ` +
                `a selector/markup mismatch rather than an empty category.`
            );
        }

        const totalPages = Math.ceil(totalProducts / perPage);

        console.log(`Total Products: ${totalProducts}`);
        SanityReportHelper.setTotalProducts(categoryName, totalProducts);
        console.log(`Total Pages (${perPage} Products per page): ${totalPages}`);

        // Scale the budget to the work discovered; a flat 300s cannot cover 50+ pages.
        test.setTimeout(Math.max(300000, totalPages * 25000 + 120000));

        const productListingSteps = new ProductListingSteps(page);
        const unreachablePages: number[] = [];

        for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
            if (currentPage > 1) {
                const pageUrl = buildPageUrl(urlPath, currentPage, appliedLimit);
                console.log(`→ Page ${currentPage}/${totalPages}: ${pageUrl}`);

                const status = await gotoListingPage(page, pageUrl);
                if (!status || status >= 400) {
                    console.log(`   ⚠️ Skipping page ${currentPage}: HTTP ${status ?? "no response"} after retries`);
                    unreachablePages.push(currentPage);
                    continue;
                }
            }

            const zeroPriceNames = await productListingSteps.getZeroPriceProducts();
            for (const name of zeroPriceNames) {
                SanityReportHelper.addZeroPriceProduct(categoryName, name);
            }
        }

        // Surface partial coverage rather than passing on an incomplete scan.
        if (unreachablePages.length) {
            throw new Error(
                `${categoryName}: scanned ${totalPages - unreachablePages.length}/${totalPages} pages. ` +
                `Pages unreachable after retries: ${unreachablePages.join(", ")}. ` +
                `Zero-price results for this category are incomplete.`
            );
        }
    };

    test("Verify_HomeAndLivingPage_ZeroPrice_Products", async ({ page }) => {
        await verifyCategoryZeroPriceProducts(
            page,
            "home-and-living.html?p=1",
            "Home and Living",
            "(//span[@class='toolbar-number'])[3]"
        );
    });

    test("Verify_WomenPage_ZeroPrice_Products", async ({ page }) => {
        await verifyCategoryZeroPriceProducts(
            page,
            "indian-womens-wear-online.html?p=1",
            "Women's",
            "(//span[@class='toolbar-number'])[3]"
        );
    });

    test("Verify_MenPage_ZeroPrice_Products", async ({ page }) => {
        await verifyCategoryZeroPriceProducts(
            page,
            "men-s-wear.html?p=1",
            "Men",
            "(//span[@class='toolbar-number'])[3]"
        );
    });

    test("Verify_KidsPage_ZeroPrice_Products", async ({ page }) => {
        await verifyCategoryZeroPriceProducts(
            page,
            "kids.html?p=1",
            "Kids",
            "(//span[@class='toolbar-number'])[3]"
        );
    });

    test("Verify_Furniture_Product_Page_ZeroPrice_Products", async ({ page }) => {
        await verifyCategoryZeroPriceProducts(
            page,
            "handmade-wooden-bamboo-furniture-bamboo-cane-furniture.html?p=1",
            "Furniture",
            "(//span[@class='toolbar-number'])[3]"
        );
    });

    test("Verify_Painting_ProductPage_ZeroPrice_Products", async ({ page }) => {
        await verifyCategoryZeroPriceProducts(
            page,
            "catalog/category/view/s/paintings/id/481/?p=1",
            "Painting",
            "(//span[@class='toolbar-number'])[3]"
        );
    });

    test("Verify_ODOP_Product_Page_ZeroPrice_Products", async ({ page }) => {
        await verifyCategoryZeroPriceProducts(
            page,
            "gigoods/index/odop?p=1",
            "ODOP",
            "(//span[@class='toolbar-number'])[1]"
        );
    });

    test("Verify_GI_Product_Page_ZeroPrice_Products", async ({ page }) => {
        await verifyCategoryZeroPriceProducts(
            page,
            "gigoods/index?p=1",
            "Gi Tagged",
            "(//span[@class='toolbar-number'])[1]"
        );
    });
});
