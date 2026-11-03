# IHM Playwright Automation - Converted from TestNG

## Project Overview

This is a comprehensive test automation framework converted from TestNG (Selenium) to Playwright following Test-Driven Development (TDD) principles. The framework is designed for testing the India Handmade e-commerce application.

## Project Structure

```
IHM_Playwright_Automation/
├── commons/
│   └── ui/
│       └── web-common.ts          # Common UI utilities and methods
├── config/
│   └── config.json                # Configuration settings
├── page-objects/
│   ├── page-elements/
│   │   ├── home-page-elements.json
│   │   ├── product-page-elements.json
│   │   ├── create-account-elements.json
│   │   ├── cart-page-elements.json
│   │   ├── seller-login-elements.json
│   │   └── dashboard-elements.json
│   └── page-steps/
│       ├── home-page-steps.ts
│       ├── product-page-steps.ts
│       ├── create-account-steps.ts
│       ├── cart-page-steps.ts
│       ├── seller-login-steps.ts
│       ├── dashboard-page-steps.ts
│       ├── product-add-steps.ts
│       ├── product-edit-steps.ts
│       ├── order-processing-steps.ts
│       ├── shipping-address-steps.ts
│       └── wishlist-steps.ts
├── tests/
│   └── ui/
│       ├── login.spec.ts                    # Login tests
│       ├── create-account.spec.ts           # Account creation tests
│       ├── add-to-cart.spec.ts              # Add to cart tests
│       ├── product-search.spec.ts           # Product search tests
│       ├── wishlist.spec.ts                 # Wishlist tests
│       ├── seller-management.spec.ts        # Seller management tests
│       ├── seller-order-processing.spec.ts  # Seller order processing tests
│       └── checkout.spec.ts                 # Checkout tests
├── testdata/
│   └── ui/
│       ├── data.json                  # General test data
│       ├── account-data.json          # Account test data
│       └── seller-data.json           # Seller test data
├── playwright.config.ts               # Playwright configuration
├── package.json                       # Project dependencies
└── playwright-report/                 # Test reports (generated)
```

## Test Coverage

### Account Management
- **create-account.spec.ts**
  - Account creation with validation
  - Home page verification after account creation
  - Login and logout flow
  - Email and password validation

### Product Management (Customer)
- **add-to-cart.spec.ts**
  - Add to cart button visibility for in-stock products
  - Add to cart button hidden for out-of-stock products
  - Add to cart workflow for logged-in users
  - Add to cart workflow for guest users
  - Cart total calculation
  - Cart item count verification

- **product-search.spec.ts**
  - Search for products by name
  - View product details
  - Filter by category
  - Sort products by price
  - Pagination
  - Search with no results

- **wishlist.spec.ts**
  - Add product to wishlist
  - View wishlist and verify products
  - Remove product from wishlist
  - Add multiple products to wishlist

- **checkout.spec.ts**
  - Add product to cart and proceed
  - View cart items
  - Update cart item quantity
  - Remove item from cart
  - Proceed to shipping
  - Order summary verification

### Seller Management
- **seller-management.spec.ts**
  - Seller login
  - Add single variant product
  - Add multi-variant product
  - View products list
  - View orders
  - Dashboard navigation
  - Edit product
  - Seller logout

- **seller-order-processing.spec.ts**
  - View pending orders
  - Process order
  - Update order status
  - Add shipping tracking number
  - Cancel order
  - View order history
  - Search order by ID

## Test Data

### data.json
- Login credentials (OTP)
- Create account details
- Product search terms
- Seller credentials

### account-data.json
- Account creation test data

### seller-data.json
- Seller login credentials
- Product information for testing

## Running Tests

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run Tests in Headed Mode
```bash
npm run test:headed
```

### View Test Report
```bash
npm run test:report
```

### Run Specific Test File
```bash
npx playwright test tests/ui/create-account.spec.ts
```

### Run Tests with Tags
```bash
npx playwright test --grep @smoke
```

## TDD Format

Each test follows the Arrange-Act-Assert (AAA) pattern:

```typescript
test("Test Description", async ({ page }) => {
    // Arrange - Set up test data
    const testData = { ... };
    
    // Act - Perform actions
    await pageSteps.action();
    
    // Assert - Verify results
    expect(result).toBe(expectedValue);
});
```

## Page Object Model (POM)

The framework uses the Page Object Model pattern with separation of:

1. **Page Elements** (JSON files) - Locators for UI elements
2. **Page Steps** (TypeScript files) - Methods to interact with page elements
3. **Test Specs** (TypeScript files) - Test cases using page steps

### Example - Page Elements (JSON)
```json
{
  "signInButton": "button:has-text('Sign In')",
  "emailInput": "input[name='email']"
}
```

### Example - Page Steps (TypeScript)
```typescript
async clickSignIn() {
    await this.web.clickonElement(elements.signInButton);
}
```

### Example - Test Spec (TypeScript)
```typescript
test("Login test", async ({ page }) => {
    const steps = new LoginSteps(page);
    await steps.clickSignIn();
});
```

## Common Utilities (web-common.ts)

Available methods:
- `LaunchApplication(url)` - Navigate to URL
- `clickonElement(locator)` - Click on element
- `fill(locator, value)` - Fill input field
- `VerifyVisibility(locator)` - Verify element visibility
- `SelectDropdownElement(locator, value)` - Select dropdown
- `scrollIntoElement(locator)` - Scroll to element

## Browser Configuration

Currently configured for:
- **Chromium** - Desktop Chrome

Can be extended to support:
- Firefox
- WebKit (Safari)
- Mobile Chrome
- Mobile Safari

## Reporting

Test reports are generated in HTML format in the `playwright-report` directory after each test run.

View report:
```bash
npm run test:report
```

## CI/CD Integration

Tests are configured to:
- Retry failed tests on CI (2 retries)
- Run sequentially on CI (1 worker)
- Collect traces on first retry
- Take screenshots on failure
- Record videos on failure

## Converted from TestNG

### Original TestNG Test Classes
The following test classes from `IHM_TestNG` have been converted:

1. **Create_Account.java** → create-account.spec.ts
2. **Add_To_Cart_Button.java** → add-to-cart.spec.ts
3. **Product_Searching.java** → product-search.spec.ts
4. **Wishlist_Addition.java** → wishlist.spec.ts
5. **Add_Single_Variant_Product.java** → seller-management.spec.ts
6. **Add_MultiVeriant_Product.java** → seller-management.spec.ts
7. **Add_New_Shipping_Address** → shipping-address-steps.ts
8. **Product_Order.java** → checkout.spec.ts
9. **Seller_Order_Processing.java** → seller-order-processing.spec.ts
10. **Seller_Cancle_order.java** → order-processing-steps.ts
11. And other test classes...

### Key Improvements Over TestNG
- ✅ Better readability with TypeScript
- ✅ Reduced boilerplate code
- ✅ Improved test organization
- ✅ Better reusability through page steps
- ✅ Consistent test structure
- ✅ Built-in parallel execution
- ✅ Superior reporting capabilities
- ✅ Simpler configuration

## Best Practices

1. **Page Steps Organization** - Keep page steps focused and reusable
2. **Test Data Management** - Use JSON files for test data
3. **Element Locators** - Store locators in JSON for easy maintenance
4. **Common Methods** - Use web-common utilities for repeated actions
5. **TDD Pattern** - Follow Arrange-Act-Assert in all tests
6. **Assertions** - Use clear, meaningful assertions
7. **Logging** - Add console logs for test flow visibility

## Troubleshooting

### Tests Failing
1. Check element locators in page-elements JSON files
2. Verify test data in testdata/ui/ files
3. Check if web application is accessible
4. Review screenshots in test results

### Slow Tests
1. Use specific waits instead of implicit waits
2. Optimize element locators
3. Reduce network calls if possible
4. Run tests in headed mode to identify delays

### Flaky Tests
1. Add proper wait conditions
2. Use `waitForLoadState('networkidle')`
3. Increase timeouts for slow elements
4. Check for race conditions

## Contact & Support

For issues or questions regarding this test automation framework, please refer to the original project documentation or contact the development team.

---

**Framework Version:** 1.0.0  
**Last Updated:** 2024  
**Technology Stack:** Playwright, TypeScript, Node.js  
**Original Framework:** Selenium + TestNG
