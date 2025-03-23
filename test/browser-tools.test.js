const puppeteer = require('puppeteer');

// Test configuration
const baseUrl = 'http://localhost:5000';
const testTimeout = 30000; // 30 seconds

describe('BankDash Browser Tools Tests', () => {
  let browser;
  let page;
  let consoleLogs = [];
  let consoleErrors = [];
  let networkErrors = [];
  let networkSuccesses = [];

  // Setup before tests
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 100,
      args: ['--window-size=1366,768']
    });
    page = await browser.newPage();
    
    // Setup console log listeners
    page.on('console', (msg) => {
      consoleLogs.push(msg.text());
      // Also capture error logs from console.error
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Setup console error listeners for uncaught exceptions
    page.on('pageerror', (error) => {
      consoleErrors.push(error.message);
    });
    
    // Setup network error listeners
    page.on('requestfailed', (request) => {
      networkErrors.push(`${request.method()} ${request.url()} failed: ${request.failure().errorText}`);
    });
    
    // Setup network success listeners
    page.on('requestfinished', (request) => {
      networkSuccesses.push(`${request.method()} ${request.url()} succeeded`);
    });
    
    await page.setViewport({ width: 1366, height: 768 });
  }, testTimeout);

  // Teardown after tests
  afterAll(async () => {
    await browser.close();
  });

  // Clear logs between tests
  beforeEach(() => {
    consoleLogs = [];
    consoleErrors = [];
    networkErrors = [];
    networkSuccesses = [];
  });

  // Test: Homepage loads and logs are captured
  test('Homepage loads and logs are captured', async () => {
    await page.goto(baseUrl, { waitUntil: 'networkidle2' });
    
    // Take a screenshot
    await page.screenshot({ path: 'test/screenshots/browser-tools-homepage.png', fullPage: true });
    
    // Log the captured logs
    console.log('Console Logs:', consoleLogs);
    console.log('Console Errors:', consoleErrors);
    console.log('Network Errors:', networkErrors);
    console.log('Network Successes (sample):', networkSuccesses.slice(0, 5));
    
    // We expect some console errors related to 401 and 404 responses, which are normal for this app
    // Just verify that we can capture them
    expect(consoleErrors.length).toBeGreaterThan(0);
    expect(consoleErrors.some(error => error.includes('401') || error.includes('404'))).toBe(true);
  }, testTimeout);

  // Test: Execute JavaScript in the browser
  test('Execute JavaScript in the browser', async () => {
    await page.goto(baseUrl, { waitUntil: 'networkidle2' });
    
    // Execute JavaScript in the browser
    const result = await page.evaluate(() => {
      console.log('This is a test log from the browser');
      console.error('This is a test error from the browser');
      return document.title;
    });
    
    console.log('Page title from evaluate:', result);
    console.log('Console Logs after evaluate:', consoleLogs);
    console.log('Console Errors after evaluate:', consoleErrors);
    
    // Check if our logs were captured
    expect(consoleLogs).toContain('This is a test log from the browser');
    expect(consoleErrors).toContain('This is a test error from the browser');
  }, testTimeout);

  // Test: Hover and click elements
  test('Hover and click elements', async () => {
    await page.goto(baseUrl, { waitUntil: 'networkidle2' });
    
    // Try to find a navigation menu item to hover
    const navItems = await page.$$('nav a');
    
    if (navItems.length > 0) {
      // Hover over the first nav item
      await navItems[0].hover();
      
      // Take a screenshot after hovering
      await page.screenshot({ path: 'test/screenshots/hover-nav-item.png', fullPage: false });
      
      // Click the nav item
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {}),
        navItems[0].click()
      ]);
      
      // Take a screenshot after clicking
      await page.screenshot({ path: 'test/screenshots/after-nav-click.png', fullPage: true });
    }
    
    // Log the navigation
    console.log('Current URL:', page.url());
  }, testTimeout);
}); 