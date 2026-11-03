import { Page, expect } from "@playwright/test";
import sellerLoginElements from '../page-elements/seller-login-elements.json' with { type: 'json' };
import { webcommons } from "../../commons/ui/web-common";
import data from '../../testdata/ui/seller-data.json' with { type: 'json' };

export class SellerLoginSteps {
    page: Page;
    web: webcommons;

    constructor(page: Page) {
        this.page = page;
        this.web = new webcommons(this.page);
    }

    /**
     * Resolves the first candidate selector that actually becomes visible.
     *
     * The previous implementation probed with `count()`, which returns 0 while the
     * login form is still rendering. It then fell through to a CSS fallback selector
     * that does not exist on this site, and `web.fill` -> `scrollIntoViewIfNeeded()`
     * has no timeout, so that path hung until the whole test timed out.
     */
    private async resolveFirstVisible(candidates: string[], label: string, timeout = 20000) {
        for (const selector of candidates) {
            const element = this.page.locator(selector).first();
            try {
                await element.waitFor({ state: "visible", timeout });
                return element;
            } catch {
                // try the next candidate
            }
        }
        throw new Error(
            `Unable to locate ${label} on the seller login page. Tried: ${candidates.join(" , ")}`
        );
    }

    async enter_email(emailAddress: string): Promise<void> {
        const field = await this.resolveFirstVisible(
            [sellerLoginElements.emailInputXpath, sellerLoginElements.emailInput],
            "the email field"
        );
        await field.fill(emailAddress);
    }

    async enter_Password(pwd: string): Promise<void> {
        const field = await this.resolveFirstVisible(
            [sellerLoginElements.passwordInputXpath, sellerLoginElements.passwordInput],
            "the password field"
        );
        await field.fill(pwd);
    }

    async Click_on_Sign_In_Button(): Promise<void> {
        const button = await this.resolveFirstVisible(
            [sellerLoginElements.signInButtonXpath, sellerLoginElements.loginButton],
            "the Sign in button"
        );
        await button.scrollIntoViewIfNeeded().catch(() => { });
        await button.click();
    }

    async Click_on_forgate_your_Password(): Promise<void> {
        if (await this.page.locator(sellerLoginElements.forgotPasswordXpath).count()) {
            await this.web.clickonElement(sellerLoginElements.forgotPasswordXpath);
            return;
        }
        await this.web.clickonElement(sellerLoginElements.forgotPasswordLink);
    }

    async Create_new_Registration(): Promise<void> {
        await this.web.clickonElement(sellerLoginElements.newRegistrationXpath);
    }

    async enterEmail() {
        await this.web.fill(sellerLoginElements.emailInput, data.seller.email);
        console.log(`✓ Entered seller email: ${data.seller.email}`);
    }

    async enterPassword() {
        await this.web.fill(sellerLoginElements.passwordInput, data.seller.password);
        console.log(`✓ Entered seller password`);
    }

    async clickOnSignInButton() {
        await this.web.clickonElement(sellerLoginElements.loginButton);
        await this.page.waitForLoadState('networkidle');
        console.log("✓ Clicked on Sign In button");
    }

    async verifySuccessfulLogin() {
        await this.web.VerifyVisibility(sellerLoginElements.successMessage);
        console.log("✓ Seller login successful");
    }

    async loginAsSeller() {
        await this.enterEmail();
        await this.enterPassword();
        await this.clickOnSignInButton();
        console.log("✓ Seller login completed");
    }

    async verifyErrorMessage(expectedErrorText: string) {
        const errorMessage = await this.page.locator(sellerLoginElements.errorMessage).textContent();
        expect(errorMessage).toContain(expectedErrorText);
        console.log(`✓ Error message verified: ${errorMessage}`);
    }


    async Sellerlogin(){

        this.enterEmail();
        this.enterPassword();
        this.clickOnSignInButton();
    }
}
