const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Ensure screenshots directory exists
const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Configuration
const BASE_URL = 'http://localhost:5000';
const SCREENSHOT_PATH = path.join(screenshotsDir, 'dashboard-test-');
const TIMEOUT = 30000; // 30 seconds

describe('BankDash Dashboard Tests', () => {
  let browser;
  let page;
  let consoleLogs = [];
  let consoleErrors = [];

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 800 },
      args: ['--window-size=1280,800']
    });
    page = await browser.newPage();

    // Setup console log listeners
    page.on('console', (msg) => {
      consoleLogs.push(msg.text());
    });

    page.on('pageerror', (error) => {
      consoleErrors.push(error.message);
    });

    // Set default timeout
    page.setDefaultTimeout(TIMEOUT);
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(() => {
    consoleLogs = [];
    consoleErrors = [];
  });

  test('User can register and login', async () => {
    // Navigate to registration page
    await page.goto(`${BASE_URL}/register.html`);
    await page.screenshot({ path: `${SCREENSHOT_PATH}register.png` });
    
    // Fill registration form
    await page.type('#name', 'Test User');
    await page.type('#email', 'test@example.com');
    await page.type('#password', 'password123');
    await page.type('#confirm-password', 'password123');
    await page.click('#terms');
    
    // Submit registration form
    await Promise.all([
      page.click('.auth-button'),
      page.waitForNavigation({ waitUntil: 'networkidle0' })
    ]);
    
    // Check if we're redirected to the dashboard
    const url = page.url();
    expect(url).toBe(`${BASE_URL}/`);
    
    // Take a screenshot of the dashboard
    await page.screenshot({ path: `${SCREENSHOT_PATH}after-login.png` });
    
    // Check for console errors
    expect(consoleErrors).toHaveLength(0);
  });

  test('Dashboard page displays correctly', async () => {
    // Ensure we're on the dashboard page
    await page.goto(BASE_URL);
    
    // Check if dashboard elements are visible
    await page.waitForSelector('#dashboard-page');
    const isDashboardVisible = await page.$eval('#dashboard-page', el => 
      window.getComputedStyle(el).display !== 'none'
    );
    expect(isDashboardVisible).toBe(true);
    
    // Check for total balance, income, and expenses
    await page.waitForSelector('#total-balance');
    await page.waitForSelector('#total-income');
    await page.waitForSelector('#total-expenses');
    
    // Check for recent transactions
    await page.waitForSelector('#recent-transactions-list');
    
    // Take a screenshot
    await page.screenshot({ path: `${SCREENSHOT_PATH}dashboard.png` });
    
    // Check for console errors
    expect(consoleErrors).toHaveLength(0);
  });

  test('User can navigate to Transactions page', async () => {
    // Click on Transactions link
    await page.click('#transactions-link');
    
    // Check if transactions page is visible
    await page.waitForSelector('#transactions-page');
    const isTransactionsVisible = await page.$eval('#transactions-page', el => 
      window.getComputedStyle(el).display !== 'none'
    );
    expect(isTransactionsVisible).toBe(true);
    
    // Check for transactions table
    await page.waitForSelector('.transactions-table');
    
    // Take a screenshot
    await page.screenshot({ path: `${SCREENSHOT_PATH}transactions.png` });
    
    // Check for console errors
    expect(consoleErrors).toHaveLength(0);
  });

  test('User can navigate to Cards page', async () => {
    // Click on Cards link
    await page.click('#cards-link');
    
    // Check if cards page is visible
    await page.waitForSelector('#cards-page');
    const isCardsVisible = await page.$eval('#cards-page', el => 
      window.getComputedStyle(el).display !== 'none'
    );
    expect(isCardsVisible).toBe(true);
    
    // Check for cards grid
    await page.waitForSelector('#cards-grid');
    
    // Take a screenshot
    await page.screenshot({ path: `${SCREENSHOT_PATH}cards.png` });
    
    // Check for console errors
    expect(consoleErrors).toHaveLength(0);
  });

  test('User can navigate to Analytics page', async () => {
    // Click on Analytics link
    await page.click('#analytics-link');
    
    // Check if analytics page is visible
    await page.waitForSelector('#analytics-page');
    const isAnalyticsVisible = await page.$eval('#analytics-page', el => 
      window.getComputedStyle(el).display !== 'none'
    );
    expect(isAnalyticsVisible).toBe(true);
    
    // Check for analytics elements
    await page.waitForSelector('.chart-container');
    await page.waitForSelector('.spending-categories');
    
    // Take a screenshot
    await page.screenshot({ path: `${SCREENSHOT_PATH}analytics.png` });
    
    // Check for console errors
    expect(consoleErrors).toHaveLength(0);
  });

  test('User can navigate to Messages page', async () => {
    // Click on Messages link
    await page.click('#messages-link');
    
    // Check if messages page is visible
    await page.waitForSelector('#messages-page');
    const isMessagesVisible = await page.$eval('#messages-page', el => 
      window.getComputedStyle(el).display !== 'none'
    );
    expect(isMessagesVisible).toBe(true);
    
    // Check for messages list
    await page.waitForSelector('#messages-list');
    
    // Take a screenshot
    await page.screenshot({ path: `${SCREENSHOT_PATH}messages.png` });
    
    // Check for console errors
    expect(consoleErrors).toHaveLength(0);
  });

  test('User can logout', async () => {
    // Click on logout button
    await Promise.all([
      page.click('#logout-button'),
      page.waitForNavigation({ waitUntil: 'networkidle0' })
    ]);
    
    // Check if we're redirected to the login page
    const url = page.url();
    expect(url).toBe(`${BASE_URL}/login.html`);
    
    // Take a screenshot
    await page.screenshot({ path: `${SCREENSHOT_PATH}after-logout.png` });
    
    // Check for console errors
    expect(consoleErrors).toHaveLength(0);
  });
}); 