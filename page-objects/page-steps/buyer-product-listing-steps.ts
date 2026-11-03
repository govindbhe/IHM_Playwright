import { Page } from "@playwright/test";
import buyerProductListingElements from "../page-elements/buyer-product-listing-elements.json" with { type: "json" };
import { webcommons } from "../../commons/ui/web-common";

export class BuyerProductListingSteps {
    page: Page;
    web: webcommons;

    constructor(page: Page) {
        this.page = page;
        this.web = new webcommons(this.page);
    }

    private parseNumericText(value: string): number {
        const parsed = value.replace(/[^0-9]/g, "");
        return Number.parseInt(parsed === "" ? "0" : parsed, 10);
    }

    async Click_on_sortByDropdown(value: string): Promise<void> {
        await this.web.SelectDropdownElement(buyerProductListingElements.sortByDropdown, value);
        await this.web.clickonElement(buyerProductListingElements.sortByDropdown);
    }

    async Click_on_CategoryFilter(): Promise<void> {
        await this.web.clickonElement(buyerProductListingElements.categoryFilter);
    }

    async send_on_color_brown(): Promise<void> {
        await this.web.clickonElement(buyerProductListingElements.colorBrownFilter);
    }

    async Click_on_Fabric_cotton(): Promise<void> {
        await this.web.clickonElement(buyerProductListingElements.fabricCottonFilter);
    }

    async Click_on_Price_9999(): Promise<void> {
        await this.web.clickonElement(buyerProductListingElements.price9999Filter);
    }

    async Click_on_state_ap(): Promise<void> {
        await this.web.clickonElement(buyerProductListingElements.stateAndhraPradeshFilter);
    }

    async Click_on_Discount(): Promise<void> {
        await this.web.clickonElement(buyerProductListingElements.discount10AndAboveFilter);
    }

    async Click_on_Rating(): Promise<void> {
        await this.web.clickonElement(buyerProductListingElements.rating1StarAndAboveFilter);
    }

    async Home_DecoreAndUtility_ProductCount(): Promise<number> {
        const count = (await this.web.getElementText(buyerProductListingElements.homeDecorAndUtilityCount)) || "";
        return this.parseNumericText(count);
    }

    async FabricCotton_ProductCount(): Promise<number> {
        const count = (await this.web.getElementText(buyerProductListingElements.fabricCottonProductCount)) || "";
        return this.parseNumericText(count);
    }

    async State_ProductCount(): Promise<number> {
        const count = (await this.web.getElementText(buyerProductListingElements.stateProductCount)) || "";
        return this.parseNumericText(count);
    }

    async first_ProductPrice(): Promise<number> {
        const price = (await this.web.getElementText(buyerProductListingElements.firstProductPrice)) || "";
        return this.parseNumericText(price);
    }

    async second_ProductPrice(): Promise<number> {
        const price = (await this.web.getElementText(buyerProductListingElements.secondProductPrice)) || "";
        return this.parseNumericText(price);
    }

    async third_ProductPrice(): Promise<number> {
        const price = (await this.web.getElementText(buyerProductListingElements.thirdProductPrice)) || "";
        return this.parseNumericText(price);
    }

    async fourth_ProductPrice(): Promise<number> {
        const price = (await this.web.getElementText(buyerProductListingElements.fourthProductPrice)) || "";
        return this.parseNumericText(price);
    }

    async Verify_High_to_Low_SortBy(): Promise<boolean> {
        const firstPrice = await this.first_ProductPrice();
        const secondPrice = await this.second_ProductPrice();
        const thirdPrice = await this.third_ProductPrice();
        const fourthPrice = await this.fourth_ProductPrice();

        console.log(`First Price: ${firstPrice}`);
        console.log(`Second Price: ${secondPrice}`);
        console.log(`Third Price: ${thirdPrice}`);
        console.log(`Fourth Price: ${fourthPrice}`);

        const isSorted = firstPrice >= secondPrice && secondPrice >= thirdPrice && thirdPrice >= fourthPrice;

        if (isSorted) {
            console.log("Sortby High o Low is working correctly. Products are sorted in descending order based on price.");
        } else {
            console.log("Sortby High o Low is NOT working correctly. Products are NOT sorted in descending order based on price.");
        }

        return isSorted;
    }

    async Verify_Low_to_High_SortBy(): Promise<boolean> {
        const firstPrice = await this.first_ProductPrice();
        const secondPrice = await this.second_ProductPrice();
        const thirdPrice = await this.third_ProductPrice();
        const fourthPrice = await this.fourth_ProductPrice();

        console.log(`First Price: ${firstPrice}`);
        console.log(`Second Price: ${secondPrice}`);
        console.log(`Third Price: ${thirdPrice}`);
        console.log(`Fourth Price: ${fourthPrice}`);

        const isSorted = firstPrice <= secondPrice && secondPrice <= thirdPrice && thirdPrice <= fourthPrice;

        if (isSorted) {
            console.log("Sortby Low to High is working correctly. Products are sorted in ascending order based on price.");
        } else {
            console.log("Sortby Low to High is NOT working correctly. Products are NOT sorted in ascending order based on price.");
        }

        return isSorted;
    }
}
