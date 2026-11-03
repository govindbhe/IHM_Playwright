import { Page } from "@playwright/test";
import myAccountElements from "../page-elements/my-account-elements.json" with { type: "json" };
import { webcommons } from "../../commons/ui/web-common";

export class MyAccountSteps {
    page: Page;
    web: webcommons;

    constructor(page: Page) {
        this.page = page;
        this.web = new webcommons(this.page);
    }

    async Click_on_My_Orders(): Promise<void> {
        await this.web.clickonElement(myAccountElements.myOrdersAndReturnsLink);
    }

    async Click_on_My_Wish_List(): Promise<void> {
        await this.web.clickonElement(myAccountElements.myWishListLink);
    }

    async Click_on_Address_Book(): Promise<void> {
        try {
            await this.page.locator(myAccountElements.addressBookLinkAlt).waitFor({ state: "visible", timeout: 5000 });
            await this.web.clickonElement(myAccountElements.addressBookLinkAlt);
        } catch {
            try {
                const element = this.page.locator(myAccountElements.addressBookLink).first();
                await element.waitFor({ state: "visible", timeout: 5000 });
                await element.click();
            } catch {
                // If element is hidden, use JavaScript evaluation to click it
                try {
                    const element = this.page.locator(myAccountElements.addressBookLink).first();
                    await element.scrollIntoViewIfNeeded();
                    await element.evaluate((el: Element) => {
                        (el as HTMLElement).click();
                    });
                } catch {
                    throw new Error("Unable to click Address Book using all known locators.");
                }
            }
        }
    }

    async Click_on_Address_Book2(): Promise<void> {
        try {
            await this.page.locator(myAccountElements.addressBookLinkAlt).waitFor({ state: "visible", timeout: 5000 });
            await this.web.clickonElement(myAccountElements.addressBookLinkAlt);
        } catch {
            await this.page.locator(myAccountElements.addressBookLink).first().waitFor({ state: "visible", timeout: 10000 });
            await this.page.locator(myAccountElements.addressBookLink).first().click();
        }
    }

    async Click_on_my_profile(): Promise<void> {
        const candidates = [
            myAccountElements.myProfileLink,
            "//a[normalize-space()='My Profile']",
            "//li[.//text()[normalize-space()='My Profile']]//a",
            "//*[contains(@class,'box') or contains(@class,'card')][.//text()[normalize-space()='My Profile']]",
            "//h3[normalize-space()='My Profile']/ancestor::*[self::a or self::button or self::div][1]",
        ];

        for (const locator of candidates) {
            const element = this.page.locator(locator).first();
            if (await element.isVisible().catch(() => false)) {
                await element.scrollIntoViewIfNeeded();
                await element.click({ timeout: 10000 });
                return;
            }
        }

        throw new Error("Unable to click My Profile using known selectors.");
    }

    async Click_on_contact_us(): Promise<void> {
        await this.web.clickonElement(myAccountElements.contactUsLink);
    }

    async Click_on_Logout(): Promise<void> {
        await this.web.clickonElement(myAccountElements.logoutLink);
    }

    async Click_on_my_account(): Promise<void> {
        // If already on My Account page (strong tag = selected/non-link state), return early
        if (await this.page.locator(myAccountElements.myAccountStrong).isVisible()) {
            return;
        }

        const candidates = [
            myAccountElements.myAccountLinkPrimary,
            myAccountElements.myAccountLink,
            myAccountElements.myAccountStrong,
            myAccountElements.myAccountAny,
        ];

        for (const locator of candidates) {
            try {
                const element = this.page.locator(locator).first();
                await element.waitFor({ state: "visible", timeout: 8000 });
                await element.scrollIntoViewIfNeeded();
                await element.click({ timeout: 8000 });
                return;
            } catch {
                try {
                    const element = this.page.locator(locator).first();
                    await element.evaluate((el: Element) => {
                        (el as HTMLElement).scrollIntoView({ block: "center" });
                        (el as HTMLElement).click();
                    });
                    return;
                } catch {
                    // try next locator
                }
            }
        }

        throw new Error("Unable to click My Account using all known locators.");
    }

    async Click_on_my_Edit_address_button(): Promise<void> {
        await this.web.clickonElement(myAccountElements.editAddressButton);
    }

    async Click_on_delete_address_button(): Promise<void> {
        await this.web.clickonElement(myAccountElements.deleteAddressButton);
    }
}
