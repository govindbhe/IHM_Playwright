import { test, expect } from "@playwright/test";
import { config } from "../../utils/config-reader";
import { SanityReportHelper } from "../../utils/excel-util";

test.describe("Thumbnail Images Tests", () => {
    let baseUrl: string;

    test.beforeEach(async ({ page }) => {
        test.setTimeout(300000);
        baseUrl = config.url || "https://www.indiahandmade.com/";
    });

    /**
     * Builds a listing URL for a specific page. Paging via the `p` query param is
     * deterministic, unlike clicking the pager: Magento renders the pagination
     * toolbar twice (top and bottom), so a text-based span locator matches multiple
     * elements and trips strict mode.
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
     * Navigates to a listing page, retrying on transient failures.
     *
     * A sustained scan of this site gets rate-limited: pages intermittently answer
     * HTTP 403 partway through a long run. Retrying with backoff recovers, and giving
     * `goto` its own timeout stops one slow page from consuming the whole test budget.
     *
     * Returns the final HTTP status, or undefined if navigation never completed.
     */
    const gotoListingPage = async (page: any, url: string, attempts = 3): Promise<number | undefined> => {
        let lastStatus: number | undefined;

        for (let attempt = 1; attempt <= attempts; attempt++) {
            try {
                const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
                lastStatus = response?.status();

                if (lastStatus && lastStatus < 400) {
                    // Wait for the grid itself rather than sleeping a fixed interval.
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

    const verifyThumbnailProducts = async (page: any, urlPath: string, categoryName: string, totalProductsXpath: string, productsPerPage: number = 240) => {
        console.log(`** Checking ${categoryName} Categoried Products Thumbnail **`);

        const firstPageUrl = buildPageUrl(urlPath, 1);
        const firstStatus = await gotoListingPage(page, firstPageUrl);

        if (!firstStatus || firstStatus >= 400) {
            // Fail loudly. Reporting 0 products for a whole category would be a false
            // all-clear from a test whose entire purpose is catalogue assurance.
            throw new Error(
                `${categoryName}: listing page returned HTTP ${firstStatus ?? "no response"} after retries ` +
                `(${firstPageUrl}). The site rate-limits sustained scans, so re-run this category on its own.`
            );
        }

        await page.waitForTimeout(2000);

        // Prefer the page size actually applied by the limiter over the caller's
        // assumption, so the page-count maths matches what the site is serving.
        let perPage = productsPerPage;
        let appliedLimit: number | undefined;

        const limiter = page.locator("//select[@id='limiter']").first();
        if (await limiter.isVisible().catch(() => false)) {
            await limiter.selectOption({ label: "240" }).catch(() => { });
            await page.waitForTimeout(3000);
            perPage = 240;
            appliedLimit = 240;
        }

        // Callers pass an indexed xpath such as "(//span[@class='toolbar-number'])[3]",
        // which assumes the multi-page toolbar "Items 1-240 of 685" (three spans).
        // A category that fits on a single page after the limiter is applied renders
        // only one span ("221 Items"), so [3] matches nothing. Fall back to the
        // un-indexed form and take the largest number, which is the total in both
        // layouts.
        const unindexedXpath = totalProductsXpath.replace(/^\((.*)\)\s*\[\d+\]$/, "$1");

        const readNumbers = async (xpath: string): Promise<number[]> => {
            const texts: string[] = await page.locator(xpath).allTextContents().catch(() => [] as string[]);
            return texts
                .map((t) => parseInt(t.replace(/[^0-9]/g, ""), 10))
                .filter((n) => Number.isFinite(n));
        };

        let totalTexts = await readNumbers(totalProductsXpath);
        if (!totalTexts.length && unindexedXpath !== totalProductsXpath) {
            console.log(`   "${totalProductsXpath}" matched nothing, falling back to "${unindexedXpath}"`);
            totalTexts = await readNumbers(unindexedXpath);
        }

        const totalProducts = totalTexts.reduce((max: number, n: number) => (n > max ? n : max), 0);

        if (totalProducts <= 0) {
            throw new Error(
                `${categoryName}: could not read a product total from "${totalProductsXpath}" ` +
                `(raw: ${JSON.stringify(totalTexts)}). The page loaded with HTTP ${firstStatus}, so this is ` +
                `a selector/markup mismatch rather than an empty category.`
            );
        }

        const totalPages = Math.ceil(totalProducts / perPage);

        console.log(`Total Products: ${totalProducts}`);
        SanityReportHelper.setTotalProducts(categoryName, totalProducts);
        console.log(`Total Pages (${perPage} Products per page): ${totalPages}`);

        // Scale the budget to the work discovered. A fixed 300s cannot cover large
        // categories: Women's is 52 pages at roughly 13s each. Measured ~13s/page,
        // so 25s/page plus overhead leaves comfortable margin.
        test.setTimeout(Math.max(300000, totalPages * 25000 + 120000));

        const unreachablePages: number[] = [];

        for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
            // Navigate directly to each page after the first.
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

            try {
                const placeholderSrc = "https://img.indiahandmade.com/catalog/product/placeholder/default/ih_4.png";
                const noThumbnailLocators = page.locator(`//img[@src='${placeholderSrc}']`);
                const count = await noThumbnailLocators.count();

                for (let i = 1; i <= count; i++) {
                    const thumb = page.locator(`((//img[@src='${placeholderSrc}'])[${i}]//parent::span//parent::span//parent::a//following-sibling::div//a)[1]`);
                    if (await thumb.isVisible()) {
                        const thumbText = (await thumb.textContent())?.trim() || "";
                        console.log(`⚠️ Thumbnail Missing For: ${thumbText}`);
                        SanityReportHelper.addMissingThumbnail(categoryName, thumbText);
                    }
                }
            } catch (err) {
                console.log(err);
            }
        }

        // Surface partial coverage instead of passing on an incomplete scan.
        if (unreachablePages.length) {
            throw new Error(
                `${categoryName}: scanned ${totalPages - unreachablePages.length}/${totalPages} pages. ` +
                `Pages unreachable after retries: ${unreachablePages.join(", ")}. ` +
                `Thumbnail results for this category are incomplete.`
            );
        }
    };

    test("TC_001_Verify_HomeAndLivingPage_Thumbnail_Products", async ({ page }) => {
        await verifyThumbnailProducts(
            page,
            "home-and-living.html?p=1",
            "Home and Living",
            "(//span[@class='toolbar-number'])[3]"
        );
    });

    test("TC_002_Verify_WomenPage_Thumbnail_Products", async ({ page }) => {
        await verifyThumbnailProducts(
            page,
            "indian-womens-wear-online.html?p=1",
            "Women's",
            "(//span[@class='toolbar-number'])[3]"
        );
    });

    test("TC_003_Verify_KidsPage_Thumbnail_Products", async ({ page }) => {
        await verifyThumbnailProducts(
            page,
            "kids.html?p=1",
            "Kids",
            "(//span[@class='toolbar-number'])[3]"
        );
    });

    test("TC_004_Verify_MenPage_Thumbnail_Products", async ({ page }) => {
        await verifyThumbnailProducts(
            page,
            "men-s-wear.html?p=1",
            "Men",
            "(//span[@class='toolbar-number'])[3]"
        );
    });

    test("TC_005_Verify_FurniturePage_Thumbnail_Products", async ({ page }) => {
        await verifyThumbnailProducts(
            page,
            "handmade-wooden-bamboo-furniture-bamboo-cane-furniture.html?p=1",
            "Furniture",
            "(//span[@class='toolbar-number'])[3]"
        );
    });

    test("TC_006_Verify_PaintingPage_Thumbnail_Products", async ({ page }) => {
        await verifyThumbnailProducts(
            page,
            "catalog/category/view/s/paintings/id/481/?p=1",
            "Painting",
            "(//span[@class='toolbar-number'])[3]"
        );
    });

    test("TC_007_Verify_ODOP_Page_Thumbnail_Products", async ({ page }) => {
        await verifyThumbnailProducts(
            page,
            "gigoods/index/odop?p=1",
            "ODOP",
            "(//span[@class='toolbar-number'])",
            48 // Custom products per page from original Java code
        );
    });

    test("TC_008_Verify_GIPage_Thumbnail_Products", async ({ page }) => {
        await verifyThumbnailProducts(
            page,
            "gigoods/index?p=1",
            "Gi Tagged",
            "(//span[@class='toolbar-number'])"
        );
    });
});
