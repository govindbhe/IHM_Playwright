import { Locator, Page, expect } from "@playwright/test";
import { webcommons } from "../../commons/ui/web-common";
import productAddElements from "../page-elements/product-add-elements.json" with { type: "json" };

export class ProductAddSteps {
    page: Page;
    web: webcommons;

    constructor(page: Page) {
        this.page = page;
        this.web = new webcommons(this.page);
    }

    private async isVisibleSafe(selector: string): Promise<boolean> {
        try {
            return await this.page.locator(selector).isVisible();
        } catch {
            return false;
        }
    }

    private async isEnabledSafe(selector: string): Promise<boolean> {
        try {
            return await this.page.locator(selector).isEnabled();
        } catch {
            return false;
        }
    }

    private async getInputValue(selector: string): Promise<string> {
        try {
            return await this.page.locator(selector).inputValue();
        } catch {
            return "";
        }
    }

    private async setRichTextInIframe(iframeSelector: string, bodySelector: string, text: string): Promise<void> {
        await this.page.locator(iframeSelector).waitFor({ state: "visible", timeout: 10000 });
        const frame = this.page.frameLocator(iframeSelector);
        const body = frame.locator(bodySelector);
        await body.click();
        await body.fill("");
        await body.fill(text);
    }

    async Send_Product_Name(name?: string): Promise<void> {
        const productName = name ?? `DupattaNotforsale${Date.now()}`;
        await this.page.locator(productAddElements.productName).clear();
        await this.web.fill(productAddElements.productName, productName);
    }

    async Click_On_Iframe1(): Promise<void> {
        await this.page.locator(productAddElements.shortDescriptionIframe).waitFor({ state: "visible", timeout: 10000 });
    }

    async SendProductFeatures(arg1: string, arg2?: string): Promise<void> {
        const text = arg2 ?? arg1;
        await this.setRichTextInIframe(productAddElements.shortDescriptionIframe, productAddElements.shortDescriptionBody, text);
    }

    async Click_ON_iframe2(): Promise<void> {
        await this.page.locator(productAddElements.descriptionIframe).waitFor({ state: "visible", timeout: 10000 });
    }

    async SendProductDescription(arg1: string, arg2?: string): Promise<void> {
        const text = arg2 ?? arg1;
        await this.setRichTextInIframe(productAddElements.descriptionIframe, productAddElements.descriptionBody, text);
    }

    async Send_Stock(): Promise<void> {
        await this.web.fill(productAddElements.stock, "20");
    }

    async Send_Meta_Keyword(): Promise<void> {
        await this.web.fill(productAddElements.metaKeyword, "Testts20");
    }

    async Send_Meta_Title(): Promise<void> {
        await this.web.fill(productAddElements.metaTitle, "test20");
    }

    async Send_Meta_Discription(): Promise<void> {
        await this.web.fill(productAddElements.metaDescription, "20");
    }

    async Send_List_Price(): Promise<void> {
        await this.web.fill(productAddElements.listPrice, "20");
    }

    async Send_Discount_Price(): Promise<void> {
        await this.web.fill(productAddElements.discountPrice, "19");
    }

    async Send_Allowed_Product_Qyt(): Promise<void> {
        await this.web.fill(productAddElements.allowedProductQty, "5");
    }

    async Send_Product_Images(filePath?: string): Promise<void> {
        const path = filePath ?? "F:\\new vol\\Documents\\chappls\\GOVV.jpg";
        await this.page.locator(productAddElements.productImages).setInputFiles(path);
    }

    async Send_Add_Product_variant(): Promise<void> {
        await this.web.clickonElement(productAddElements.addProductVariant);
    }

    async Send_blue_qyt(): Promise<void> {
        await this.web.fill(productAddElements.blueQty, "20");
    }

    async Send_brown_qyt(): Promise<void> {
        await this.web.fill(productAddElements.brownQty, "20");
    }

    async Send_Variant_Images(filePath?: string): Promise<void> {
        const path = filePath ?? "C:/Users/DELL/Documents/chappls/pexels-arashiah-24862048 (1).jpg";
        const inputs = this.page.locator("input[type='file']");
        const count = await inputs.count();
        for (let i = 0; i < count; i++) {
            await inputs.nth(i).setInputFiles(path).catch(() => { });
        }
    }

    async Send_gst_percent(): Promise<void> {
        const loc = this.page.locator(productAddElements.gstPercent);
        if (await loc.isVisible().catch(() => false)) {
            await loc.selectOption({ index: 0 }, { timeout: 3000 }).catch(() => { });
        }
    }

    async Send_size_chart_template(): Promise<void> {
        const loc = this.page.locator("//select[contains(@name,'size_chart') or contains(@id,'size_chart') or ../preceding-sibling::*[contains(.,'Size Chart')]]").first();
        if (await loc.isVisible().catch(() => false)) {
            await loc.selectOption({ label: "Top wear" }, { timeout: 3000 }).catch(() => { });
        }
    }

    async Send_hsn_code(): Promise<void> {
        const selector = productAddElements.hsnCode;
        if (await this.page.locator(selector).isVisible().catch(() => false)) {
            await this.web.fill(selector, "20");
        } else {
            console.log("HSN Code field is not visible, skipping.");
        }
    }

    async Send_gst_min_price(): Promise<void> {
        await this.web.fill(productAddElements.gstMinPrice, "20");
    }

    async Send_gst_Apply_below(): Promise<void> {
        await this.web.fill(productAddElements.gstApplyBelow, "20");
    }

    async Send_Item_Type(): Promise<void> {
        await this.page.locator(productAddElements.itemType).selectOption({ label: "Handloom" });
    }

    async Send_fabric(): Promise<void> {
        await this.page.locator(productAddElements.fabric).selectOption({ label: "Cotton" });
    }

    async Send_size(): Promise<void> {
        await this.page.locator(productAddElements.size).selectOption({ label: "onesize" });
    }

    async Send_dimension(): Promise<void> {
        await this.web.fill(productAddElements.dimension, "20");
    }

    async Send_color(): Promise<void> {
        await this.page.locator(productAddElements.color).selectOption({ label: "Brown" });
    }

    async Send_occasion(): Promise<void> {
        const selector = productAddElements.occasion;
        if (await this.page.locator(selector).isVisible().catch(() => false)) {
            await this.page.locator(selector).selectOption({ label: "Casual" });
        } else {
            console.log("Occasion field is not visible, skipping.");
        }
    }

    async Send_state_of_origin(): Promise<void> {
        await this.page.locator(productAddElements.stateOfOrigin).selectOption({ label: "Andhra Pradesh" });
    }

    async Send_apparel_topwear_size(): Promise<void> {
        await this.page.locator(productAddElements.apparelTopwearSize).selectOption({ label: "S" });
    }

    async Send_care_instructions(): Promise<void> {
        await this.web.fill(productAddElements.careInstructions, "ABC");
    }

    async Send_length(): Promise<void> {
        await this.web.fill(productAddElements.length, "10");
    }

    async Send_breadth(): Promise<void> {
        await this.web.fill(productAddElements.breadth, "20");
    }

    async Send_height(): Promise<void> {
        await this.web.fill(productAddElements.height, "3");
    }

    async Send_uploaded_by(): Promise<void> {
        const selector = productAddElements.uploadedBy;
        if (await this.page.locator(selector).isVisible().catch(() => false)) {
            await this.page.locator(selector).selectOption({ label: "Self" });
        } else {
            console.log("Uploaded By field is not visible, skipping.");
        }
    }

    async Click_on_save_Btn(): Promise<void> {
        await this.page.waitForTimeout(2000);
        console.log("Current URL before save click:", this.page.url());

        const saveInfo = await this.page.evaluate(() => {
            const btn = document.querySelector('#save-btn') as HTMLElement;
            const form = btn?.closest('form') || document.querySelector('form');
            return {
                btnExists: !!btn,
                btnId: btn?.id,
                btnType: btn?.getAttribute('type'),
                btnOnClick: btn?.getAttribute('onclick'),
                formId: form?.id,
                formAction: form?.action,
                formMethod: form?.method,
            };
        });
        console.log("Save Button & Form Info:", saveInfo);

        await this.page.evaluate(() => {
            const btn = document.querySelector('#save-btn') as HTMLElement;
            if (btn) {
                btn.click();
            }
            const form = (document.querySelector('form[action*="save"]') || document.querySelector('#form-validate') || btn?.closest('form')) as HTMLFormElement;
            if (form) {
                form.submit();
            }
        }).catch(() => { });

        await this.page.waitForTimeout(5000);
        console.log("Current URL 5s after save submit:", this.page.url());
    }

    async ProductAdd_Success_Massage(): Promise<string> {
        await this.page.waitForTimeout(5000);
        return (await this.page.locator(productAddElements.productAddSuccessMessage).textContent())?.trim() ?? "";
    }

    async Click_on_Select(): Promise<void> {
        await this.web.clickonElement(productAddElements.productSelect);
    }

    async Click_on_Men(): Promise<void> {
        await this.web.clickonElement(productAddElements.productMen);
    }

    async Click_on_Western_Wear(): Promise<void> {
        await this.web.clickonElement(productAddElements.productWesternWear);
    }

    async Click_on_Shirt(): Promise<void> {
        await this.web.clickonElement(productAddElements.productShirt);
    }

    async Click_on_Single_Variant(): Promise<void> {
        await this.page.locator(productAddElements.singleVariant).selectOption({ label: "Single Variant" });
    }

    async Click_on_Multi_Veriant(): Promise<void> {
        await this.page.locator(productAddElements.multiVariant).selectOption({ label: "Multi Variant" });
    }

    async Click_on_Continue(): Promise<void> {
        await this.web.clickonElement(productAddElements.continueButton);
    }

    async select_simple_product(): Promise<void> {
        await this.Click_on_Select();
        await this.Click_on_Men();
        await this.Click_on_Western_Wear();
        await this.Click_on_Shirt();
        await this.Click_on_Single_Variant();
        await this.Click_on_Continue();
    }

    async select_multi_product(): Promise<void> {
        await this.Click_on_Select();
        await this.Click_on_Men();
        await this.Click_on_Western_Wear();
        await this.Click_on_Shirt();
        await this.Click_on_Multi_Veriant();
        await this.Click_on_Continue();
    }

    async Click_on_apparel_bottomwear_size(): Promise<void> {
        await this.web.clickonElement(productAddElements.attrApparelBottomwearSize);
    }

    async Click_on_apparel_topwear_size(): Promise<void> {
        await this.web.clickonElement(productAddElements.attrApparelTopwearSize);
    }

    async Click_on_bangle_size(): Promise<void> {
        await this.web.clickonElement(productAddElements.attrBangleSize);
    }

    async Click_on_bedding_size(): Promise<void> {
        await this.web.clickonElement(productAddElements.attrBeddingSize);
    }

    async Click_on_color(): Promise<void> {
        await this.web.clickonElement(productAddElements.attrColor);
    }

    async Click_on_footwear_size(): Promise<void> {
        await this.web.clickonElement(productAddElements.attrFootwearSize);
    }

    async Click_on_kids_size(): Promise<void> {
        await this.web.clickonElement(productAddElements.attrKidsSize);
    }

    async Click_on_size(): Promise<void> {
        await this.web.clickonElement(productAddElements.attrSize);
    }

    async Click_on_Next1(): Promise<void> {
        await this.web.clickonElement(productAddElements.next1);
    }

    async Click_on_blue(): Promise<void> {
        await this.web.clickonElement(productAddElements.colorBlue);
    }

    async Click_on_Beige(): Promise<void> {
        await this.web.clickonElement(productAddElements.colorBeige);
    }

    async Click_on_Brown(): Promise<void> {
        await this.web.clickonElement(productAddElements.colorBrown);
    }

    async Click_on_Burgundy(): Promise<void> {
        await this.web.clickonElement(productAddElements.colorBurgundy);
    }

    async Click_on_Charcoal(): Promise<void> {
        await this.web.clickonElement(productAddElements.colorCharcoal);
    }

    async Click_on_Coral(): Promise<void> {
        await this.web.clickonElement(productAddElements.colorCoral);
    }

    async Click_on_Cream(): Promise<void> {
        await this.web.clickonElement(productAddElements.colorCream);
    }

    async Click_on_Gold(): Promise<void> {
        await this.web.clickonElement(productAddElements.colorGold);
    }

    async Click_on_Green(): Promise<void> {
        await this.web.clickonElement(productAddElements.colorGreen);
    }

    async Click_on_Grey(): Promise<void> {
        await this.web.clickonElement(productAddElements.colorGrey);
    }

    async Click_on_Khaki(): Promise<void> {
        await this.web.clickonElement(productAddElements.colorKhaki);
    }

    async Click_on_Magenta(): Promise<void> {
        await this.web.clickonElement(productAddElements.colorMagenta);
    }

    async Click_on_Maroon(): Promise<void> {
        await this.web.clickonElement(productAddElements.colorMaroon);
    }

    async Click_on_Multi(): Promise<void> {
        await this.web.clickonElement(productAddElements.colorMulti);
    }

    async Click_on_Mustard(): Promise<void> {
        await this.web.clickonElement(productAddElements.colorMustard);
    }

    async Click_on_Off_White(): Promise<void> {
        await this.web.clickonElement(productAddElements.colorOffWhite);
    }

    async Click_on_Olive(): Promise<void> {
        await this.web.clickonElement(productAddElements.colorOlive);
    }

    async Click_on_Orange(): Promise<void> {
        await this.web.clickonElement(productAddElements.colorOrange);
    }

    async Click_on_Peach(): Promise<void> {
        await this.web.clickonElement(productAddElements.colorPeach);
    }

    async Click_on_Pink(): Promise<void> {
        await this.web.clickonElement(productAddElements.colorPink);
    }

    async Click_on_Purple(): Promise<void> {
        await this.web.clickonElement(productAddElements.colorPurple);
    }

    async Click_on_Red(): Promise<void> {
        await this.web.clickonElement(productAddElements.colorRed);
    }

    async Click_on_Rose(): Promise<void> {
        await this.web.clickonElement(productAddElements.colorRose);
    }

    async Click_on_Silver(): Promise<void> {
        await this.web.clickonElement(productAddElements.colorSilver);
    }

    async Click_on_Teal(): Promise<void> {
        await this.web.clickonElement(productAddElements.colorTeal);
    }

    async Click_on_Turquoise(): Promise<void> {
        await this.web.clickonElement(productAddElements.colorTurquoise);
    }

    async Click_on_White(): Promise<void> {
        await this.web.clickonElement(productAddElements.colorWhite);
    }

    async Click_on_Yellow(): Promise<void> {
        await this.web.clickonElement(productAddElements.colorYellow);
    }

    async Click_on_Black(): Promise<void> {
        await this.web.clickonElement(productAddElements.colorBlack);
    }

    async Click_on_Tan(): Promise<void> {
        await this.web.clickonElement(productAddElements.colorTan);
    }

    async Click_on_Next2(): Promise<void> {
        await this.web.clickonElement(productAddElements.next2);
    }

    async Click_on_Next3(): Promise<void> {
        await this.web.clickonElement(productAddElements.next3);
    }

    async Click_on_Generate_Product(): Promise<void> {
        await this.web.clickonElement(productAddElements.generateProduct);
    }

    async Add_simple_Product(): Promise<void> {
        await this.Send_Product_Name();
        await this.page.waitForTimeout(4000);
        await this.SendProductFeatures("Test12345 TestDupattaTestDupattaTestDupattaTestDupattaTestDupattaTestDupattaTestDupattaTestDupattaTestDupatta");
        await this.page.waitForTimeout(4000);
        await this.SendProductDescription("Test0123 TestDupattaTestDupattaTestDupattaTestDupattaTestDupattaTestDupattaTestDupattaTestDupattaTestDupattaTestDupattaTestDupattaTestDupattaTestDupattaTestDupatta");
        await this.Send_Stock();
        await this.Send_Meta_Keyword();
        await this.Send_Meta_Title();
        await this.Send_Meta_Discription();
        await this.Send_List_Price();
        await this.Send_Discount_Price();
        await this.Send_Product_Images();
        await this.Send_Item_Type();
        await this.Send_fabric();
        await this.Send_color();
        await this.Send_apparel_topwear_size();
        await this.Send_occasion();
        await this.Send_state_of_origin();
        await this.Send_care_instructions();
        await this.Send_uploaded_by();
        await this.Send_hsn_code();
        await this.Send_length();
        await this.Send_breadth();
        await this.Send_height();
        await this.page.waitForTimeout(6000);
        await this.Click_on_save_Btn();
    }

    async isPageHeadingDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(productAddElements.pageHeading);
    }

    async isProductNameFieldDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(productAddElements.productName);
    }

    async isStockFieldDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(productAddElements.stock);
    }

    async isMetaTitleFieldDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(productAddElements.metaTitle);
    }

    async isMetaKeywordFieldDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(productAddElements.metaKeyword);
    }

    async isMetaDescriptionFieldDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(productAddElements.metaDescription);
    }

    async isListPriceFieldDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(productAddElements.listPrice);
    }

    async isSellingPriceFieldDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(productAddElements.discountPrice);
    }

    async isProductImageUploadDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(productAddElements.productImages);
    }

    async isSaveButtonDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(productAddElements.saveButton);
    }

    async isSaveButtonEnabled(): Promise<boolean> {
        return this.isEnabledSafe(productAddElements.saveButton);
    }

    async isPriceCalculatorLinkDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(productAddElements.priceCalculatorLink);
    }

    async isAttributeSetFieldDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(productAddElements.attributeSetField);
    }

    async isProductCategoryDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(productAddElements.productCategoryDropdown);
    }

    async isItemTypeDropdownDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(productAddElements.itemType);
    }

    async isColorDropdownDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(productAddElements.color);
    }

    async isStateOfOriginDropdownDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(productAddElements.stateOfOrigin);
    }

    async isStockAvailabilityDropdownDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(productAddElements.stockAvailability);
    }

    async isTaxClassDropdownDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(productAddElements.taxClass);
    }

    async isLengthFieldDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(productAddElements.length);
    }

    async isBreadthFieldDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(productAddElements.breadth);
    }

    async isHeightFieldDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(productAddElements.height);
    }

    async isCareInstructionsFieldDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(productAddElements.careInstructions);
    }

    async isMaterialFieldDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(productAddElements.materialField);
    }

    async isDimensionFieldDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(productAddElements.dimension);
    }

    async isFeaturesCharLimitMsgDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(productAddElements.featuresCharLimitMsg);
    }

    async isDescriptionCharLimitMsgDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(productAddElements.descriptionCharLimitMsg);
    }

    async isStockFieldErrorDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(productAddElements.stockFieldError);
    }

    async isMetaTitleErrorDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(productAddElements.metaTitleError);
    }

    async isMetaKeywordErrorDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(productAddElements.metaKeywordError);
    }

    async isMetaDescriptionErrorDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(productAddElements.metaDescriptionError);
    }

    async isPriceFieldErrorDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(productAddElements.priceFieldError);
    }

    async isImageRequiredErrorDisplayed(): Promise<boolean> {
        return this.isVisibleSafe(productAddElements.imageRequiredError);
    }

    async getProductNameValue(): Promise<string> {
        return this.getInputValue(productAddElements.productName);
    }

    async getAttributeSetValue(): Promise<string> {
        return this.getInputValue(productAddElements.attributeSetField);
    }

    async getStockValue(): Promise<string> {
        return this.getInputValue(productAddElements.stock);
    }

    async getMetaTitleValue(): Promise<string> {
        return this.getInputValue(productAddElements.metaTitle);
    }

    async getMetaKeywordValue(): Promise<string> {
        return this.getInputValue(productAddElements.metaKeyword);
    }

    async getMetaDescriptionValue(): Promise<string> {
        return this.getInputValue(productAddElements.metaDescription);
    }

    async getListPriceValue(): Promise<string> {
        return this.getInputValue(productAddElements.listPrice);
    }

    async getSellingPriceValue(): Promise<string> {
        return this.getInputValue(productAddElements.discountPrice);
    }

    /**
     * Reads the selected option's label from a <select>.
     *
     * These element selectors are XPath, so appending a CSS suffix such as
     * " option:checked" produced an unparseable mixed selector. Resolve the selected
     * option in the page instead.
     */
    private async getSelectedOptionLabel(selectSelector: string): Promise<string> {
        const select = this.page.locator(selectSelector).first();
        await select.waitFor({ state: "attached", timeout: 15000 });
        const label = await select.evaluate((el: Element) => {
            const sel = el as HTMLSelectElement;
            const option = sel.selectedOptions?.[0] ?? sel.options[sel.selectedIndex];
            return option ? (option.textContent || "") : "";
        });
        return label.trim();
    }

    async getSelectedStockAvailability(): Promise<string> {
        return this.getSelectedOptionLabel(productAddElements.stockAvailability);
    }

    async getSelectedTaxClass(): Promise<string> {
        return this.getSelectedOptionLabel(productAddElements.taxClass);
    }

    async getSelectedStockManagement(): Promise<string> {
        return this.getSelectedOptionLabel(productAddElements.stockManagementDropdown);
    }

    async getMinQtyValue(): Promise<string> {
        return this.getInputValue(productAddElements.minQtyField);
    }

    async getLengthValue(): Promise<string> {
        return this.getInputValue(productAddElements.length);
    }

    async getBreadthValue(): Promise<string> {
        return this.getInputValue(productAddElements.breadth);
    }

    async getHeightValue(): Promise<string> {
        return this.getInputValue(productAddElements.height);
    }

    async getCareInstructionsValue(): Promise<string> {
        return this.getInputValue(productAddElements.careInstructions);
    }

    async getItemTypeOptionCount(): Promise<number> {
        return this.page.locator(`${productAddElements.itemType} option`).count();
    }

    async getColorOptionCount(): Promise<number> {
        return this.page.locator(`${productAddElements.color} option`).count();
    }

    async getStateOfOriginOptionCount(): Promise<number> {
        return this.page.locator(`${productAddElements.stateOfOrigin} option`).count();
    }

    async enterProductName(name: string): Promise<void> {
        await this.page.locator(productAddElements.productName).clear();
        await this.web.fill(productAddElements.productName, name);
    }

    async enterStock(qty: string): Promise<void> {
        await this.page.locator(productAddElements.stock).clear();
        await this.web.fill(productAddElements.stock, qty);
    }

    async enterMetaTitle(title: string): Promise<void> {
        await this.page.locator(productAddElements.metaTitle).clear();
        await this.web.fill(productAddElements.metaTitle, title);
    }

    async enterMetaKeyword(keyword: string): Promise<void> {
        await this.page.locator(productAddElements.metaKeyword).clear();
        await this.web.fill(productAddElements.metaKeyword, keyword);
    }

    async enterMetaDescription(desc: string): Promise<void> {
        await this.page.locator(productAddElements.metaDescription).clear();
        await this.web.fill(productAddElements.metaDescription, desc);
    }

    async enterListPrice(price: string): Promise<void> {
        await this.page.locator(productAddElements.listPrice).clear();
        await this.web.fill(productAddElements.listPrice, price);
    }

    async enterSellingPrice(price: string): Promise<void> {
        await this.page.locator(productAddElements.discountPrice).clear();
        await this.web.fill(productAddElements.discountPrice, price);
    }

    async enterLength(val: string): Promise<void> {
        await this.page.locator(productAddElements.length).clear();
        await this.web.fill(productAddElements.length, val);
    }

    async enterBreadth(val: string): Promise<void> {
        await this.page.locator(productAddElements.breadth).clear();
        await this.web.fill(productAddElements.breadth, val);
    }

    async enterHeight(val: string): Promise<void> {
        await this.page.locator(productAddElements.height).clear();
        await this.web.fill(productAddElements.height, val);
    }

    async enterCareInstructions(instructions: string): Promise<void> {
        await this.page.locator(productAddElements.careInstructions).clear();
        await this.web.fill(productAddElements.careInstructions, instructions);
    }

    async enterMaterial(mat: string): Promise<void> {
        await this.page.locator(productAddElements.materialField).clear();
        await this.web.fill(productAddElements.materialField, mat);
    }

    async enterDimension(dim: string): Promise<void> {
        await this.page.locator(productAddElements.dimension).clear();
        await this.web.fill(productAddElements.dimension, dim);
    }

    async enterProductFeatures(arg1: string, arg2?: string): Promise<void> {
        const text = arg2 ?? arg1;
        await this.setRichTextInIframe(productAddElements.shortDescriptionIframe, productAddElements.shortDescriptionBody, text);
    }

    async enterProductDescription(arg1: string, arg2?: string): Promise<void> {
        const text = arg2 ?? arg1;
        await this.setRichTextInIframe(productAddElements.descriptionIframe, productAddElements.descriptionBody, text);
    }

    async clearProductName(): Promise<void> {
        await this.page.locator(productAddElements.productName).clear();
    }

    async clearStock(): Promise<void> {
        await this.page.locator(productAddElements.stock).clear();
    }

    async clearMetaTitle(): Promise<void> {
        await this.page.locator(productAddElements.metaTitle).clear();
    }

    async clearMetaKeyword(): Promise<void> {
        await this.page.locator(productAddElements.metaKeyword).clear();
    }

    async clearMetaDescription(): Promise<void> {
        await this.page.locator(productAddElements.metaDescription).clear();
    }

    async clearListPrice(): Promise<void> {
        await this.page.locator(productAddElements.listPrice).clear();
    }

    async clearSellingPrice(): Promise<void> {
        await this.page.locator(productAddElements.discountPrice).clear();
    }

    async clearLength(): Promise<void> {
        await this.page.locator(productAddElements.length).clear();
    }

    async clearBreadth(): Promise<void> {
        await this.page.locator(productAddElements.breadth).clear();
    }

    async clearHeight(): Promise<void> {
        await this.page.locator(productAddElements.height).clear();
    }

    async selectItemType(value: string): Promise<void> {
        await this.page.locator(productAddElements.itemType).selectOption({ label: value });
    }

    async selectColor(value: string): Promise<void> {
        await this.page.locator(productAddElements.color).selectOption({ label: value });
    }

    async selectStateOfOrigin(value: string): Promise<void> {
        await this.page.locator(productAddElements.stateOfOrigin).selectOption({ label: value });
    }

    async selectStockAvailability(value: string): Promise<void> {
        await this.page.locator(productAddElements.stockAvailability).selectOption({ label: value });
    }

    async selectTaxClass(value: string): Promise<void> {
        await this.page.locator(productAddElements.taxClass).selectOption({ label: value });
    }

    async scrollToElement(element: string | Locator): Promise<void> {
        if (typeof element === "string") {
            await this.page.locator(element).first().scrollIntoViewIfNeeded();
            return;
        }
        await element.first().scrollIntoViewIfNeeded();
    }

    async scrollToSaveButton(): Promise<void> {
        await this.page.locator(productAddElements.saveButton).scrollIntoViewIfNeeded();
    }

    async getPageURL(): Promise<string> {
        return this.page.url();
    }

    async getPageTitle(): Promise<string> {
        return this.page.title();
    }

    async isProductNameRequired(): Promise<boolean> {
        const labelText = (await this.page.locator(productAddElements.productNameRequiredLabel).textContent())?.trim() ?? "";
        return labelText.includes("*");
    }

    getProductCategoryTags(): Locator {
        return this.page.locator(productAddElements.productCategoryTags);
    }

    async fillProductName(name: string) {
        await this.web.fill(productAddElements.legacyProductNameInput, name);
        console.log(`✓ Entered product name: ${name}`);
    }

    async fillProductCategory(category: string) {
        await this.web.SelectDropdownElement(productAddElements.legacyCategoryDropdown, category);
        console.log(`✓ Selected product category: ${category}`);
    }

    async fillProductPrice(price: string) {
        await this.web.fill(productAddElements.legacyPriceInput, price);
        console.log(`✓ Entered product price: ${price}`);
    }

    async fillProductDescription(description: string) {
        await this.web.fill(productAddElements.legacyDescriptionInput, description);
        console.log(`✓ Entered product description`);
    }

    async fillProductQuantity(quantity: string) {
        await this.web.fill(productAddElements.legacyQuantityInput, quantity);
        console.log(`✓ Entered product quantity: ${quantity}`);
    }

    async uploadProductImage(filePath: string) {
        const modernInput = this.page.locator(productAddElements.productImages).first();
        if (await modernInput.count()) {
            await modernInput.setInputFiles(filePath);
            console.log(`✓ Uploaded product image`);
            return;
        }
        await this.page.locator(productAddElements.legacyFileInput).setInputFiles(filePath);
        console.log(`✓ Uploaded product image`);
    }

    async clickAddProductButton() {
        await this.web.clickonElement(productAddElements.legacyAddProductButton);
        console.log("✓ Clicked on Add Product button");
    }

    async verifyProductAddedSuccessfully() {
        const successMessage = this.page.locator(productAddElements.legacySuccessMessage);
        await expect(successMessage).toBeVisible();
        console.log("✓ Product added successfully");
    }

    async addSingleVariantProduct(productData: any) {
        await this.fillProductName(productData.name);
        await this.fillProductCategory(productData.category);
        await this.fillProductPrice(productData.price);
        await this.fillProductDescription(productData.description);
        await this.fillProductQuantity(productData.quantity);
        if (productData.imagePath) {
            await this.uploadProductImage(productData.imagePath);
        }
        await this.clickAddProductButton();
        console.log("✓ Single variant product added");
    }

    async addMultiVariantProduct(productData: any) {
        await this.fillProductName(productData.name);
        await this.fillProductCategory(productData.category);
        await this.fillProductPrice(productData.price);
        await this.fillProductDescription(productData.description);

        // Add variants
        for (const variant of productData.variants || []) {
            await this.web.clickonElement(productAddElements.legacyAddVariantButton);
            await this.web.fill(productAddElements.legacyVariantNameInput, variant.name);
            await this.web.fill(productAddElements.legacyVariantPriceInput, variant.price);
            await this.web.fill(productAddElements.legacyVariantQuantityInput, variant.quantity);
        }

        await this.clickAddProductButton();
        console.log("✓ Multi-variant product added");
    }
}
