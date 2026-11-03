import { Page } from '@playwright/test'
import { webcommons } from '../../commons/ui/web-common';
import Homepage from '../page-elements/home-page-elements.json' with {type: 'json'};
import ConfigReader from '../../utils/config-reader';
import data from '../../testdata/ui/data.json' with {type: 'json'};


export class Homepagesteps {

    web: webcommons;
    page: Page;

    constructor(page: Page) {

        this.page = page;
        this.web = new webcommons(this.page);
    }

    async verifyIndiahandmadeLogoIsVisible() {
        await this.web.VerifyVisibility(Homepage.indiahandmadeLogo);
    }
    async launchApplication() {
        const appUrl = ConfigReader.getProperty("app.url") || "https://www.indiahandmade.com/";
        await this.page.goto(appUrl);
    }

    async verifyIndiaflageIsVisible() {
        await this.web.VerifyVisibility(Homepage.IndiaFlag);
    }

    async verifysatyamevJayteLogoIsVisible() {
        await this.web.VerifyVisibility(Homepage.satyamevJayteLogo);
    }
    async verifySearchBoxIsVisible() {
        await this.web.VerifyVisibility(Homepage.searchTextbox);

    }
    async VerifytypeingInSearchBox(searchTerm: string) {
        await this.web.fill(Homepage.searchTextbox, searchTerm);
    }
    async VerifysignInLinkIsVisible() {
        await this.web.VerifyVisibility(Homepage.ProfileIcon);
    }
    async VerifycartIconIsvisible() {

        await this.web.VerifyVisibility(Homepage.CartIcon);
    }
    async VerifyHomeAndLivingCategoryIsVisible() {

        await this.web.VerifyVisibility(Homepage.HomeAndLivingProductCategory);
    }
    async VerifyHomeAndLivingCategoryWithSubmenu() {
        // Hover over Home and Living category to reveal submenu
        await this.web.hoverOnElement(Homepage.HomeAndLivingProductCategory);
        // Verify submenu items are visible
        await this.web.VerifyVisibility(Homepage.HomeDcorAndUtility);
        await this.web.VerifyVisibility(Homepage.KitchenAndDining);
    }
    async VerifyMenCategoryIsVisible() {
        await this.web.VerifyVisibility(Homepage.MenProductcategory);
    }
    async VerifyKidsCategoryIsVisible() {
        await this.web.VerifyVisibility(Homepage.KidsProductcategory);
    }
    async VerifyFurnitureCategoryIsVisible() {
        await this.web.VerifyVisibility(Homepage.furnitureProductCategory);
    }
    async VerifyPaintingCategoryIsVisible() {
        await this.web.VerifyVisibility(Homepage.PaintingProductcategory);
    }

    async VerifyGiCategoryIsVisible() {
        await this.web.VerifyVisibility(Homepage.GiProductcategory);
    }
    async VerifyODOPCategoryIsVisible() {
        await this.web.VerifyVisibility(Homepage.OdopProductcategory);
    }
    async VerifyBannerVideoIsVisible() {

        await this.web.VerifyVisibility(Homepage.Bannervideo);
    }
    async VerifyWomenKurtiesBannerVisibility() {

        await this.web.VerifyVisibility(Homepage.WomenKurties);
    }


    async verifyMenEthnicWearBannerVisibility() {
        await this.web.VerifyVisibility(Homepage.MenEthnicWear);
    }
    async VerifysareeBannerVisibility() {
        await this.web.VerifyVisibility(Homepage.Saree);
    }
    async VerifyLightingVisibility() {
        await this.web.VerifyVisibility(Homepage.Lighting);
    }
    async VerifyReligiousItemsVisibility() {
        await this.web.VerifyVisibility(Homepage.ReligiousItems);
    }
    async VerifyKitchenAndDiningVisibility() {
        await this.web.VerifyVisibility(Homepage.KitchenAndDining);
    }
    async VerifyStationaryVisibility() {
        await this.web.VerifyVisibility(Homepage.Stationary);
    }
    async VerifyPaintingsBannerVisibility() {
        await this.web.VerifyVisibility(Homepage.Paintings);
    }
    async VerifyKnowMorebuttonVisibility() {
        await this.web.VerifyVisibility(Homepage.KnowMorebutton);
    }
    async VerifyTheGatewaytoIndiasTimelessHeritageBannerIsVisible() {
        await this.web.VerifyVisibility(Homepage.TheGatewaytoIndiasTimelessHeritageBanner);
    }

    async VerifyFreeShippingIconVisibility() {
        await this.web.VerifyVisibility(Homepage.FreeShipingIcon);
    }
    async VerifyEasyReturnIconVisibility() {
        await this.web.VerifyVisibility(Homepage.EasyReturnicon);
    }

    async VerifyUserCheckIconVisibility() {
        await this.web.VerifyVisibility(Homepage.UserCheckIcon);
    }
    async VerifySecurePaymentIconVisibility() {
        await this.web.VerifyVisibility(Homepage.SafePaymentIcon);
    }
    async VerifyWareHouseBannerVisibility() {
        await this.web.VerifyVisibility(Homepage.WareHouseBanner);
    }
    async VerifycushionCuversBannerVisibility() {
        await this.web.VerifyVisibility(Homepage.cushionCuvers);
    }
    async VerifyHomeDecoreBannerVisibility() {
        await this.web.VerifyVisibility(Homepage.HomeDecore);
    }
    async VerifyBedsheetbannerVisibility() {
        await this.web.VerifyVisibility(Homepage.Bedsheetbanner);
    }
    async VerifyFloorCoveringsBannerVisibility() {
        await this.web.VerifyVisibility(Homepage.FloorCoverings);
    }
    async VerifyTrueReflectionBennerVisibility() {
        await this.web.VerifyVisibility(Homepage.TrueReflectionBenner);
    }
    async VerifyFurniturebannerVisibility() {
        await this.web.VerifyVisibility(Homepage.Furniturebanner);
    }
    async VerifyWomenAccessoriesBannerVisibility() {
        await this.web.VerifyVisibility(Homepage.WomenAccessories);
    }
    async VerifyToysandGamesBannerVisibility() {
        await this.web.VerifyVisibility(Homepage.ToysandGames);
    }
    async VerifyEthnicFootwearsBannerVisibility() {
        await this.web.VerifyVisibility(Homepage.EthnicFootwears);
    }
    async VerifyWomenBagsBannerVisibility() {
        await this.web.VerifyVisibility(Homepage.WomenBags);
    }
    async VerifyHoneringOurBannerBannerVisibility() {
        await this.web.VerifyVisibility(Homepage.HoneringOurBanner);
    }
    async VerifySellerRegistrationBannerVisibility() {
        await this.web.VerifyVisibility(Homepage.SellerRegistrationBanner);
    }
    async VerifyResourcesLinkVisibility() {
        await this.web.VerifyVisibility(Homepage.ResourcesLink);
    }
    async VerifyContactUsLinkVisibility() {
        await this.web.VerifyVisibility(Homepage.ContactUsLink);
    }
    async VerifyAboutUsLinkVisibility() {
        await this.web.VerifyVisibility(Homepage.AboutUsLink);
    }
    async VerifyprivacypolicyAndcookiesLinkVisibility() {
        await this.web.VerifyVisibility(Homepage.privacypolicyAndcookiesLink);
    }
    async VerifySearchTermLinLinkVisibility() {
        await this.web.VerifyVisibility(Homepage.SearchTermLink);
    }
    async VerifyAdvancedSearchLinkVisibility() {
        await this.web.VerifyVisibility(Homepage.AdvancedSearchLink);
    }
    async VerifyRSSFeedLinkVisibility() {
        await this.web.VerifyVisibility(Homepage.RSSFeedLink);
    }
    async VerifyRMARequestLinkVisibility() {
        await this.web.VerifyVisibility(Homepage.RMARequestLink);
    }
    async VerifyBlogLinkVisibility() {
        await this.web.VerifyVisibility(Homepage.BlogLink);
    }
    async VerifyHelpSupportLinkVisibility() {
        await this.web.VerifyVisibility(Homepage.HelpSupportLink);
    }
    async VerifyBuyersFAQsLinkVisibility() {
        await this.web.VerifyVisibility(Homepage.BuyersFAQsLink);
    }

    async VerifyMediaGalleryLinkVisibility() {
        await this.web.VerifyVisibility(Homepage.MediaGalleryLink);
    }
    async VerifyGrievanceLinkVisibility() {
        await this.web.VerifyVisibility(Homepage.GrievanceLink);
    }
    async VerifyDisclaimerLinkVisibility() {
        await this.web.VerifyVisibility(Homepage.DisclaimerLink);
    }
    async VerifyPrivacyPolicyLinkVisibility() {
        await this.web.VerifyVisibility(Homepage.PrivacyPolicyLink);
    }
    async VerifyShippingPolicyLinkVisibility() {
        await this.web.VerifyVisibility(Homepage.ShippingPolicyLink);
    }
    async VerifyReturnRefundPolicyLinkVisibility() {
        await this.web.VerifyVisibility(Homepage.ReturnRefundPolicyLink);
    }
    async VerifyTermsOfUseBuyerLinkVisibility() {
        await this.web.VerifyVisibility(Homepage.TermsOfUseBuyerLink);
    }
    async VerifyTermsOfUseSellerLinkVisibility() {
        await this.web.VerifyVisibility(Homepage.TermsOfUseSellerLink);
    }
    async VerifyFacebookLinkkVisibility() {
        await this.web.VerifyVisibility(Homepage.FacebookLink);
    }
    async VerifyTwitterLinkLinkVisibility() {
        await this.web.VerifyVisibility(Homepage.TwitterLink);
    }
    async VerifyInstagramLinkVisibility() {
        await this.web.VerifyVisibility(Homepage.InstagramLink);
    }
    async VerifyYouTubeLinkVisibility() {
        await this.web.VerifyVisibility(Homepage.YouTubeLink);
    }
    async VerifyLinkedInLinkVisibility() {
        await this.web.VerifyVisibility(Homepage.LinkedInLink);
    }
    async VerifyWeAcceptPngVisibility() {
        await this.web.VerifyVisibility(Homepage.WeAcceptPng);
    }
    async VerifyMinistryOfTextileLogoVisibility() {
        await this.web.VerifyVisibility(Homepage.MinistryOfTextileLogo);
    }
    async VerifyAzadiKaAmritMahotsavLogoVisibility() {
        await this.web.VerifyVisibility(Homepage.AzadiKaAmritMahotsavLogo);
    }
    async VerifyMakeInIndiaLogoVisibility() {
        await this.web.VerifyVisibility(Homepage.MakeInIndiaLogo);
    }
    async VerifyCottageEmporiumLogoVisibility() {
        await this.web.VerifyVisibility(Homepage.CottageEmporiumLogo);
    }
    async VerifyDigitalIndiaLogoVisibility() {
        await this.web.VerifyVisibility(Homepage.DigitalIndiaLogo);
    }

    async VerifyIndiaGovLogoVisibility() {
        await this.web.VerifyVisibility(Homepage.IndiaGovLogo);
    }
    async VerifyAccessibilityOptionsIconVisibility() {
        await this.web.VerifyVisibility(Homepage.AccessibilityOptionsIcon);
    }
    async VerifyWhatsAppBetaIconIconVisibility() {
        await this.web.VerifyVisibility(Homepage.WhatsAppBetaIcon);
    }
    async VerifyBannerSliderPrevButtonVisibility() {
        await this.web.VerifyVisibility(Homepage.BannerSliderPrevButton);
    }
    async VerifyBannerSliderNextButtonVisibility() {
        await this.web.VerifyVisibility(Homepage.BannerSliderNextButton);
    }
    async VerifyclickingonIndiahandmadeLogoRedirectsToHomepage() {
        await this.web.clickAndWaitForURL(Homepage.indiahandmadeLogo, data.homepageurl);
    }
    async VerifyclickingonWomenKurtiesBannerRedirectsTocurrentPage() {
        await this.web.clickAndWaitForURL(Homepage.WomenKurties, data.womenkurtiesbannerurl);
    }
    async VerifyclickingonMenEthnicWearBannerRedirectsTocurrentPage() {
        await this.web.clickAndWaitForURL(Homepage.MenEthnicWear, data.menethnicwearbannerurl);
    }
    async VerifyclickingonSareeBannerRedirectsTocurrentPage() {
        await this.web.clickAndWaitForURL(Homepage.Saree, data.sareebannerurl);
    }
    async VerifyclickingonLightingBannerRedirectsTocurrentPage() {
        await this.web.clickAndWaitForURL(Homepage.Lighting, data.lightingbannerurl);
    }
    async VerifyclickingonReligiousItemsBannerRedirectsTocurrentPage() {
        await this.web.clickAndWaitForURL(Homepage.ReligiousItems, data.Religiousbannerurl);
    }
    async VerifyclickingonKitchenAndDiningBannerRedirectsTocurrentPage() {
        await this.web.clickAndWaitForURL(Homepage.KitchenAndDining, data.kichenAndDiningbannerurl);
    }
    async VerifyclickingonStationaryBannerRedirectsTocurrentPage() {
        await this.web.clickAndWaitForURL(Homepage.Stationary, data.stationarybannerurl);
    }
    async VerifyclickingonPaintingsBannerRedirectsTocurrentPage() {
        await this.web.clickAndWaitForURL(Homepage.Paintings, data.paintingbannerurl);
    }

    async Click_on_SignIn() {
        await this.web.clickonElement(Homepage.SignInLink);
    }

    async Click_on_LoginInOrSignUP() {
        await this.web.clickonElement(Homepage.loginORSignInButton);
    }

    /**
     * Whether the Profile link is present, i.e. whether a user is signed in.
     * Use this to guard logout in afterEach hooks: attempting to log out when login
     * never happened otherwise waits on a missing element until the hook times out.
     */
    async isProfileLinkVisible(timeout = 5000): Promise<boolean> {
        return await this.page
            .locator(Homepage.Profilelink)
            .first()
            .isVisible({ timeout })
            .catch(() => false);
    }

    async Click_on_ProfileLink() {
        await this.web.clickonElement(Homepage.Profilelink);
    }

    async Click_on_LogoutButton() {
        await this.web.clickonElement(Homepage.signOutLink);
    }

    async Click_on_CreateAccount() {
        await this.web.clickonElement(Homepage.createAccountLink);
    }

    async Click_on_Home_And_Living() {
        await this.web.clickonElement(Homepage.HomeAndLivingProductCategory);
    }

    async Click_on_Women() {
        await this.web.clickonElement(Homepage.WomenProductCategory);
    }

    async Click_on_Men() {
        await this.web.clickonElement(Homepage.MenProductcategory);
    }

    async Click_on_Kids() {
        await this.web.clickonElement(Homepage.KidsProductcategory);
    }

    async Click_on_Furniture() {
        await this.web.clickonElement(Homepage.furnitureProductCategory);
    }

    async Click_on_Logout() {
        await this.Click_on_ProfileLink();
        await this.Click_on_LogoutButton();
    }

    async Send_on_Search_Here() {
        await this.web.fill(Homepage.searchTextbox, "Del572697");
        await this.page.keyboard.press('Enter');
    }

    async Send_on_Search_Here_Raal_Product() {
        await this.web.fill(Homepage.searchTextbox, "WES960065");
        await this.page.keyboard.press('Enter');
    }

    async searchProductBySku(sku: string) {
        await this.web.fill(Homepage.searchTextbox, sku);
        await this.page.keyboard.press('Enter');
    }

    async clickFirstProductFromSearchResults() {
        await this.web.clickonElement(Homepage.productNameInSearchResult);
    }

    async Send_on_Search_Here_Raal_Product_UAT() {
        await this.web.fill(Homepage.searchTextbox, "Mah434543");
        await this.page.keyboard.press('Enter');
    }

    async Send_on_Search_Here_Outoff_stock() {
        await this.web.fill(Homepage.searchTextbox, "Raj863120");
        await this.page.keyboard.press('Enter');
    }

    async Click_on_cart() {
        await this.web.clickonElement(Homepage.CartIcon);
    }

    async openCartFromHeader() {
        await this.Click_on_cart();
    }

    async isCartBadgeVisible(): Promise<boolean> {
        return await this.page.locator(Homepage.cartQuantityBadge).isVisible().catch(() => false);
    }

    async getCartProductQuantitySafe(): Promise<number> {
        if (!(await this.isCartBadgeVisible())) {
            return 0;
        }
        const qtyText = (await this.page.locator(Homepage.cartQuantityBadge).textContent())?.trim() || "0";
        return parseInt(qtyText, 10);
    }

    async getCartProductQuantity(): Promise<number> {
        const qtyText = (await this.page.locator(Homepage.cartQuantityBadge).textContent())?.trim() || "0";
        return parseInt(qtyText, 10);
    }

    async Click_on_Proceed_to_CheckOut() {
        await this.web.clickonElement(Homepage.proceedToCheckoutButton);
    }

    async Click_on_Product() {
        await this.web.clickonElement(Homepage.productNameInSearchResult);
    }

    async Order_Success_Massage(): Promise<string> {
        await this.page.locator(Homepage.orderSuccessMessage).waitFor({ state: 'visible', timeout: 10000 });
        return (await this.page.locator(Homepage.orderSuccessMessage).textContent())?.trim() || "";
    }

    async Click_on_Customer_Name_Button() {
        await this.web.clickonElement(Homepage.customerNameButton);
    }

    async Click_on_My_Account() {
        await this.web.clickonElement(Homepage.myAccountLink);
    }

    async Click_on_logo() {
        await this.web.clickonElement(Homepage.logo);
    }

    async Click_on_My_Wish_List() {
        await this.web.clickonElement(Homepage.myWishListLink);
    }

    async Click_on_Sign_Out() {
        await this.web.clickonElement(Homepage.signOutLink);
    }

    async Click_on_Vendar_Resistration() {
        await this.web.clickonElement(Homepage.vendorRegistrationLink);
    }

    async Click_on_Vendar_LogIn() {
        await this.web.clickonElement(Homepage.vendorLoginLink);
    }

    async verifyNoProductHasZeroPrice() {
        const prices = this.page.locator(Homepage.productPriceItems);
        const count = await prices.count();
        for (let i = 0; i < count; i++) {
            const rawPrice = (await prices.nth(i).textContent()) || "";
            const normalized = rawPrice.replace(/[^\d.]/g, "");
            const price = normalized ? parseFloat(normalized) : 0;
            if (!(price > 0)) {
                throw new Error(`Product with zero price found at index ${i}: ${rawPrice}`);
            }
        }
    }

    async Click_on_return_requests_link() {
        await this.web.clickonElement(Homepage.returnRequestsLink);
    }


}