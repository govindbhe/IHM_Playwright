/**
 * One-time buyer session seeder.
 *
 * Buyer login on this site is OTP-only (the customer login page exposes just
 * "Get OTP" - there is no password form), and the OTP is delivered out of band.
 * Rather than automating the OTP, log in by hand once here and reuse the resulting
 * session for every buyer spec.
 *
 * Usage:
 *   npx tsx utils/seed-buyer-auth.ts
 *
 * A browser window opens on the buyer login page. Complete the OTP login yourself.
 * As soon as the site reports you signed in, the session is written to
 * playwright/.auth/buyer.json and the browser closes.
 *
 * Re-run whenever the saved session expires.
 */
import { chromium } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import { config } from "./config-reader";

const AUTH_FILE = path.resolve(__dirname, "..", "playwright", ".auth", "buyer.json");
const WAIT_MINUTES = 5;

const base = (): string => (config.url.endsWith("/") ? config.url : config.url + "/");

(async () => {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        // A realistic UA avoids the intermittent 403 the default headless UA can trigger.
        userAgent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    });
    const page = await context.newPage();

    await page.goto(base() + "customer/account/login/", { waitUntil: "domcontentloaded" });

    console.log("");
    console.log("=".repeat(72));
    console.log(" Complete the buyer OTP login in the browser window that just opened.");
    if (config.buyerMobile) {
        console.log(` Buyer mobile from .env: ${config.buyerMobile}`);
    }
    console.log(` Waiting up to ${WAIT_MINUTES} minutes for sign-in to complete...`);
    console.log("=".repeat(72));
    console.log("");

    const deadline = Date.now() + WAIT_MINUTES * 60_000;
    let signedIn = false;

    while (Date.now() < deadline) {
        // Signed in once we are on a customer page that is not the login form.
        const url = page.url();
        if (/\/customer\//.test(url) && !/account\/login/.test(url)) {
            signedIn = true;
            break;
        }
        await page.waitForTimeout(2000);
    }

    if (!signedIn) {
        // Last chance: the account dashboard redirects to login when unauthenticated.
        await page.goto(base() + "customer/account/", { waitUntil: "domcontentloaded" }).catch(() => { });
        signedIn = !/account\/login/.test(page.url());
    }

    if (!signedIn) {
        console.error("");
        console.error("✗ Sign-in was not detected. Nothing saved. Re-run and complete the OTP login.");
        await browser.close();
        process.exit(1);
    }

    fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });
    await context.storageState({ path: AUTH_FILE });

    console.log("");
    console.log(`✓ Buyer session saved to playwright/.auth/buyer.json`);
    console.log("  The buyer specs will now reuse this session. Re-run this script when it expires.");
    console.log("");

    await browser.close();
})();
