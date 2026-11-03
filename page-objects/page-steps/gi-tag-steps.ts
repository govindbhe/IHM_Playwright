import { Page } from "@playwright/test";
import giTagElements from "../page-elements/gi-tag-elements.json" with { type: "json" };
import { webcommons } from "../../commons/ui/web-common";

export class GiTagSteps {
    page: Page;
    web: webcommons;

    constructor(page: Page) {
        this.page = page;
        this.web = new webcommons(this.page);
    }

    async send_gi_certificate_no(certNo?: string): Promise<void> {
        await this.web.fill(giTagElements.giCertificateNumberInput, certNo ?? "152656");
    }

    async select_Gi_Number(): Promise<void> {
        await this.page.locator(giTagElements.giNumberDropdown).selectOption({ index: 1 });
    }

    /**
     * Normalizes a date string to the yyyy-MM-dd form that a native
     * <input type="date"> requires. Accepts MM/DD/YYYY, DD/MM/YYYY (disambiguated
     * when a part is > 12), YYYY-MM-DD, or YYYY/MM/DD. Returns the input unchanged if
     * it cannot be parsed, so a genuinely bad value still surfaces loudly.
     */
    private toDateInputValue(date: string): string {
        const trimmed = date.trim();

        // Already yyyy-MM-dd
        if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

        // yyyy/MM/dd
        let m = trimmed.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
        if (m) {
            const [, y, mo, d] = m;
            return `${y}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}`;
        }

        // xx/xx/yyyy - decide day/month order from the values
        m = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        if (m) {
            let [, a, b, y] = m;
            let month = a;
            let day = b;
            // If the first part cannot be a month but the second can, it's DD/MM/YYYY.
            if (Number(a) > 12 && Number(b) <= 12) {
                month = b;
                day = a;
            }
            return `${y}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
        }

        return trimmed;
    }

    /** Sets the certificate date. Callers may pass MM/DD/YYYY; converted to yyyy-MM-dd. */
    async sendDateInMMDDYYYYFormat(date: string): Promise<void> {
        await this.web.fill(giTagElements.certificateDateInput, this.toDateInputValue(date));
    }

    /** Sets the "valid upto" date. Callers may pass DD/MM/YYYY; converted to yyyy-MM-dd. */
    async sendDate_registration_valid_upto_date(date: string): Promise<void> {
        await this.web.fill(giTagElements.registrationValidUptoDateInput, this.toDateInputValue(date));
    }

    async Upload_certificate_img(filePath?: string): Promise<void> {
        await this.page
            .locator(giTagElements.certificateUploadInput)
            .setInputFiles(filePath ?? "C:/Users/DELL/Documents/chappls/GOVV.jpg");
    }

    async Click_GI_submit(): Promise<void> {
        await this.web.clickonElement(giTagElements.submitGiButton);
    }

    async GI_Add_Success_Massage(): Promise<string> {
        // Submitting a GI certificate does a real file upload + server round trip, so the
        // confirmation can take well over 5s to render. Wait generously and match the
        // message loosely (exact-text was brittle).
        const message = this.page.locator(giTagElements.giAddSuccessMessage).first();
        await message.waitFor({ state: "visible", timeout: 45000 });
        return (await message.textContent())?.trim() || "";
    }

    async select_Gi_Number_ByText(visibleText: string): Promise<void> {
        await this.page.locator(giTagElements.giNumberDropdown).selectOption({ label: visibleText });
    }

    async isGiCertificateNoDisplayed(): Promise<boolean> {
        return await this.page.locator(giTagElements.giCertificateNumberInput).isVisible().catch(() => false);
    }

    async isSelectGiNumberDisplayed(): Promise<boolean> {
        return await this.page.locator(giTagElements.giNumberDropdown).isVisible().catch(() => false);
    }

    async isCertificateDateDisplayed(): Promise<boolean> {
        return await this.page.locator(giTagElements.certificateDateInput).isVisible().catch(() => false);
    }

    async isCertificateUploadDisplayed(): Promise<boolean> {
        return await this.page.locator(giTagElements.certificateUploadInput).isVisible().catch(() => false);
    }

    async isValidUptoDateDisplayed(): Promise<boolean> {
        return await this.page.locator(giTagElements.registrationValidUptoDateInput).isVisible().catch(() => false);
    }

    async isSubmitButtonDisplayed(): Promise<boolean> {
        return await this.page.locator(giTagElements.submitGiButton).isVisible().catch(() => false);
    }

    async isSubmitButtonEnabled(): Promise<boolean> {
        return await this.page.locator(giTagElements.submitGiButton).isEnabled().catch(() => false);
    }

    async isFormHeadingDisplayed(): Promise<boolean> {
        try {
            return await this.page.locator(giTagElements.formHeading).isVisible({ timeout: 2000 });
        } catch {
            return false;
        }
    }

    async getFormHeadingText(): Promise<string> {
        return (await this.page.locator(giTagElements.formHeading).textContent())?.trim() || "";
    }

    async getGiCertificateNoValue(): Promise<string> {
        return await this.page.locator(giTagElements.giCertificateNumberInput).inputValue();
    }

    async getCertificateDateValue(): Promise<string> {
        return await this.page.locator(giTagElements.certificateDateInput).inputValue();
    }

    async getValidUptoDateValue(): Promise<string> {
        return await this.page.locator(giTagElements.registrationValidUptoDateInput).inputValue();
    }

    async clearGiCertificateNo(): Promise<void> {
        await this.page.locator(giTagElements.giCertificateNumberInput).fill("");
    }

    async clearCertificateDate(): Promise<void> {
        await this.page.locator(giTagElements.certificateDateInput).fill("");
    }

    async clearValidUptoDate(): Promise<void> {
        await this.page.locator(giTagElements.registrationValidUptoDateInput).fill("");
    }

    async getGiNumberDropdownOptionsCount(): Promise<number> {
        return await this.page.locator(`${giTagElements.giNumberDropdown} option`).count();
    }

    async getFirstSelectedGiNumberText(): Promise<string> {
        return (
            (await this.page.locator(`${giTagElements.giNumberDropdown} option:checked`).textContent())?.trim() || ""
        );
    }

    async getAllowedExtensionsText(): Promise<string> {
        return (await this.page.locator(giTagElements.allowedExtensionsText).textContent())?.trim() || "";
    }

    async isLabelGiCertificateNoDisplayed(): Promise<boolean> {
        return await this.page.locator(giTagElements.labelGiCertificateNo).isVisible().catch(() => false);
    }

    async isLabelSelectGiNumberDisplayed(): Promise<boolean> {
        return await this.page.locator(giTagElements.labelSelectGiNumber).isVisible().catch(() => false);
    }

    async isLabelCertificateDateDisplayed(): Promise<boolean> {
        return await this.page.locator(giTagElements.labelCertificateDate).isVisible().catch(() => false);
    }

    async isLabelUploadCertificateDisplayed(): Promise<boolean> {
        return await this.page.locator(giTagElements.labelUploadCertificate).isVisible().catch(() => false);
    }

    async isValidationErrorDisplayed(): Promise<boolean> {
        try {
            return await this.page.locator(giTagElements.validationError).first().isVisible({ timeout: 2000 });
        } catch {
            return false;
        }
    }

    async getValidationErrorText(): Promise<string> {
        try {
            const locator = this.page.locator(giTagElements.validationError).first();
            await locator.waitFor({ state: "visible", timeout: 2000 });
            return (await locator.textContent())?.trim() || "";
        } catch {
            return "";
        }
    }

    async isSuccessMessageDisplayed(): Promise<boolean> {
        try {
            return await this.page.locator(giTagElements.giAddSuccessMessage).isVisible({ timeout: 2000 });
        } catch {
            return false;
        }
    }

    async getCurrentPageUrl(): Promise<string> {
        return this.page.url();
    }
}
