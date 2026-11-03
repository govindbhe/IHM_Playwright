import { Page } from "@playwright/test";
import shopInfoElements from "../page-elements/seller-reg-shop-info-elements.json" with { type: "json" };
import { webcommons } from "../../commons/ui/web-common";

export class SellerRegShopInfoSteps {
    page: Page;
    web: webcommons;

    constructor(page: Page) {
        this.page = page;
        this.web = new webcommons(this.page);
    }

    async Send_Shop_virtual_Name(): Promise<void> {
        await this.web.fill(shopInfoElements.shopVirtualNameInput, "DICGovinda");
    }

    async Click_Any_Where(): Promise<void> {
        await this.web.clickonElement(shopInfoElements.clickAnyWhere);
    }

    async Click_On_Proceed_button(): Promise<void> {
        await this.web.clickonElement(shopInfoElements.proceedButton);
    }

    async shop_name(): Promise<void> {
        await this.Send_Shop_virtual_Name();
        await this.Click_Any_Where();
        await this.Click_On_Proceed_button();
    }
}
