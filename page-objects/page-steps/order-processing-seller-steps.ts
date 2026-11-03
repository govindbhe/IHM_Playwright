import { Page } from "@playwright/test";
import sellerOrderElements from "../page-elements/order-processing-seller-elements.json" with { type: "json" };
import { webcommons } from "../../commons/ui/web-common";

export class OrderProcessingSellerSteps {
    page: Page;
    web: webcommons;

    constructor(page: Page) {
        this.page = page;
        this.web = new webcommons(this.page);
    }

    async Click_on_order_icon(): Promise<void> {
        await this.web.clickonElement(sellerOrderElements.orderIcon);
    }

    async Click_on_Accept_button(): Promise<void> {
        await this.web.clickonElement(sellerOrderElements.orderAcceptButton);
    }

    async Click_on_Reset_button(): Promise<void> {
        await this.web.clickonElement(sellerOrderElements.resetButton);
    }

    async IS_Accept_button_Displayed(): Promise<boolean> {
        return await this.page.locator(sellerOrderElements.orderAcceptButton).isVisible().catch(() => false);
    }

    async IS_Reject_button_Displayed(): Promise<boolean> {
        return await this.page.locator(sellerOrderElements.orderRejectButton).first().isVisible().catch(() => false);
    }

    async Click_on_reject_button(): Promise<void> {
        await this.web.clickonElement(sellerOrderElements.orderRejectButton);
    }

    async Click_on_Generate_invoice(): Promise<void> {
        await this.web.clickonElement(sellerOrderElements.generateInvoice);
    }

    async Click_on_Submit_Invoice(): Promise<void> {
        await this.web.clickonElement(sellerOrderElements.submitInvoice);
    }

    async Click_on_Submit_Bill_Of_supply(): Promise<void> {
        await this.web.clickonElement(sellerOrderElements.submitBillOfSupply);
    }

    async Click_on_View_Bill_of_supply(): Promise<void> {
        await this.web.clickonElement(sellerOrderElements.viewBillOfSupply);
    }

    async Click_on_Generate_Bill_Of_Supply(): Promise<void> {
        await this.web.clickonElement(sellerOrderElements.generateBillOfSupply);
    }

    async Click_on_generate_Shipment(): Promise<void> {
        await this.web.clickonElement(sellerOrderElements.generateShipment);
    }

    async Click_on_generate_Shipment_with_indiahandmade(): Promise<void> {
        await this.web.clickonElement(sellerOrderElements.shipmentWithIndiahandmade);
    }

    async Click_on_generate_Self_Shipment(): Promise<void> {
        await this.web.clickonElement(sellerOrderElements.selfShipment);
    }

    async Click_on_Continue_with_Selected_Courier(): Promise<void> {
        await this.web.clickonElement(sellerOrderElements.continueWithSelectedCourier);
    }

    async Click_on_Create_Shipment(): Promise<void> {
        await this.web.clickonElement(sellerOrderElements.createShipment);
    }

    async generate_Shipment_Success_Massage(): Promise<string> {
        await this.page.locator(sellerOrderElements.generateShipmentSuccessMessage).waitFor({ state: "visible", timeout: 10000 });
        return (await this.page.locator(sellerOrderElements.generateShipmentSuccessMessage).textContent())?.trim() || "";
    }

    async isShipmentCreated(): Promise<boolean> {
        return await this.page.locator(sellerOrderElements.shipmentSuccessMessage).isVisible().catch(() => false);
    }

    async getAwbText(): Promise<string> {
        return (await this.page.locator(sellerOrderElements.awbGeneratedMessage).textContent())?.trim() || "";
    }

    async Select_self_carrier(): Promise<void> {
        await this.page.locator(sellerOrderElements.selfCarrierDropdown).selectOption({ label: "Ekart" });
    }

    async Send_Self_Awn(): Promise<void> {
        const baseAwb = "AWB1568658";
        let randomDigits = "";
        for (let i = 0; i < 5; i++) {
            randomDigits += Math.floor(Math.random() * 10).toString();
        }
        const awbNumber = `${baseAwb}${randomDigits}`;
        await this.web.fill(sellerOrderElements.selfAwbInput, awbNumber);
    }

    async Save_Self_Shipment(): Promise<void> {
        await this.web.clickonElement(sellerOrderElements.saveSelfShipment);
    }

    async generate_Self_Shipment_Success_Massage(): Promise<string> {
        await this.page.locator(sellerOrderElements.selfShipmentSuccessMessage).waitFor({ state: "visible", timeout: 10000 });
        return (await this.page.locator(sellerOrderElements.selfShipmentSuccessMessage).textContent())?.trim() || "";
    }

    async Seller_Order_Canclled_Status(): Promise<boolean> {
        return await this.page.locator(sellerOrderElements.cancelledStatus).isVisible().catch(() => false);
    }
}
