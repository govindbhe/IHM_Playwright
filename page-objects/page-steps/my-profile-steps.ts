import { Page } from "@playwright/test";
import profileElements from "../page-elements/my-profile-elements.json" with { type: "json" };
import { webcommons } from "../../commons/ui/web-common";

export class MyProfileSteps {
    page: Page;
    web: webcommons;
    private readonly NAME_MAX_LENGTH = 50;
    private readonly NAME_REGEX = /^[a-zA-Z\s'-]*$/;

    constructor(page: Page) {
        this.page = page;
        this.web = new webcommons(this.page);
    }

    private sanitizeName(name: string): string {
        return name.trim();
    }

    async Sendfirst_name(firstName?: string): Promise<void> {
        const value = firstName ?? "Govind";
        if (!value || !value.trim()) {
            throw new Error("First name cannot be empty");
        }

        const sanitizedName = this.sanitizeName(value);

        if (sanitizedName.length > this.NAME_MAX_LENGTH) {
            throw new Error(`First name exceeds maximum length of ${this.NAME_MAX_LENGTH} characters`);
        }

        if (!this.NAME_REGEX.test(sanitizedName)) {
            throw new Error(
                "First name contains invalid characters. Only letters, spaces, hyphens, and apostrophes are allowed"
            );
        }

        await this.web.fill(profileElements.firstNameInput, sanitizedName);
    }

    async send_last_name(lastName?: string): Promise<void> {
        const value = lastName ?? "Bhee";
        if (!value || !value.trim()) {
            throw new Error("Last name cannot be empty");
        }

        const sanitizedName = this.sanitizeName(value);

        if (sanitizedName.length > this.NAME_MAX_LENGTH) {
            throw new Error(`Last name exceeds maximum length of ${this.NAME_MAX_LENGTH} characters`);
        }

        if (!this.NAME_REGEX.test(sanitizedName)) {
            throw new Error(
                "Last name contains invalid characters. Only letters, spaces, hyphens, and apostrophes are allowed"
            );
        }

        await this.web.fill(profileElements.lastNameInput, sanitizedName);
    }

    async Click_on_maleradioButton(): Promise<void> {
        await this.web.clickonElement(profileElements.maleRadioButton);
    }

    async Click_on_femaleRadioButton(): Promise<void> {
        await this.web.clickonElement(profileElements.femaleRadioButton);
    }

    async Click_on_submit_button(): Promise<void> {
        await this.page.locator(profileElements.submitButton).first().click();
    }

    async captureFeedbackMessage(expectedText: string, timeout = 10000): Promise<string> {
        const dialogMessagePromise = this.page
            .waitForEvent("dialog", { timeout })
            .then(async (dialog) => {
                const message = dialog.message().trim();
                await dialog.accept();
                return message;
            })
            .catch(() => "");

        const inlineMessagePromise = this.page
            .getByText(expectedText, { exact: false })
            .first()
            .waitFor({ state: "visible", timeout })
            .then(async () => {
                const text = await this.page.getByText(expectedText, { exact: false }).first().innerText();
                return text.trim();
            })
            .catch(() => "");

        const [dialogMessage, inlineMessage] = await Promise.all([dialogMessagePromise, inlineMessagePromise]);

        return dialogMessage || inlineMessage;
    }

    async send_phone_number(): Promise<void> {
        await this.web.fill(profileElements.phoneNumberInput, "9663636265");
    }

    async send_email(): Promise<void> {
        await this.web.fill(profileElements.emailInput, "example@example.com");
    }

    async clear_first_name(): Promise<void> {
        await this.page.locator(profileElements.firstNameInput).fill("");
    }

    async clear_last_name(): Promise<void> {
        await this.page.locator(profileElements.lastNameInput).fill("");
    }

    async get_first_name_value(): Promise<string> {
        return await this.page.locator(profileElements.firstNameInput).inputValue();
    }

    async get_last_name_value(): Promise<string> {
        return await this.page.locator(profileElements.lastNameInput).inputValue();
    }

    async get_phone_number_value(): Promise<string> {
        return await this.page.locator(profileElements.phoneNumberInput).inputValue();
    }

    async get_email_value(): Promise<string> {
        return await this.page.locator(profileElements.emailInput).inputValue();
    }

    async is_first_name_field_displayed(): Promise<boolean> {
        return await this.page.locator(profileElements.firstNameInput).isVisible().catch(() => false);
    }

    async is_last_name_field_displayed(): Promise<boolean> {
        return await this.page.locator(profileElements.lastNameInput).isVisible().catch(() => false);
    }

    async is_phone_field_displayed(): Promise<boolean> {
        return await this.page.locator(profileElements.phoneNumberInput).isVisible().catch(() => false);
    }

    async is_email_field_displayed(): Promise<boolean> {
        return await this.page.locator(profileElements.emailInput).isVisible().catch(() => false);
    }

    async is_submit_button_enabled(): Promise<boolean> {
        const button = this.page.locator(profileElements.submitButton).first();
        const visible = await button.isVisible().catch(() => false);
        const enabled = await button.isEnabled().catch(() => false);
        return visible && enabled;
    }

    async is_phone_number_editable(): Promise<boolean> {
        const locator = this.page.locator(profileElements.phoneNumberInput);
        const enabled = await locator.isEnabled().catch(() => false);
        const readonly = await locator.getAttribute("readonly");
        const disabled = await locator.getAttribute("disabled");
        return enabled && readonly === null && disabled === null;
    }

    async is_email_editable(): Promise<boolean> {
        const locator = this.page.locator(profileElements.emailInput);
        const enabled = await locator.isEnabled().catch(() => false);
        const readonly = await locator.getAttribute("readonly");
        const disabled = await locator.getAttribute("disabled");
        return enabled && readonly === null && disabled === null;
    }

    async try_update_phone_number(value: string): Promise<boolean> {
        try {
            await this.page.locator(profileElements.phoneNumberInput).fill("");
            await this.page.locator(profileElements.phoneNumberInput).fill(value);
            return true;
        } catch {
            return false;
        }
    }

    async try_update_email(value: string): Promise<boolean> {
        try {
            await this.page.locator(profileElements.emailInput).fill("");
            await this.page.locator(profileElements.emailInput).fill(value);
            return true;
        } catch {
            return false;
        }
    }

    isValidName(name: string): boolean {
        if (!name || !name.trim()) {
            return false;
        }
        if (name.length > this.NAME_MAX_LENGTH) {
            return false;
        }
        return this.NAME_REGEX.test(name);
    }

    getSanitizedName(name: string): string {
        if (!name || !name.trim()) {
            throw new Error("Name cannot be empty");
        }
        const sanitized = name.trim();
        if (sanitized.length > this.NAME_MAX_LENGTH) {
            throw new Error(`Name exceeds maximum length of ${this.NAME_MAX_LENGTH}`);
        }
        if (!this.NAME_REGEX.test(sanitized)) {
            throw new Error("Name contains invalid characters");
        }
        return sanitized;
    }
}
