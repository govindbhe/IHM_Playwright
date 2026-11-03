import { test as base, expect, Page } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import { config } from "../utils/config-reader";

/** Session captured by utils/seed-buyer-auth.ts. Covered by .gitignore (/playwright/.auth/). */
export const BUYER_AUTH_FILE = path.resolve(__dirname, "..", "playwright", ".auth", "buyer.json");

export const buyerAuthExists = (): boolean => fs.existsSync(BUYER_AUTH_FILE);

export const BUYER_AUTH_MISSING_REASON =
    "No saved buyer session. Buyer login is OTP-only, so run `npx tsx utils/seed-buyer-auth.ts` " +
    "and complete the OTP login once to create playwright/.auth/buyer.json";

type BuyerWorkerFixtures = {
    /** A buyer-authenticated page, restored from the seeded session. */
    buyerPage: Page;
};

/**
 * Test object providing a buyer-authenticated page with **no login per test**.
 *
 * Buyer auth cannot be automated: the customer login page offers only OTP delivery,
 * with no password form. So the session is seeded once by hand
 * (utils/seed-buyer-auth.ts) and restored here from disk.
 *
 * Restoring from `storageState` also means a worker restart costs nothing. Playwright
 * discards the worker after any test failure, so a fixture that logged in would
 * re-authenticate once per failure.
 *
 * The built-in `page` fixture is overridden, so specs keep using `async ({ page })`.
 */
export const test = base.extend<{}, BuyerWorkerFixtures>({
    buyerPage: [
        async ({ browser }, use) => {
            if (!buyerAuthExists()) {
                throw new Error(BUYER_AUTH_MISSING_REASON);
            }

            const context = await browser.newContext({ storageState: BUYER_AUTH_FILE });
            const page = await context.newPage();

            const baseUrl = config.url.endsWith("/") ? config.url : config.url + "/";
            await page.goto(baseUrl + "customer/account/", { waitUntil: "domcontentloaded" });

            if (/account\/login/.test(page.url())) {
                await context.close();
                throw new Error(
                    "The saved buyer session has expired. Re-run `npx tsx utils/seed-buyer-auth.ts` " +
                    "to refresh playwright/.auth/buyer.json"
                );
            }

            console.log("✓ Reused seeded buyer session (no OTP login needed)");

            await use(page);

            await context.close();
        },
        { scope: "worker", timeout: 120000 },
    ],

    page: async ({ buyerPage }, use) => {
        await use(buyerPage);
    },
});

export { expect };
