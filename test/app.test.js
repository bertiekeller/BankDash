const puppeteer = require('puppeteer');

// Test configuration
const baseUrl = 'http://localhost:5000';
const testTimeout = 30000; // 30 seconds

describe('BankDash Application Tests', () => {
  let browser;
  let page;

  // Setup before tests
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false, // Set to true for headless mode
      slowMo: 100, // Slow down operations by 100ms
      args: ['--window-size=1366,768']
    });
    page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
  }, testTimeout);

  // Teardown after tests
  afterAll(async () => {
    await browser.close();
  });

  // Test: Homepage loads successfully
  test('Homepage loads successfully', async () => {
    await page.goto(baseUrl, { waitUntil: 'networkidle2' });
    const title = await page.title();
    console.log(`Page title: ${title}`);
    
    // Take a screenshot
    await page.screenshot({ path: 'test/screenshots/homepage.png', fullPage: true });
    
    // Check if the login form exists
    const loginForm = await page.$('#login-form');
    expect(loginForm).not.toBeNull();
  }, testTimeout);

  // Test: Login functionality
  test('User can log in', async () => {
    await page.goto(baseUrl, { waitUntil: 'networkidle2' });
    
    // Fill in login form
    await page.type('#email', 'test@example.com');
    await page.type('#password', 'password123');
    
    // Click login button
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.click('#login-button')
    ]);
    
    // Take a screenshot after login attempt
    await page.screenshot({ path: 'test/screenshots/after-login.png', fullPage: true });
    
    // Check if we're on the dashboard page
    const dashboardElement = await page.$('#dashboard');
    expect(dashboardElement).not.toBeNull();
  }, testTimeout);

  // Test: Navigation menu
  test('Navigation menu works', async () => {
    // Assuming we're already logged in from previous test
    
    // Click on Transactions link
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.click('a[href="/transactions"]')
    ]);
    
    // Take a screenshot of transactions page
    await page.screenshot({ path: 'test/screenshots/transactions.png', fullPage: true });
    
    // Check if transactions table exists
    const transactionsTable = await page.$('#transactions-table');
    expect(transactionsTable).not.toBeNull();
  }, testTimeout);
}); 