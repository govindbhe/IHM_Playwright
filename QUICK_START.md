# Quick Start Guide - IHM Playwright Automation

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies
```bash
cd f:\IHM_Automation\IHM_Playwright_Automation
npm install
```

### Step 2: Run Tests
```bash
# Run all tests
npm test

# Run with browser visible (headed mode)
npm run test:headed

# Run specific test suite
npm run test:cart
npm run test:search
npm run test:seller
```

### Step 3: View Results
```bash
npm run test:report
```

## 📁 Project Structure

```
IHM_Playwright_Automation/
├── tests/ui/                        # Test files (.spec.ts)
├── page-objects/
│   ├── page-steps/                 # Step definitions (TypeScript)
│   └── page-elements/              # Locators (JSON files)
├── testdata/ui/                     # Test data (JSON files)
├── commons/ui/                      # Shared utilities
└── playwright.config.ts             # Framework configuration
```

## 🧪 Available Test Scripts

| Command | Description |
|---------|---|
| `npm test` | Run all tests |
| `npm run test:headed` | Run with visible browser |
| `npm run test:debug` | Run in debug mode |
| `npm run test:ui` | Run with Playwright UI |
| `npm run test:report` | View HTML report |
| `npm run test:create-account` | Account creation tests |
| `npm run test:cart` | Shopping cart tests |
| `npm run test:search` | Product search tests |
| `npm run test:seller` | Seller management tests |
| `npm run test:wishlist` | Wishlist tests |
| `npm run test:checkout` | Checkout tests |

## 📝 Test Structure (Arrange-Act-Assert)

Every test follows this pattern:

```typescript
test("Descriptive test name", async ({ page }) => {
    // ARRANGE - Set up test data
    const testData = { ... };
    
    // ACT - Perform user actions
    await pageSteps.action1();
    await pageSteps.action2();
    
    // ASSERT - Verify results
    expect(result).toBe(expectedValue);
    console.log("✓ Test passed");
});
```

## 🔧 Common Tasks

### Running a Single Test File
```bash
npx playwright test tests/ui/create-account.spec.ts
```

### Running a Single Test
```bash
npx playwright test -g "Test Description"
```

### Running Tests in Debug Mode
```bash
npm run test:debug
```

### Updating Element Locators
1. Open `page-objects/page-elements/*.json`
2. Update the locator selector
3. Save file
4. Re-run tests

### Adding a New Test
1. Create new `.spec.ts` file in `tests/ui/`
2. Import necessary page-steps
3. Create test using Arrange-Act-Assert pattern
4. Run test: `npm test`

## 📊 Example: Testing Product Search

```typescript
import { HomePageSteps } from "../../page-objects/page-steps/home-page-steps";
import { ProductPageSteps } from "../../page-objects/page-steps/product-page-steps";
import data from '../../testdata/ui/data.json' with { type: 'json' };

test("Search for product", async ({ page }) => {
    const homeSteps = new HomePageSteps(page);
    const productSteps = new ProductPageSteps(page);
    
    // Arrange
    const searchTerm = data.productSearch.searchTerm;
    
    // Act
    await homeSteps.launchApplication(data.loginOTP.loginURL);
    await homeSteps.searchProduct(searchTerm);
    await homeSteps.clickOnProduct();
    
    // Assert
    await productSteps.verifyProductDetailsVisible();
    console.log("✓ Product search test passed");
});
```

## 🎯 Test Coverage

- ✅ Account Management (6 tests)
- ✅ Product Search (7 tests)
- ✅ Shopping Cart (7 tests)
- ✅ Wishlist (5 tests)
- ✅ Seller Management (8 tests)
- ✅ Order Processing (8 tests)
- ✅ Checkout (7 tests)

**Total: 50+ Test Cases**

## 🐛 Troubleshooting

### Tests Failing?
1. **Check Locators** - Review `page-objects/page-elements/` JSON files
2. **Check Test Data** - Verify `testdata/ui/` JSON files
3. **Check URL** - Ensure application is accessible
4. **Check Screenshots** - Review test report for visual clues

### Elements Not Found?
```bash
# Run test in debug mode to inspect
npm run test:debug

# Or run with Playwright Inspector
npx playwright test --debug
```

### Slow Tests?
1. Check for unnecessary sleeps/waits
2. Use proper wait conditions: `waitForLoadState('networkidle')`
3. Optimize element locators

## 📚 Documentation

- **README.md** - Comprehensive framework guide
- **CONVERSION_GUIDE.md** - TestNG to Playwright migration details
- **MIGRATION_SUMMARY.md** - Complete conversion statistics

## 🔐 Best Practices

1. **Use Page-Steps** - Never interact with page directly, use page-steps
2. **Separate Data** - Keep test data in JSON files
3. **Use Descriptive Names** - Clear test names help with debugging
4. **Add Logging** - Use console.log for visibility
5. **Follow AAA Pattern** - Arrange-Act-Assert in every test

## 💡 Tips & Tricks

### Tip 1: Parallel Execution
Tests run in parallel by default. Modify in `playwright.config.ts` if needed:
```typescript
workers: process.env.CI ? 1 : 4
```

### Tip 2: Screenshots/Videos
Configure in `playwright.config.ts`:
```typescript
screenshot: 'only-on-failure',
video: 'retain-on-failure'
```

### Tip 3: Update Timeouts
Increase timeout for slow tests:
```bash
npx playwright test --timeout=60000
```

### Tip 4: Use Selectors Assistant
```bash
npx playwright codegen https://www.indiahandmade.com/
```

## 🆘 Getting Help

### Check Existing Tests
- Look at similar tests in `tests/ui/`
- Copy and modify for new scenarios

### Review Page-Steps
- Check `page-objects/page-steps/` for available methods
- Use existing methods for new tests

### Common Issues
- **Element timeout** - Increase wait time in web-common.ts
- **Flaky tests** - Add proper wait conditions
- **Parallel issues** - Isolate test data per test

## 📈 Next Steps

1. ✅ Run all tests: `npm test`
2. ✅ View report: `npm run test:report`
3. ✅ Update test data if needed
4. ✅ Add new tests following the pattern
5. ✅ Integrate with CI/CD

## 🎓 Learning Resources

### Playwright Docs
- https://playwright.dev

### Best Practices
- https://playwright.dev/docs/best-practices

### API Reference
- https://playwright.dev/docs/api/class-test

### Debugging
- https://playwright.dev/docs/debug

---

**Framework Version:** 2.0.0 (Converted from TestNG)  
**Status:** ✅ Production Ready  
**Last Updated:** 2024

**Happy Testing! 🎉**
