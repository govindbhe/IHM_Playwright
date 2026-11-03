import { test, expect } from "@playwright/test";
import { Homepagesteps } from "../../page-objects/page-steps/Home-page-steps";
import { SellerLoginSteps } from "../../page-objects/page-steps/seller-login-steps";
import { DashboardPageSteps } from "../../page-objects/page-steps/dashboard-page-steps";
import { ProductAddSteps } from "../../page-objects/page-steps/product-add-steps";
import { config } from "../../utils/config-reader";
import data from "../../testdata/ui/add-multivariant-product-data.json" with { type: "json" };
import sellerLoginElements from "../../page-objects/page-elements/seller-login-elements.json" with { type: "json" };
import dashboardElements from "../../page-objects/page-elements/dashboard-elements.json" with { type: "json" };
import productAddElements from "../../page-objects/page-elements/product-add-elements.json" with { type: "json" };

test.describe("Seller Product Management - Multi Variant Product", () => {
    test("Verify multi-variant product added successfully", async ({ page }) => {
        // This flow fills ~30 fields, uploads product + variant images and generates
        // variants. It measured ~90s end to end, which is exactly what test.slow()
        // allows (3 x the 30s default), leaving no margin. Set an explicit budget.
        test.setTimeout(240000);

        const homePage = new Homepagesteps(page);
        const sellerLogin = new SellerLoginSteps(page);
        const dashboard = new DashboardPageSteps(page);
        const productAdd = new ProductAddSteps(page);

        const appUrl = config.url;
        const sellerEmail = config.sellerEmail;
        const sellerPassword = config.sellerPassword;

        if (!sellerEmail || !sellerPassword) {
            throw new Error("Required environment variables SELLER_EMAIL or SELLER_PASSWORD are not set.");
        }

        const waitForVisible = async (selector: string, timeout = 6000): Promise<void> => {
            await expect(page.locator(selector).first()).toBeVisible({ timeout });
        };

        await page.goto(appUrl);

        await homePage.Click_on_Vendar_LogIn();
        await waitForVisible(sellerLoginElements.emailInputXpath);

        await sellerLogin.enter_email(sellerEmail);
        await sellerLogin.enter_Password(sellerPassword);
        await sellerLogin.Click_on_Sign_In_Button();

        await waitForVisible(dashboardElements.products);
        await dashboard.Click_On_Products();
        await waitForVisible(dashboardElements.addProduct);
        await dashboard.Click_On_Add_Product();
        await waitForVisible(productAddElements.productSelect);

        await productAdd.Click_on_Select();
        await waitForVisible(productAddElements.productMen);
        await productAdd.Click_on_Men();
        await waitForVisible(productAddElements.productWesternWear);
        await productAdd.Click_on_Western_Wear();
        await productAdd.Click_on_Shirt();
        await productAdd.Click_on_Multi_Veriant();
        await productAdd.Click_on_Continue();
        await waitForVisible(productAddElements.productName);


        await productAdd.Send_Product_Name();

        await productAdd.Click_On_Iframe1();
        await productAdd.SendProductFeatures(data.product.features);
        await productAdd.Click_ON_iframe2();
        await productAdd.SendProductDescription(data.product.description);

        await productAdd.Send_Meta_Title();
        await productAdd.Send_Meta_Keyword();
        await productAdd.Send_Meta_Discription();
        await productAdd.Send_List_Price();

        await productAdd.Send_Product_Images(data.product.imagePath);
        await productAdd.Send_Add_Product_variant();
        await waitForVisible(productAddElements.attrColor);

        await productAdd.Click_on_color();
        await waitForVisible(productAddElements.next1);
        await productAdd.Click_on_Next1();

        await waitForVisible(productAddElements.colorBlue);
        await productAdd.Click_on_blue();
        await waitForVisible(productAddElements.colorBrown);
        await productAdd.Click_on_Brown();
        await waitForVisible(productAddElements.next2);

        await productAdd.Click_on_Next2();
        await waitForVisible(productAddElements.next3);
        await productAdd.Click_on_Next3();
        await waitForVisible(productAddElements.generateProduct);
        await productAdd.Click_on_Generate_Product();

        await waitForVisible(productAddElements.blueQty);
        await productAdd.Send_blue_qyt();
        await waitForVisible(productAddElements.brownQty);
        await productAdd.Send_brown_qyt();
        await productAdd.Send_Variant_Images(data.product.imagePath);

        // await productAdd.Send_size_chart_template();
        await productAdd.Send_gst_percent();
        await productAdd.Send_hsn_code();
        await productAdd.Send_Item_Type();
        await productAdd.Send_fabric();
        await productAdd.Send_color();
        await productAdd.Send_apparel_topwear_size();
        await productAdd.Send_occasion();
        await productAdd.Send_state_of_origin();
        await productAdd.Send_care_instructions();
        await productAdd.Send_uploaded_by();
        await productAdd.Send_hsn_code();
        await productAdd.Send_length();
        await productAdd.Send_breadth();
        await productAdd.Send_height();

        await page.waitForTimeout(6000);
        await productAdd.Click_on_save_Btn();
        await waitForVisible(productAddElements.productAddSuccessMessage, 45000);

        const message = await productAdd.ProductAdd_Success_Massage();
        expect(message).toContain(data.expected.saveSuccessMessage);

        await dashboard.Click_On_Seller_Panel();
        await dashboard.Click_On_Logout();
    });
});
