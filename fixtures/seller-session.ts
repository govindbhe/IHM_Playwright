import { test as base, expect, Browser, BrowserContext, Page } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import { Homepagesteps } from "../page-objects/page-steps/Home-page-steps";
import { SellerLoginSteps } from "../page-objects/page-steps/seller-login-steps";
import { config } from "../utils/config-reader";

/** Saved seller cookies/localStorage. Already covered by .gitignore (/playwright/.auth/). */
const AUTH_FILE = path.resolve(__dirname, "..", "playwright", ".auth", "seller.json");

/** A seller-only page; an unauthenticated visit is redirected to the login form. */
const SELLER_DASHBOARD_PATH = "marketplace/account/dashboard/";

type SellerWorkerFixtures = {
    /** A seller-authenticated page, shared by every test in the worker. */
    sellerPage: Page;
};

const dashboardUrl = (): string => {
    const base = config.url.endsWith("/") ? config.url : config.url + "/";
    return base + SELLER_DASHBOARD_PATH;
};

/** True when the context's saved session still has an authenticated seller. */
async function isSessionValid(page: Page): Promise<boolean> {
    try {
        await page.goto(dashboardUrl(), { waitUntil: "domcontentloaded", timeout: 60000 });
        return !/customer\/account\/login|marketplace\/account\/login/.test(page.url());
    } catch {
        return false;
    }
}

async function loginAndSaveState(browser: Browser): Promise<BrowserContext> {
    if (!config.sellerEmail || !config.sellerPassword) {
        throw new Error(
            "Seller credentials are not configured. Set SELLER_EMAIL and SELLER_PASSWORD in .env."
        );
    }

    const context = await browser.newContext();
    const page = await context.newPage();

    const homePage = new Homepagesteps(page);
    const sellerLogin = new SellerLoginSteps(page);

    await page.goto(config.url);
    await homePage.Click_on_Vendar_LogIn();
    await sellerLogin.enter_email(config.sellerEmail);
    await sellerLogin.enter_Password(config.sellerPassword);
    await sellerLogin.Click_on_Sign_In_Button();
    await page.waitForLoadState("domcontentloaded");

    fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });
    await context.storageState({ path: AUTH_FILE });
    console.log("✓ Seller login performed and session saved to playwright/.auth/seller.json");

    await page.close();
    return context;
}

/**
 * Test object providing a seller-authenticated page with a **single** login shared by
 * every test, including across worker restarts.
 *
 * Two problems this solves:
 *
 * 1. Login in `beforeEach` re-authenticated before each of a spec's tests, because
 *    Playwright gives every test a fresh isolated `page`.
 * 2. A worker-scoped fixture alone is not enough: Playwright discards the worker
 *    process after any test failure and starts a new one, re-running worker fixtures.
 *    In a spec with failures that meant one login per failure.
 *
 * Persisting `storageState` to disk fixes both: the first worker logs in and saves the
 * session, and any later worker restores it. The saved state is revalidated against a
 * seller-only page and refreshed automatically if it has expired.
 *
 * The built-in `page` fixture is overridden, so specs keep using `async ({ page })`.
 *
 * Trade-off: browser state is shared across tests in a worker, so reset what matters in
 * `beforeEach` (normally a `goto` of the page under test). Not for tests that require a
 * clean, unauthenticated session.
 */
export const test = base.extend<{}, SellerWorkerFixtures>({
    sellerPage: [
        async ({ browser }, use) => {
            let context: BrowserContext | undefined;
            let page: Page | undefined;

            // Reuse a previously saved session when it is still valid.
            if (fs.existsSync(AUTH_FILE)) {
                const restored = await browser.newContext({ storageState: AUTH_FILE });
                const restoredPage = await restored.newPage();

                if (await isSessionValid(restoredPage)) {
                    console.log("✓ Reused saved seller session (no login needed)");
                    context = restored;
                    page = restoredPage;
                } else {
                    console.log("Saved seller session expired, logging in again");
                    await restored.close();
                }
            }

            if (!context) {
                context = await loginAndSaveState(browser);
                page = await context.newPage();
            }

            await use(page!);

            await context.close();
        },
        { scope: "worker", timeout: 180000 },
    ],

    // Override the built-in per-test `page` with the shared authenticated one.
    page: async ({ sellerPage }, use) => {
        await use(sellerPage);
    },
});

export { expect };
