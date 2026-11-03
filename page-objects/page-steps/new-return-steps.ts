import { Page } from "@playwright/test";
import returnElements from "../page-elements/new-return-elements.json" with { type: "json" };
import { webcommons } from "../../commons/ui/web-common";

export class NewReturnSteps {
    page: Page;
    web: webcommons;

    constructor(page: Page) {
        this.page = page;
        this.web = new webcommons(this.page);
    }

    async Select_Return_Reason(): Promise<void> {
        await this.web.SelectDropdownElement(returnElements.returnReasonDropdown, "10");
    }

    async Select_item_condition(): Promise<void> {
        await this.web.SelectDropdownElement(returnElements.itemConditionDropdown, "3");
    }

    async Select_Return_Resolution(): Promise<void> {
        await this.web.SelectDropdownElement(returnElements.returnResolutionDropdown, "2");
    }

    async Send_Add_Massage(): Promise<void> {
        await this.web.fill(
            returnElements.addMessageTextArea,
            "This is a test message for the contact us page.   Please ignore this message."
        );
    }

    async Click_on_Attach_Photo(filePath?: string): Promise<void> {
        const path = filePath ?? "C:/Users/DELL/Documents/chappls/GOVV.jpg";
        const input = this.page.locator(returnElements.attachFileInput);

        await input.evaluate((el: Element) => {
            const node = el as HTMLElement;
            node.style.display = "block";
            node.style.visibility = "visible";
            node.style.height = "1px";
            node.style.width = "1px";
            node.style.opacity = "1";
        });

        await input.setInputFiles(path);
    }

    async Click_on_Check_Box(): Promise<void> {
        await this.web.clickonElement(returnElements.checkBox);
    }

    async Click_on_submit_request(): Promise<void> {
        await this.web.clickonElement(returnElements.submitRequestButton);
    }

    async return_Raised_Success_Message(): Promise<string> {
        await this.page.locator(returnElements.returnRaisedSuccessMessage).waitFor({ state: "visible", timeout: 10000 });
        return (await this.page.locator(returnElements.returnRaisedSuccessMessage).textContent())?.trim() || "";
    }
}
