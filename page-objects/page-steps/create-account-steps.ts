import { Page, expect } from "@playwright/test";
import createAccountElements from '../page-elements/create-account-elements.json' with { type: 'json' };
import { webcommons } from "../../commons/ui/web-common";
import data from '../../testdata/ui/account-data.json' with { type: 'json' };

export class CreateAccountSteps {
    page: Page;
    web: webcommons;

    constructor(page: Page) {
        this.page = page;
        this.web = new webcommons(this.page);
    }

    async enterFirstName() {
        await this.web.fill(createAccountElements.firstNameInput, data.createAccount.firstName);
        console.log(`✓ Entered first name: ${data.createAccount.firstName}`);
    }

    async enterLastName() {
        await this.web.fill(createAccountElements.lastNameInput, data.createAccount.lastName);
        console.log(`✓ Entered last name: ${data.createAccount.lastName}`);
    }

    async enterEmail() {
        await this.web.fill(createAccountElements.emailInput, data.createAccount.email);
        console.log(`✓ Entered email: ${data.createAccount.email}`);
    }

    async enterMobileNumber() {
        await this.web.fill(createAccountElements.mobileNumberInput, data.createAccount.mobileNumber);
        console.log(`✓ Entered mobile number: ${data.createAccount.mobileNumber}`);
    }

    async enterPassword() {
        await this.web.fill(createAccountElements.passwordInput, data.createAccount.password);
        console.log(`✓ Entered password`);
    }

    async enterConfirmPassword() {
        await this.web.fill(createAccountElements.confirmPasswordInput, data.createAccount.password);
        console.log(`✓ Entered confirm password`);
    }

    async clickOnTermsCondition() {
        await this.web.clickonElement(createAccountElements.termsCheckbox);
        console.log("✓ Clicked on Terms & Conditions checkbox");
    }

    async clickOnCreateAccountButton() {
        await this.web.clickonElement(createAccountElements.createAccountButton);
        await this.page.waitForLoadState('networkidle');
        console.log("✓ Clicked on Create Account button");
    }

    async getConfirmationMessage(): Promise<string> {
        const message = await this.page.locator(createAccountElements.confirmMessage).textContent();
        console.log(`✓ Confirmation message: ${message}`);
        return message || "";
    }

    async verifyAccountCreatedSuccessfully() {
        await this.web.VerifyVisibility(createAccountElements.confirmMessage);
        const message = await this.getConfirmationMessage();
        expect(message).toContain("confirm");
        console.log("✓ Account created successfully");
    }

    async fillAccountDetails() {
        await this.enterFirstName();
        await this.enterLastName();
        await this.enterEmail();
        await this.enterMobileNumber();
        await this.enterPassword();
        await this.enterConfirmPassword();
        await this.clickOnTermsCondition();
        console.log("✓ All account details filled");
    }
}
