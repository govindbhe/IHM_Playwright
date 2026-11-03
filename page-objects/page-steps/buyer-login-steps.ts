import { Page } from "@playwright/test";
import buyerLoginElements from "../page-elements/buyer-login-elements.json" with { type: "json" };
import { webcommons } from "../../commons/ui/web-common";

export class BuyerLoginSteps {
    page: Page;
    web: webcommons;

    constructor(page: Page) {
        this.page = page;
        this.web = new webcommons(this.page);
    }

    async enterEmail(email: string): Promise<void> {
        await this.web.fill(buyerLoginElements.emailFieldInput, email);
        console.log(`✓ Entered email/mobile: ${email}`);
    }

    async clickSendOtp(): Promise<void> {
        await this.web.clickonElement(buyerLoginElements.getOtpButton);
        console.log("✓ Clicked Send OTP button");
    }

    async enterOtp(otp: string): Promise<void> {
        const otpRoot = this.page.locator(buyerLoginElements.otpField);
        await otpRoot.waitFor({ state: "visible" });

        if (await otpRoot.isEditable()) {
            await otpRoot.fill(otp);
            console.log("✓ Entered OTP in single input field");
            return;
        }

        const inputBoxes = otpRoot.locator("input");
        const count = await inputBoxes.count();

        if (count === 0) {
            throw new Error("OTP field is not directly editable and has no child input boxes");
        }

        const digits = otp.split("");
        for (let i = 0; i < Math.min(count, digits.length); i++) {
            await inputBoxes.nth(i).fill(digits[i]);
        }

        console.log(`✓ Entered OTP across ${Math.min(count, digits.length)} input boxes`);
    }

    async clickLogin(): Promise<void> {
        await this.web.clickonElement(buyerLoginElements.loginVerifyButton);
        console.log("✓ Clicked Verify/Login button");
    }
}
