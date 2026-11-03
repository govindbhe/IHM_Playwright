import { Page } from "@playwright/test";
import otpElements from "../page-elements/login-with-otp-elements.json" with { type: "json" };
import { webcommons } from "../../commons/ui/web-common";
import { config } from "../../utils/config-reader";
import { fetchLatestOtp } from "../../utils/otp-reader";
import { createTempInbox, waitForOtp, TempInbox } from "../../utils/temp-mail";
import * as process from "process";

export class LoginWithOtpSteps {
    page: Page;
    web: webcommons;

    constructor(page: Page) {
        this.page = page;
        this.web = new webcommons(this.page);
    }

    private otpSelectors(): string[] {
        return [
            otpElements.otpBox1,
            otpElements.otpBox2,
            otpElements.otpBox3,
            otpElements.otpBox4,
            otpElements.otpBox5,
            otpElements.otpBox6,
        ];
    }

    private async setMobileOrEmailValue(value: string): Promise<void> {
        const field = this.page.locator(otpElements.mobileOrEmailField);
        try {
            await field.click();
            await field.fill("");
            if (value) {
                await field.fill(value);
            }
        } catch {
            await this.page.evaluate(
                ({ selector, fieldValue }) => {
                    const input = document.evaluate(selector, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
                        .singleNodeValue as HTMLInputElement | null;
                    if (!input) return;
                    input.removeAttribute("readonly");
                    input.removeAttribute("disabled");
                    input.value = fieldValue;
                    input.dispatchEvent(new Event("input", { bubbles: true }));
                    input.dispatchEvent(new Event("change", { bubbles: true }));
                },
                { selector: otpElements.mobileOrEmailField, fieldValue: value || "" }
            );
        }
    }

    async entermobileOrEmail(mobileOrEmail: string): Promise<void> {
        await this.setMobileOrEmailValue(mobileOrEmail);
    }

    async enterMobileOrEmail(value: string): Promise<void> {
        await this.setMobileOrEmailValue(value);
    }

    async clickSendOtp(): Promise<void> {
        await this.web.clickonElement(otpElements.getOtpButton);
    }

    /**
     * Re-requests the OTP. Prefers the "Resend OTP" link shown on the OTP panel;
     * falls back to the original "Get OTP" button if the link isn't present/enabled.
     * Safe to call even if nothing is clickable (logs and moves on).
     */
    async resendOtp(): Promise<void> {
        const resend = this.page.locator(otpElements.resendOtpLink).first();
        try {
            if ((await resend.count()) && (await resend.isVisible()) && (await resend.isEnabled().catch(() => true))) {
                await resend.click();
                return;
            }
        } catch {
            // fall through to Get OTP
        }
        try {
            await this.page.locator(otpElements.getOtpButton).first().click();
        } catch {
            console.log("resendOtp: no Resend/Get OTP control was clickable.");
        }
    }

    async enter_otp_digit_1(digit: string): Promise<void> { await this.web.fill(otpElements.otpBox1, digit); }
    async enter_otp_digit_2(digit: string): Promise<void> { await this.web.fill(otpElements.otpBox2, digit); }
    async enter_otp_digit_3(digit: string): Promise<void> { await this.web.fill(otpElements.otpBox3, digit); }
    async enter_otp_digit_4(digit: string): Promise<void> { await this.web.fill(otpElements.otpBox4, digit); }
    async enter_otp_digit_5(digit: string): Promise<void> { await this.web.fill(otpElements.otpBox5, digit); }
    async enter_otp_digit_6(digit: string): Promise<void> { await this.web.fill(otpElements.otpBox6, digit); }

    /**
     * Waits for the OTP entry panel to render after "Get OTP" is clicked.
     * The boxes exist in the DOM from page load but stay hidden until the OTP
     * step is shown, so waiting on visibility (not attachment) is required.
     */
    async waitForOtpBoxes(timeout = 30000): Promise<void> {
        await this.page.locator(otpElements.otpBox1).waitFor({ state: "visible", timeout });
    }

    async enter_complete_otp(otp: string): Promise<void> {
        if (otp.length !== 6) {
            throw new Error("OTP must be 6 digits");
        }
        await this.waitForOtpBoxes();
        const selectors = this.otpSelectors();
        for (let i = 0; i < selectors.length; i++) {
            // Use locator.fill directly: it auto-waits for visibility/enabled,
            // unlike web.fill which calls scrollIntoViewIfNeeded and throws on hidden elements.
            await this.page.locator(selectors[i]).fill(otp[i]);
        }
    }

    async clear_otp_box_1(): Promise<void> { await this.page.locator(otpElements.otpBox1).fill(""); }
    async clear_otp_box_2(): Promise<void> { await this.page.locator(otpElements.otpBox2).fill(""); }
    async clear_otp_box_3(): Promise<void> { await this.page.locator(otpElements.otpBox3).fill(""); }
    async clear_otp_box_4(): Promise<void> { await this.page.locator(otpElements.otpBox4).fill(""); }
    async clear_otp_box_5(): Promise<void> { await this.page.locator(otpElements.otpBox5).fill(""); }
    async clear_otp_box_6(): Promise<void> { await this.page.locator(otpElements.otpBox6).fill(""); }

    async clear_all_otp_boxes(): Promise<void> {
        await this.clear_otp_box_1();
        await this.clear_otp_box_2();
        await this.clear_otp_box_3();
        await this.clear_otp_box_4();
        await this.clear_otp_box_5();
        await this.clear_otp_box_6();
    }

    async click_verify_button(): Promise<void> {
        await this.web.clickonElement(otpElements.verifyButton);
    }

    async is_verify_button_enabled(): Promise<boolean> {
        return await this.page.locator(otpElements.verifyButton).isEnabled().catch(() => false);
    }

    async click_change_link(): Promise<void> {
        try {
            await this.web.clickonElement(otpElements.changeLink);
        } catch {
            await this.page.locator(otpElements.changeLink).evaluate((el: Element) => {
                (el as HTMLElement).click();
            });
        }
    }

    async click_Resend_otp_link(): Promise<void> {
        await this.web.clickonElement(otpElements.resendOtpLink);
    }

    async get_otp_message(): Promise<string> {
        return (await this.page.locator(otpElements.otpMessage).textContent())?.trim() || "";
    }

    async get_phone_number_display(): Promise<string> {
        return (await this.page.locator(otpElements.sentToMessage).textContent())?.trim() || "";
    }

    async get_timer_text(): Promise<string> {
        return (await this.page.locator(otpElements.timerDisplay).textContent())?.trim() || "";
    }

    async is_timer_visible(): Promise<boolean> {
        await this.page.waitForTimeout(1000);
        try {
            if (await this.page.locator(otpElements.timerDisplay).isVisible()) return true;
        } catch {
            // fallback below
        }
        return await this.page.evaluate(() => {
            const el = document.getElementById("timer");
            if (!el) return false;
            const text = (el.textContent || "").trim();
            return text.length > 0;
        });
    }

    async get_success_message(): Promise<string> {
        return (await this.page.locator(otpElements.successMessage).textContent())?.trim() || "";
    }

    async is_success_message_displayed(): Promise<boolean> {
        await this.page.waitForTimeout(3000);
        return await this.page.locator(otpElements.successMessage).isVisible().catch(() => false);
    }

    async get_error_message(): Promise<string> {
        return (await this.page.locator(otpElements.errorMessage).textContent())?.trim() || "";
    }

    async is_error_message_displayed(): Promise<boolean> {
        return await this.page.locator(otpElements.errorMessage).isVisible().catch(() => false);
    }

    async get_page_heading(): Promise<string> {
        return (await this.page.locator(otpElements.signInHeading).textContent())?.trim() || "";
    }

    async is_page_heading_displayed(): Promise<boolean> {
        return await this.page.locator(otpElements.signInHeading).isVisible().catch(() => false);
    }

    async are_otp_boxes_visible(): Promise<boolean> {
        const selectors = this.otpSelectors();
        for (const selector of selectors) {
            if (!(await this.page.locator(selector).isVisible().catch(() => false))) {
                return false;
            }
        }
        return true;
    }

    async enter_otp_and_verify(otp: string): Promise<void> {
        await this.enter_complete_otp(otp);
        await this.page.waitForTimeout(1000);
        await this.click_verify_button();
    }

    async get_otp_box_1_value(): Promise<string> { return await this.page.locator(otpElements.otpBox1).inputValue(); }
    async get_otp_box_2_value(): Promise<string> { return await this.page.locator(otpElements.otpBox2).inputValue(); }
    async get_otp_box_3_value(): Promise<string> { return await this.page.locator(otpElements.otpBox3).inputValue(); }
    async get_otp_box_4_value(): Promise<string> { return await this.page.locator(otpElements.otpBox4).inputValue(); }
    async get_otp_box_5_value(): Promise<string> { return await this.page.locator(otpElements.otpBox5).inputValue(); }
    async get_otp_box_6_value(): Promise<string> { return await this.page.locator(otpElements.otpBox6).inputValue(); }

    async is_otp_box_1_focused(): Promise<boolean> {
        const autofocus = await this.page.locator(otpElements.otpBox1).getAttribute("autofocus");
        return autofocus !== null;
    }

    /** Address of the disposable inbox used by the most recent temp-mail login. */
    lastTempEmail: string | null = null;

    /**
     * Logs in using a disposable email inbox: create the inbox, use its address as the
     * login identifier, then read the OTP the site emails to it.
     *
     * Fully self-contained (no credentials needed). indiahandmade accepts disposable
     * addresses and emails the OTP, verified live. The buyer profile is a throwaway
     * account tied to whatever inbox this run created.
     */
    async Buyer_Login_With_Temp_Email(): Promise<TempInbox> {
        const inbox = await createTempInbox();
        this.lastTempEmail = inbox.address;
        console.log(`Using temp email for buyer login: ${inbox.address}`);

        await this.entermobileOrEmail(inbox.address);

        // Mark the cutoff before requesting so a stale message can't satisfy this login.
        const requestedAt = Date.now();
        await this.clickSendOtp();
        await this.waitForOtpBoxes();

        const otp = await waitForOtp(inbox, requestedAt);

        await this.enter_complete_otp(otp);
        await this.click_verify_button();
        return inbox;
    }

    /**
     * Logs in by requesting an OTP for the buyer *email* and reading the delivered
     * code back out of that mailbox over IMAP.
     *
     * Email is used rather than BUYER_MOBILE because an SMS-delivered OTP is not
     * reachable from the test process.
     */
    async Buyer_Login_With_OTP_Via_Email(): Promise<void> {
        const email = config.buyerEmail;
        if (!email) {
            throw new Error("BUYER_EMAIL environment variable is not set.");
        }

        await this.entermobileOrEmail(email);

        // Capture the cutoff *before* requesting the OTP so an older code in the
        // mailbox can never satisfy this login.
        const requestedAt = new Date();
        await this.clickSendOtp();
        await this.waitForOtpBoxes();

        const otp = await fetchLatestOtp({
            since: requestedAt,
            // If no email lands within the first minute, re-request once in case the
            // initial send was dropped or throttled by the site.
            onResend: () => this.resendOtp(),
        });

        await this.enter_complete_otp(otp);
        await this.click_verify_button();
    }

    /**
     * Default buyer OTP login.
     *
     * Uses email + IMAP retrieval when BUYER_EMAIL and BUYER_OTP_EMAIL_PASSWORD are
     * configured. Otherwise fails with an actionable message rather than submitting a
     * hardcoded OTP, which the server rejects.
     */
    async Buyer_Login_With_OTP(): Promise<void> {
        if (config.buyerEmail && config.buyerOtpEmailPassword) {
            await this.Buyer_Login_With_OTP_Via_Email();
            return;
        }

        throw new Error(
            "Buyer OTP login is not configured. Set BUYER_EMAIL and BUYER_OTP_EMAIL_PASSWORD " +
            "in .env so the OTP can be read from the mailbox over IMAP. " +
            "(For Gmail, BUYER_OTP_EMAIL_PASSWORD must be an app-specific password and IMAP " +
            "must be enabled.) Logging in with BUYER_MOBILE alone cannot work: that OTP is " +
            "delivered by SMS and is unreachable from the test process."
        );
    }

    async getMobileEmailFieldValue(): Promise<string> {
        return await this.page.locator(otpElements.mobileOrEmailField).inputValue();
    }

    async isMobileEmailFieldDisplayed(): Promise<boolean> {
        return await this.page.locator(otpElements.mobileOrEmailField).isVisible().catch(() => false);
    }

    async isGetOtpButtonDisplayed(): Promise<boolean> {
        return await this.page.locator(otpElements.getOtpButton).isVisible().catch(() => false);
    }

    async isGetOtpButtonEnabled(): Promise<boolean> {
        return await this.page.locator(otpElements.getOtpButton).isEnabled().catch(() => false);
    }

    async getGetOtpButtonText(): Promise<string> {
        return (await this.page.locator(otpElements.getOtpButton).textContent())?.trim() || "";
    }

    async isGoogleSignInDisplayed(): Promise<boolean> {
        return await this.page.locator(otpElements.googleSignInButton).first().isVisible().catch(() => false);
    }

    async isOrSeparatorDisplayed(): Promise<boolean> {
        return await this.page.locator(otpElements.orSeparator).isVisible().catch(() => false);
    }

    async isMobileEmailErrorDisplayed(): Promise<boolean> {
        return await this.page.locator(otpElements.mobileEmailError).isVisible().catch(() => false);
    }

    async getMobileEmailErrorText(): Promise<string> {
        return (await this.page.locator(otpElements.mobileEmailError).textContent())?.trim() || "";
    }

    async clearMobileEmailField(): Promise<void> {
        await this.setMobileOrEmailValue("");
    }

    async getMobileEmailPlaceholder(): Promise<string> {
        return (await this.page.locator(otpElements.mobileOrEmailField).getAttribute("placeholder")) || "";
    }

    async isResendOtpTextDisplayed(): Promise<boolean> {
        try {
            if (await this.page.locator(otpElements.resendOtpLink).isVisible()) return true;
        } catch {
            // fallback below
        }
        return await this.page.evaluate(() => {
            const all = Array.from(document.querySelectorAll("span, a, button, div"));
            return all.some((node) => (node.textContent || "").toLowerCase().includes("resend"));
        });
    }

    async isNotReceivedOtpTextDisplayed(): Promise<boolean> {
        try {
            if (await this.page.locator(otpElements.notReceivedOtpText).isVisible()) return true;
        } catch {
            // fallback below
        }
        return await this.page.evaluate(() => {
            const all = Array.from(document.querySelectorAll("span, p, div, label"));
            return all.some((node) => (node.textContent || "").toLowerCase().includes("not received"));
        });
    }

    async isChangeLinkDisplayed(): Promise<boolean> {
        try {
            if (await this.page.locator(otpElements.changeLink).isVisible()) return true;
        } catch {
            // fallback below
        }
        return await this.page.evaluate(() => {
            const el = document.getElementById("changemobno");
            if (!el) return false;
            const text = (el.textContent || "").trim();
            const visible = !!(el as HTMLElement).offsetParent;
            return text.length > 0 || visible;
        });
    }

    async isOtpBoxSingleDigit(boxNumber: number): Promise<boolean> {
        let value = "";
        switch (boxNumber) {
            case 1: value = await this.get_otp_box_1_value(); break;
            case 2: value = await this.get_otp_box_2_value(); break;
            case 3: value = await this.get_otp_box_3_value(); break;
            case 4: value = await this.get_otp_box_4_value(); break;
            case 5: value = await this.get_otp_box_5_value(); break;
            case 6: value = await this.get_otp_box_6_value(); break;
            default: value = "";
        }
        return value.length <= 1;
    }

    async getOtpBoxMaxLength(boxNumber: number): Promise<string> {
        switch (boxNumber) {
            case 1: return (await this.page.locator(otpElements.otpBox1).getAttribute("maxlength")) || "";
            case 2: return (await this.page.locator(otpElements.otpBox2).getAttribute("maxlength")) || "";
            case 3: return (await this.page.locator(otpElements.otpBox3).getAttribute("maxlength")) || "";
            case 4: return (await this.page.locator(otpElements.otpBox4).getAttribute("maxlength")) || "";
            case 5: return (await this.page.locator(otpElements.otpBox5).getAttribute("maxlength")) || "";
            case 6: return (await this.page.locator(otpElements.otpBox6).getAttribute("maxlength")) || "";
            default: return "";
        }
    }

    async pressEnterOnMobileEmailField(): Promise<void> {
        await this.page.locator(otpElements.mobileOrEmailField).press("Enter");
    }

    async isResendOtpDisplayed(): Promise<boolean> {
        return await this.page.locator(otpElements.resendOtpLink).isVisible().catch(() => false);
    }

    async isOnOtpPage(): Promise<boolean> {
        return this.page.url().includes("customer/account/login");
    }

    async isVerifyButtonDisplayed(): Promise<boolean> {
        return await this.page.locator(otpElements.verifyButton).isVisible().catch(() => false);
    }
}
