import { Page } from "@playwright/test";
import { Homepagesteps } from "../page-objects/page-steps/Home-page-steps";
import { SellerLoginSteps } from "../page-objects/page-steps/seller-login-steps";
import { webcommons } from "../commons/ui/web-common";
import sellerLoginElements from "../page-objects/page-elements/seller-login-elements.json" with { type: "json" };
import dashboardElements from "../page-objects/page-elements/dashboard-elements.json" with { type: "json" };
import homePageElements from "../page-objects/page-elements/home-page-elements.json" with { type: "json" };
import { config } from "./config-reader";

export interface SellerLoginAsBuyerOptions {
    /** Storefront base URL. Defaults to config.url. */
    url?: string;
    /** Seller email. Defaults to config.sellerEmail. */
    email?: string;
    /** Seller password. Defaults to config.sellerPassword. */
    password?: string;
    /** Timeout (ms) used for the waits in this flow. */
    timeout?: number;
}

/**
 * Logs in through the vendor/seller login form and then clicks the logo to land
 * back on the buyer-facing storefront while staying authenticated.
 *
 * This mirrors the flow already used inline in add-to-cart.spec.ts so specs can
 * share a single implementation instead of repeating it.
 */
export async function sellerLoginAsBuyer(
    page: Page,
    options: SellerLoginAsBuyerOptions = {}
): Promise<void> {
    const appUrl = options.url ?? config.url;
    const sellerEmail = options.email ?? config.sellerEmail;
    const sellerPassword = options.password ?? config.sellerPassword;
    const timeout = options.timeout ?? 30000;

    if (!sellerEmail || !sellerPassword) {
        throw new Error(
            "Seller credentials are missing. Set SELLER_EMAIL and SELLER_PASSWORD " +
            "(or seller_email/seller_password) in your .env before running this flow."
        );
    }

    const homePage = new Homepagesteps(page);
    const sellerLogin = new SellerLoginSteps(page);
    const web = new webcommons(page);

    // Navigate to the storefront and open the vendor login form
    await page.goto(appUrl);
    // A feedback/promo dialog sometimes opens on load and blocks every click.
    await web.dismissBlockingDialog();
    await homePage.Click_on_Vendar_LogIn();

    // Wait for the login form before typing, otherwise fill races the page load
    await page
        .locator(sellerLoginElements.emailInputXpath)
        .first()
        .waitFor({ state: "visible", timeout });

    await sellerLogin.enter_email(sellerEmail);
    await sellerLogin.enter_Password(sellerPassword);
    await sellerLogin.Click_on_Sign_In_Button();

    // Confirm the seller dashboard actually rendered before clicking the logo
    await page
        .locator(dashboardElements.products)
        .first()
        .waitFor({ state: "visible", timeout });

    console.log("✓ Seller login successful");

    await clickOnLogo(page, timeout);
}

/**
 * Clicks the logo to return to the buyer-facing storefront.
 *
 * The seller panel and the storefront use different logo elements, so this
 * tries the seller panel logo first and falls back to the storefront logo.
 */
export async function clickOnLogo(page: Page, timeout = 30000): Promise<void> {
    const storefrontUrl = config.url.endsWith("/") ? config.url : config.url + "/";
    // We are "on the storefront" when the URL is the site root (not a /marketplace/ or
    // /customer/ panel path).
    const onStorefront = (): boolean => {
        const u = page.url().replace(/[?#].*$/, "").replace(/\/$/, "");
        const root = storefrontUrl.replace(/\/$/, "");
        return u === root;
    };

    const candidates = [dashboardElements.sellerLogo, homePageElements.logo];

    for (const selector of candidates) {
        const logo = page.locator(selector).first();
        if (await logo.isVisible().catch(() => false)) {
            await logo.scrollIntoViewIfNeeded().catch(() => { });
            await logo.click({ timeout }).catch(() => { });
            await page.waitForLoadState("domcontentloaded").catch(() => { });
            await page.waitForTimeout(1500);
            if (onStorefront()) {
                console.log("✓ Clicked logo, now on buyer storefront");
                return;
            }
            console.log("Logo click did not land on storefront, falling back to direct navigation");
            break;
        }
    }

    // The seller-panel logo often keeps you inside the panel (SPA / stayed on dashboard).
    // Navigate to the storefront root directly — the session stays authenticated.
    await page.goto(storefrontUrl, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);

    if (!onStorefront()) {
        throw new Error(
            `Could not reach the buyer storefront. Current URL: ${page.url()}`
        );
    }
    console.log("✓ On buyer storefront (via direct navigation)");
}

export default sellerLoginAsBuyer;
