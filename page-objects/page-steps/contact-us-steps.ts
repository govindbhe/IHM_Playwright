import { Page } from "@playwright/test";
import contactUsElements from "../page-elements/contact-us-elements.json" with { type: "json" };
import { webcommons } from "../../commons/ui/web-common";

export class ContactUsSteps {
    page: Page;
    web: webcommons;

    constructor(page: Page) {
        this.page = page;
        this.web = new webcommons(this.page);
    }

    async Send_name(): Promise<void> {
        await this.web.fill(contactUsElements.nameInput, "Test-Contact_Us");
    }

    async Send_Whats_on_your_mind(): Promise<void> {
        await this.web.fill(
            contactUsElements.messageTextArea,
            "This is a test message for the contact us page.   Please ignore this message."
        );
    }

    async Click_on_submit_button(): Promise<void> {
        await this.web.clickonElement(contactUsElements.submitButton);
    }

    async send_phone_number(): Promise<void> {
        await this.web.fill(contactUsElements.phoneNumberInput, "9663636265");
    }

    async send_email(): Promise<void> {
        await this.web.fill(contactUsElements.emailInput, "example@example.com");
    }

    async Contact_Us_Success_Massage(): Promise<string> {
        await this.page.locator(contactUsElements.contactUsSuccessMessage).waitFor({ state: "visible", timeout: 10000 });
        return (await this.page.locator(contactUsElements.contactUsSuccessMessage).textContent())?.trim() || "";
    }

    async enterName(nameValue: string): Promise<void> {
        await this.web.fill(contactUsElements.nameInput, nameValue);
    }

    async enterEmail(emailValue: string): Promise<void> {
        await this.web.fill(contactUsElements.emailInput, emailValue);
    }

    async enterPhoneNumber(phoneValue: string): Promise<void> {
        await this.web.fill(contactUsElements.phoneNumberInput, phoneValue);
    }

    async enterMessage(messageValue: string): Promise<void> {
        await this.web.fill(contactUsElements.messageTextArea, messageValue);
    }

    async clearAllFields(): Promise<void> {
        await this.page.locator(contactUsElements.nameInput).fill("");
        await this.page.locator(contactUsElements.emailInput).fill("");
        await this.page.locator(contactUsElements.phoneNumberInput).fill("");
        await this.page.locator(contactUsElements.messageTextArea).fill("");
    }

    async getNameValue(): Promise<string> {
        return await this.page.locator(contactUsElements.nameInput).inputValue();
    }

    async getEmailValue(): Promise<string> {
        return await this.page.locator(contactUsElements.emailInput).inputValue();
    }

    async getPhoneValue(): Promise<string> {
        return await this.page.locator(contactUsElements.phoneNumberInput).inputValue();
    }

    async getMessageValue(): Promise<string> {
        return await this.page.locator(contactUsElements.messageTextArea).inputValue();
    }

    async isNameFieldVisible(): Promise<boolean> {
        return await this.page.locator(contactUsElements.nameInput).isVisible();
    }

    async isEmailFieldVisible(): Promise<boolean> {
        return await this.page.locator(contactUsElements.emailInput).isVisible();
    }

    async isPhoneFieldVisible(): Promise<boolean> {
        return await this.page.locator(contactUsElements.phoneNumberInput).isVisible();
    }

    async isMessageFieldVisible(): Promise<boolean> {
        return await this.page.locator(contactUsElements.messageTextArea).isVisible();
    }

    async isSubmitButtonVisibleAndEnabled(): Promise<boolean> {
        const button = this.page.locator(contactUsElements.submitButton);
        const visible = await button.isVisible();
        const enabled = await button.isEnabled();
        return visible && enabled;
    }

    async isNameFieldEnabled(): Promise<boolean> {
        return await this.page.locator(contactUsElements.nameInput).isEnabled();
    }

    async isEmailFieldEnabled(): Promise<boolean> {
        return await this.page.locator(contactUsElements.emailInput).isEnabled();
    }

    async isMessageFieldEnabled(): Promise<boolean> {
        return await this.page.locator(contactUsElements.messageTextArea).isEnabled();
    }

    async getNameValidationMessage(): Promise<string> {
        const errors = this.page.locator(contactUsElements.requiredFieldError);
        const count = await errors.count();
        if (count > 0) {
            return (await errors.first().textContent())?.trim() || "";
        }
        return "";
    }

    async getEmailValidationMessage(): Promise<string> {
        const errors = this.page.locator(contactUsElements.requiredFieldError);
        const count = await errors.count();
        if (count > 0) {
            return (await errors.first().textContent())?.trim() || "";
        }
        return "";
    }

    async getMessageValidationMessage(): Promise<string> {
        const errors = this.page.locator(contactUsElements.messageRequiredError);
        const count = await errors.count();
        if (count > 0) {
            return (await errors.first().textContent())?.trim() || "";
        }
        return "";
    }

    async getErrorMessageCount(): Promise<number> {
        return await this.page.locator(contactUsElements.messageRequiredError).count();
    }

    async fillFormWithValidData(name: string, email: string, phone: string, message: string): Promise<void> {
        await this.enterName(name);
        await this.enterEmail(email);
        await this.enterPhoneNumber(phone);
        await this.enterMessage(message);
    }

    async submitAndGetSuccessMessage(): Promise<string> {
        await this.Click_on_submit_button();
        return await this.Contact_Us_Success_Massage();
    }

    async getNamePlaceholder(): Promise<string> {
        return (await this.page.locator(contactUsElements.nameInput).getAttribute("placeholder")) || "";
    }

    async getEmailPlaceholder(): Promise<string> {
        return (await this.page.locator(contactUsElements.emailInput).getAttribute("placeholder")) || "";
    }

    async getMessagePlaceholder(): Promise<string> {
        return (await this.page.locator(contactUsElements.messageTextArea).getAttribute("placeholder")) || "";
    }

    async isSuccessMessageDisplayed(): Promise<boolean> {
        try {
            return await this.page.locator(contactUsElements.contactUsSuccessMessage).isVisible({ timeout: 10000 });
        } catch {
            return false;
        }
    }

    async getAllValidationErrorsCount(): Promise<number> {
        return await this.page.locator(contactUsElements.messageRequiredError).count();
    }

    isValidEmailFormat(email: string): boolean {
        const emailRegex = /^[A-Za-z0-9+_.-]+@(.+)$/;
        return emailRegex.test(email);
    }

    isValidPhoneFormat(phone: string): boolean {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phone);
    }
}
