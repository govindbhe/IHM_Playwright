import { test, expect, TestInfo } from "@playwright/test";

import { Homepagesteps } from "../../page-objects/page-steps/home-page-steps";
import data from '../../testdata/ui/data.json' with {type: 'json'};


let homepagesteps: Homepagesteps;
test.describe('Application UI tests', () => {

    test.beforeEach(async ({ page }) => {
        //initialize the page objects for login page and cookies page
        homepagesteps = new Homepagesteps(page);
    })

    // LOGO AND HEADER TESTS
  /*  test("Verify indiahandmade logo", async ({ page }) => {
        
        await homepagesteps.launchApplication();
        await homepagesteps.verifyIndiahandmadeLogoIsVisible();
    });
    test.slow();

    test("Verify india flag logo", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.verifyIndiaflageIsVisible();
    });
    test.slow();

    test("Verify satyamev jayte logo", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.verifysatyamevJayteLogoIsVisible();
    });
    test.slow();

    // SEARCH AND NAVIGATION TESTS
    test("Verify search box", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.verifySearchBoxIsVisible();
    });
    test.slow();

    test("Verify typing in search box", async () => {
        const testData = data["Verify typing in search box"];
        await homepagesteps.launchApplication();
        await homepagesteps.VerifytypeingInSearchBox(testData.ProductSKU);
    });
    test.slow();

    test("Verify signInLLink", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifysignInLinkIsVisible();
    });
    test.slow();

    test("Verify cart icon", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifycartIconIsvisible();
    })

    // PRODUCT CATEGORY TESTS
    test("Verify home and living category", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyHomeAndLivingCategoryIsVisible();
    })

    test("Verify men category", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyMenCategoryIsVisible();
    })

    test("Verify kids category", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyKidsCategoryIsVisible();
    })

    test("Verify furniture category", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyFurnitureCategoryIsVisible();
    })

    test("Verify painting category", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyPaintingCategoryIsVisible();
    })

    test("Verify GI category", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyGiCategoryIsVisible();
    })

    test("Verify ODOP category", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyODOPCategoryIsVisible();
    })

    // BANNER AND SLIDER TESTS
    test.skip("Verify banner video", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyBannerVideoIsVisible();
    })
  

    test("Verify women kurties banner", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyWomenKurtiesBannerVisibility();
    })

    test("Verify men ethnic wear banner", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.verifyMenEthnicWearBannerVisibility();
    })

    test("Verify saree banner", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifysareeBannerVisibility();
    })

    test("Verify lighting banner", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyLightingVisibility();
    })

    test("Verify religious items banner", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyReligiousItemsVisibility();
    })

    test("Verify kitchen and dining banner", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyKitchenAndDiningVisibility();
    })

    test("Verify stationary banner", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyStationaryVisibility();
    })

    test("Verify paintings banner", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyPaintingsBannerVisibility();
    })

    test("Verify know more button", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyKnowMorebuttonVisibility();
    })

    test("Verify the gateway to India's timeless heritage banner", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyTheGatewaytoIndiasTimelessHeritageBannerIsVisible();
    })

    // FEATURE ICONS TESTS
    test("Verify free shipping icon", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyFreeShippingIconVisibility();
    })

    test("Verify easy return icon", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyEasyReturnIconVisibility();
    })

    test("Verify user check icon", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyUserCheckIconVisibility();
    })

    test("Verify secure payment icon", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifySecurePaymentIconVisibility();
    })

    test("Verify warehouse banner", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyWareHouseBannerVisibility();
    })

    // HOME DECOR BANNERS TESTS
    test("Verify cushion covers banner", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifycushionCuversBannerVisibility();
    })

    test("Verify home decor banner", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyHomeDecoreBannerVisibility();
    })

    test("Verify bedsheet banner", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyBedsheetbannerVisibility();
    })

    test("Verify floor coverings banner", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyFloorCoveringsBannerVisibility();
    })

    test("Verify true reflection banner", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyTrueReflectionBennerVisibility();
    })

    test("Verify furniture banner", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyFurniturebannerVisibility();
    })

    test("Verify women accessories banner", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyWomenAccessoriesBannerVisibility();
    })

    test("Verify toys and games banner", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyToysandGamesBannerVisibility();
    })

    test("Verify ethnic footwears banner", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyEthnicFootwearsBannerVisibility();
    })

    test("Verify women bags banner", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyWomenBagsBannerVisibility();
    })

    test("Verify honoring our banner", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyHoneringOurBannerBannerVisibility();
    })

    test("Verify seller registration banner", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifySellerRegistrationBannerVisibility();
    })

    // FOOTER LINKS - RESOURCES SECTION
    test("Verify resources link", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyResourcesLinkVisibility();
    })

    test("Verify contact us link", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyContactUsLinkVisibility();
    })

    test("Verify about us link", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyAboutUsLinkVisibility();
    })

    test("Verify privacy policy and cookies link", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyprivacypolicyAndcookiesLinkVisibility();
    })

    // FOOTER LINKS - SEARCH SECTION
    test("Verify search term link", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifySearchTermLinLinkVisibility();
    })

    test("Verify advanced search link", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyAdvancedSearchLinkVisibility();
    })

    test("Verify RSS feed link", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyRSSFeedLinkVisibility();
    })

    test("Verify RMA request link", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyRMARequestLinkVisibility();
    })

    // FOOTER LINKS - SUPPORT SECTION
    test("Verify blog link", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyBlogLinkVisibility();
    })

    test("Verify help support link", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyHelpSupportLinkVisibility();
    })

    test("Verify buyers FAQs link", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyBuyersFAQsLinkVisibility();
    })

    test("Verify media gallery link", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyMediaGalleryLinkVisibility();
    })

    test("Verify grievance link", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyGrievanceLinkVisibility();
    })

    test("Verify disclaimer link", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyDisclaimerLinkVisibility();
    })

    // FOOTER LINKS - POLICIES SECTION
    test("Verify privacy policy link", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyPrivacyPolicyLinkVisibility();
    })

    test("Verify shipping policy link", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyShippingPolicyLinkVisibility();
    })

    test("Verify return refund policy link", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyReturnRefundPolicyLinkVisibility();
    })

    test("Verify terms of use buyer link", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyTermsOfUseBuyerLinkVisibility();
    })

    test("Verify terms of use seller link", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyTermsOfUseSellerLinkVisibility();
    })

    // FOOTER LINKS - SOCIAL MEDIA SECTION
    test("Verify Facebook link", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyFacebookLinkkVisibility();
    })

    test("Verify Twitter link", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyTwitterLinkLinkVisibility();
    })

    test("Verify Instagram link", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyInstagramLinkVisibility();
    })

    test("Verify YouTube link", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyYouTubeLinkVisibility();
    })
    test.slow();

    test("Verify LinkedIn link", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyLinkedInLinkVisibility();
    })

    // FOOTER LOGOS AND BADGES SECTION
    test("Verify we accept PNG", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyWeAcceptPngVisibility();
    })

    test("Verify ministry of textile logo", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyMinistryOfTextileLogoVisibility();
    })

    test("Verify Azadi ka Amrit Mahotsav logo", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyAzadiKaAmritMahotsavLogoVisibility();
    })

    test("Verify make in India logo", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyMakeInIndiaLogoVisibility();
    })

    test("Verify cottage emporium logo", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyCottageEmporiumLogoVisibility();
    })

    test("Verify digital India logo", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyDigitalIndiaLogoVisibility();
    })

    test("Verify India gov logo", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyIndiaGovLogoVisibility();
    })

    // ACCESSIBILITY AND ADDITIONAL FEATURES
    test("Verify accessibility options icon", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyAccessibilityOptionsIconVisibility();
    })

    test("Verify WhatsApp beta icon", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyWhatsAppBetaIconIconVisibility();
    })

    test("Verify banner slider prev button", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyBannerSliderPrevButtonVisibility();
    })

    test("Verify banner slider next button", async () => {
        await homepagesteps.launchApplication();
        await homepagesteps.VerifyBannerSliderNextButtonVisibility();
})
        */
    test("Verify IndiahandmadeLogo IsClikable And redirects to homepage", async () => {
        await homepagesteps.launchApplication();

        await homepagesteps.VerifyclickingonIndiahandmadeLogoRedirectsToHomepage();
    })
    test.slow();    
    test("Verify WomenKurtiesBanner IsClikable And redirects to current page", async () => {
        await homepagesteps.launchApplication();    
        await homepagesteps.VerifyclickingonWomenKurtiesBannerRedirectsTocurrentPage();
    })
    test.slow();
    test("Verify MenEthnicWearBanner IsClikable And redirects to current page", async () => {
        await homepagesteps.launchApplication();    
        await homepagesteps.VerifyclickingonMenEthnicWearBannerRedirectsTocurrentPage();
    })
    test.slow();
    test("Verify SareeBanner IsClikable And redirects to current page", async () => {
        await homepagesteps.launchApplication();    
        await homepagesteps.VerifyclickingonSareeBannerRedirectsTocurrentPage();
    })  
    test.slow();
    test("Verify LightingBanner IsClikable And redirects to current page", async () => {
        await homepagesteps.launchApplication();    
        await homepagesteps.VerifyclickingonLightingBannerRedirectsTocurrentPage();
    })
    test.slow();
    test("Verify ReligiousItemsBanner IsClikable And redirects to current page", async () => {
        await homepagesteps.launchApplication();    
        await homepagesteps.VerifyclickingonReligiousItemsBannerRedirectsTocurrentPage();
    }) 
    test.slow(); 
    test("Verify KitchenAndDiningBanner IsClikable And redirects to current page", async () => {
        await homepagesteps.launchApplication();    
        await homepagesteps.VerifyclickingonKitchenAndDiningBannerRedirectsTocurrentPage();
    })
    test.slow();
    test("Verify StationaryBanner IsClikable And redirects to current page", async () => {
        await homepagesteps.launchApplication();    
        await homepagesteps.VerifyclickingonStationaryBannerRedirectsTocurrentPage();
    })
    test.slow();
    test("Verify PaintingsBanner IsClikable And redirects to current page", async () => {
        await homepagesteps.launchApplication();    
        await homepagesteps.VerifyclickingonPaintingsBannerRedirectsTocurrentPage();
    })
    test.slow();

   
    

})