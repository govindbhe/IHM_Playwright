
import {expect, Locator, Page} from '@playwright/test'

export class webcommons{
page:Page;

constructor(page:Page){
this.page=page;
}

//common method for element
async Element(locator:string):Promise<Locator>{
 return await this.page.locator(locator);
}
//common method for launch applicatin

async LaunchApplication(url:string):Promise<void>{
 await this.page.goto(url, { waitUntil: 'networkidle' });
 await this.page.waitForURL(url, { timeout: 60000 });
}

//common method for Visibility check

    async VerifyVisibility(locator:string):Promise<void>{
const element=await this.Element(locator);
await expect(element).toBeVisible();
}
// different locator

async Elements(locator:string,LocaterType:string):Promise<Locator>{

    switch (LocaterType.toLocaleLowerCase()){
    case'getBytext':
        return this.page.getByText(locator);
    case'getByLabel':
    return this.page.getByLabel(locator);

    case'getByAlAttribute':
    return this.page.getByAltText(locator);     
    case'getByPlaceholder':
    return this.page.getByPlaceholder(locator);
    case'getByRole':
    return this.page.getByRole(locator as any);
    case'getBytitle':
    return this.page.getByTitle(locator);
    default:
        throw new Error('invalid locator');


    }
}

    //scroll to the elements

    /**
     * Scrolls an element into view.
     *
     * A bounded timeout is important: with no timeout, scrollIntoViewIfNeeded waits on a
     * missing element for the entire remaining test/hook budget instead of failing. That
     * turned single missing elements into 90s+ hangs in several suites.
     */
    async scrollIntoElement(locator:string, timeout = 30000):Promise<void>{
        const element=this.page.locator(locator);
        await element.scrollIntoViewIfNeeded({ timeout });
    }

    //selectDropdown


    async SelectDropdownElement(locator:string, value:string):Promise<void>{

        const element=await this.page.locator(locator);
        await this.scrollIntoElement(locator);
        await element.selectOption(value);
    }
/**
 * Closes a blocking overlay/modal that the site occasionally pops over the page
 * (a feedback/promo <dialog data-fp>). While open it intercepts every pointer event,
 * so clicks fail with "<div> from <dialog> subtree intercepts pointer events".
 *
 * Best-effort and silent: tries known close controls, then Escape, then neutralises
 * any stray open <dialog>/overlay via the DOM. Never throws.
 */
 async dismissBlockingDialog():Promise<void>{
   try {
     const closeSelectors = [
       "dialog[open] [aria-label='Close']",
       "dialog[open] button.close",
       "dialog[open] .close",
       "[data-fp] [aria-label='Close']",
       "button[aria-label='Close']",
       "//button[normalize-space()='No Thanks' or normalize-space()='Close' or normalize-space()='Skip' or normalize-space()='Not Now']",
     ];
     for (const sel of closeSelectors) {
       const btn = this.page.locator(sel).first();
       if (await btn.isVisible({ timeout: 400 }).catch(() => false)) {
         await btn.click({ timeout: 2000 }).catch(() => {});
         await this.page.waitForTimeout(300);
       }
     }

     // If an open dialog/overlay is still around, close/remove it directly.
     await this.page.evaluate(() => {
       document.querySelectorAll('dialog[open]').forEach((d) => {
         try { (d as HTMLDialogElement).close(); } catch { /* not a real <dialog> */ }
         (d as HTMLElement).remove();
       });
       // Stray feedback overlays that are not <dialog> elements.
       document.querySelectorAll('[data-fp]').forEach((el) => (el as HTMLElement).remove());
     }).catch(() => {});
   } catch {
     // dismissal is best-effort; ignore any failure
   }
 }

//click
 async clickonElement(locator:string, timeout = 30000):Promise<void>{
   const element=this.page.locator(locator);
   await this.scrollIntoElement(locator, timeout);
   try {
     await element.click({ timeout });
   } catch (e) {
     // A blocking overlay (e.g. feedback <dialog data-fp>) can intercept the click.
     // Dismiss it and retry once before giving up.
     await this.dismissBlockingDialog();
     await element.click({ timeout });
   }
 }

 //double click
 async doubleckickOnElement(locator:string):Promise<void>{

    const element=await this.page.locator(locator);
    await element.dblclick();
 }

 //force click

 async forceclickOnElement(locator:string):Promise<void>{

    const element=await this.page.locator(locator);
    await this.scrollIntoElement(locator);
    await element.click({'force':true});
 }

 //click on parent link - useful when element is inside a link
 async clickParentLink(locator:string):Promise<void>{
    const element = await this.page.locator(locator);
    await this.scrollIntoElement(locator);
    
    // Try to find and click parent link or clickable ancestor
    const parentLink = element.locator('xpath=ancestor::a[1] | ancestor::button[1] | ancestor::div[@role="button"][1]');
    const parentLocator = await parentLink.count();
    
    if (parentLocator > 0) {
        await parentLink.click();
    } else {
        // If no parent link found, click the element itself
        await element.click({force: true});
    }
 }

 //hover on element
 async hoverOnElement(locator:string):Promise<void>{
   const element=await this.page.locator(locator);
   await element.hover();
   await this.page.waitForTimeout(500); // wait for submenu to appear
 }

 //compare
  async compare(locator:string,expected:string):Promise<void>{
 const element=await this.page.locator(locator);
    await expect(element).toHaveText(expected);
  }

  //enabled
  async verifyisElementEnabled(locator:string):Promise<void>{
  const element=await this.page.locator(locator);
  await expect(element).toBeEnabled();
}

 //disapear
 async verifyElementisHided(locator:string):Promise<void>{
 const element=await this.page.locator(locator);
 await expect(element).toBeHidden();

 }

 //verify element text
 async VerifyElementText(locator:string,expectedText:string):Promise<void>{
    const element=await this.page.locator(locator);
    await expect(element).toHaveText(expectedText);
 }

 //getTextelemnt

 async getElementText(locator:string):Promise<string|null>{
   const element=await this.page.locator(locator);
   await this.scrollIntoElement(locator);
   return await element.textContent();

 }
 //send value in textbox
 async fill(locator:string,value:string):Promise<void>{
    const element=await this.page.locator(locator);
    await this.scrollIntoElement(locator);
    await element.fill(value);
 }
 //verify intering value in textbox
 async verifyEnteredValue(locator:string,expectedValue:string):Promise<void>{
    const element=await this.page.locator(locator);
    await this.scrollIntoElement(locator);
    await expect(element).toHaveValue(expectedValue);
 }
    async ClickAndVerifyNavigation(locator: string, expectedUrl: string): Promise<void> {
        
        // Wait for navigation to complete, then verify URL
        await Promise.all([
            this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
            this.clickonElement(locator)
        ]);
        await expect(this.page).toHaveURL(expectedUrl);
    }

    // Method 2: Click and wait for URL change (better for some cases)
    async clickAndWaitForURL(locator: string, expectedUrl: string): Promise<void> {
        const element = await this.Element(locator);
        await this.scrollIntoElement(locator);
        
        // Click and wait for URL to change
        await element.click();
        await this.page.waitForURL(expectedUrl, { timeout: 10000 });
    }

    // Alternative method with scroll and retry logic
    async clickAndNavigateToPage(locator: string, expectedUrl: string): Promise<void> {
        const element = await this.Element(locator);
        
        // Scroll element into view
        await this.scrollIntoElement(locator);
        
        // Wait a moment for element to be ready
        await this.page.waitForTimeout(500);
        
        // Click and wait for navigation
        try {
            await Promise.all([
                this.page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 10000 }),
                element.click({ force: true })
            ]);
        } catch (error) {
            // If navigation times out, check if we're already on the page
            console.log('Navigation timeout, checking current URL...');
        }
        
        // Verify we're on the correct page
        await expect(this.page).toHaveURL(expectedUrl);
    }

    // Click on parent link if element is nested inside a link
    async clickAndNavigateViaParentLink(locator: string, expectedUrl: string): Promise<void> {
        const element = await this.Element(locator);
        await this.scrollIntoElement(locator);
        
        // Get parent link element
        const parentLink = this.page.locator(`(${locator})/ancestor::a[1] | (${locator})/ancestor::div[@class and contains(@class, 'link')]`);
        
        try {
            await Promise.all([
                this.page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 10000 }),
                parentLink.click()
            ]);
        } catch {
            // If parent not found, try clicking element itself
            await Promise.all([
                this.page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 10000 }),
                element.click({ force: true })
            ]);
        }
        
        await expect(this.page).toHaveURL(expectedUrl);
    }

    // Method to verify URL pattern (useful for URLs with query params)
    async clickAndVerifyURLPattern(locator: string, urlPattern: RegExp | string): Promise<void> {
        await Promise.all([
            this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
            this.clickonElement(locator)
        ]);
        await expect(this.page).toHaveURL(urlPattern);
    }

    // Wait for specific element on new page
    async clickAndVerifyPageElement(clickLocator: string, verifyLocator: string): Promise<void> {
        await Promise.all([
            this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
            this.clickonElement(clickLocator)
        ]);
        await this.VerifyVisibility(verifyLocator);
    }
}
