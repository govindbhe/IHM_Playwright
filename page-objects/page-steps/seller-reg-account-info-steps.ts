import { Page } from "@playwright/test";
import accountInfoElements from "../page-elements/seller-reg-account-info-elements.json" with { type: "json" };
import { webcommons } from "../../commons/ui/web-common";

export class SellerRegAccountInfoSteps {
    page: Page;
    web: webcommons;

    constructor(page: Page) {
        this.page = page;
        this.web = new webcommons(this.page);
    }

    async Send_LoginMailForChrome(): Promise<void> {
        await this.page.waitForTimeout(10000);
        await this.web.fill(accountInfoElements.loginEmailInput, "g.ovindbh.elonde22@gmail.com");
    }

    async Send_LoginMailForEdge(): Promise<void> {
        await this.page.waitForTimeout(10000);
        await this.web.fill(accountInfoElements.loginEmailInput, "govindbhelonde2222@gmail.com");
    }

    async Send_LoginMailForFireFox(): Promise<void> {
        await this.page.waitForTimeout(10000);
        await this.web.fill(accountInfoElements.loginEmailInput, "govindbhelonde3333@gmail.com");
    }

    async Send_Password(): Promise<void> {
        await this.web.fill(accountInfoElements.passwordInput, "Govind@123");
    }

    async send_Password_confirmation(): Promise<void> {
        await this.web.fill(accountInfoElements.passwordConfirmationInput, "Govind@123");
    }

    async Click_Proceed_button(): Promise<void> {
        await this.web.clickonElement(accountInfoElements.proceedButton);
    }

    async Account_info(): Promise<void> {
        await this.web.fill(accountInfoElements.loginEmailInput, "govindbh.elonde@gmail.com");
        await this.web.fill(accountInfoElements.passwordInput, "Govind@123");
        await this.web.fill(accountInfoElements.passwordConfirmationInput, "Govind@123");
        await this.page.locator(accountInfoElements.proceedButton).evaluate((el: Element) => {
            (el as HTMLElement).click();
        });
    }
}
