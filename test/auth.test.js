const puppeteer = require('puppeteer');

// Test configuration
const baseUrl = 'http://localhost:5000';
const testTimeout = 30000; // 30 seconds

// Test user data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'Password123!',
  confirmPassword: 'Password123!'
};

describe('BankDash Authentication Tests', () => {
  let browser;
  let page;
  let consoleLogs = [];
  let consoleErrors = [];
  let networkErrors = [];

  // Setup before tests
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false, // Set to true for headless mode
      slowMo: 100, // Slow down operations by 100ms
      args: ['--window-size=1366,768']
    });
    page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    
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
  });

  // Test: Navigate to registration page
  test('Navigate to registration page', async () => {
    await page.goto(`${baseUrl}/login.html`, { waitUntil: 'networkidle2' });
    
    // Take a screenshot of login page
    await page.screenshot({ path: 'test/screenshots/login-page.png', fullPage: true });
    
    // Find and click the registration link
    const registerLink = await page.$('a[href="/register.html"]');
    expect(registerLink).not.toBeNull();
    
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      registerLink.click()
    ]);
    
    // Take a screenshot of registration page
    await page.screenshot({ path: 'test/screenshots/register-page.png', fullPage: true });
    
    // Verify we're on the registration page
    const currentUrl = page.url();
    expect(currentUrl).toContain('register.html');
    
    // Check for console errors
    console.log('Console Logs:', consoleLogs);
    console.log('Console Errors:', consoleErrors);
    console.log('Network Errors:', networkErrors);
  }, testTimeout);

  // Test: User registration
  test('User registration process', async () => {
    await page.goto(`${baseUrl}/register.html`, { waitUntil: 'networkidle2' });
    
    // Fill in registration form
    await page.type('#name', testUser.name);
    await page.type('#email', testUser.email);
    await page.type('#password', testUser.password);
    await page.type('#confirm-password', testUser.confirmPassword);
    
    // Take a screenshot of filled form
    await page.screenshot({ path: 'test/screenshots/register-form-filled.png', fullPage: true });
    
    // Submit the form
    const registerButton = await page.$('#register-button');
    
    if (registerButton) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {}),
        registerButton.click()
      ]);
    } else {
      // If there's no specific register button, try to submit the form
      const form = await page.$('form');
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {}),
        form.evaluate(form => form.submit())
      ]);
    }
    
    // Take a screenshot after registration attempt
    await page.screenshot({ path: 'test/screenshots/after-register.png', fullPage: true });
    
    // Check for console errors
    console.log('Console Logs after registration:', consoleLogs);
    console.log('Console Errors after registration:', consoleErrors);
    console.log('Network Errors after registration:', networkErrors);
    
    // Check if we were redirected to login page or dashboard
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/(login\.html|dashboard|index\.html)/);
  }, testTimeout);

  // Test: User login
  test('User login process', async () => {
    await page.goto(`${baseUrl}/login.html`, { waitUntil: 'networkidle2' });
    
    // Fill in login form
    await page.type('#email', testUser.email);
    await page.type('#password', testUser.password);
    
    // Take a screenshot of filled login form
    await page.screenshot({ path: 'test/screenshots/login-form-filled.png', fullPage: true });
    
    // Submit the form
    const loginButton = await page.$('#login-button');
    
    if (loginButton) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {}),
        loginButton.click()
      ]);
    } else {
      // If there's no specific login button, try to submit the form
      const form = await page.$('form');
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {}),
        form.evaluate(form => form.submit())
      ]);
    }
    
    // Take a screenshot after login attempt
    await page.screenshot({ path: 'test/screenshots/after-login.png', fullPage: true });
    
    // Check for console errors
    console.log('Console Logs after login:', consoleLogs);
    console.log('Console Errors after login:', consoleErrors);
    console.log('Network Errors after login:', networkErrors);
    
    // Check if we're on the dashboard page
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/(dashboard|index\.html)/);
    
    // Check for authentication token in localStorage
    const hasToken = await page.evaluate(() => {
      return localStorage.getItem('token') !== null;
    });
    
    console.log('Has authentication token:', hasToken);
    
    // Verify dashboard elements are present
    const dashboardElement = await page.$('.dashboard-container, #dashboard, .main-content');
    expect(dashboardElement).not.toBeNull();
  }, testTimeout);

  // Test: Failed login attempt
  test('Failed login attempt with invalid credentials', async () => {
    await page.goto(`${baseUrl}/login.html`, { waitUntil: 'networkidle2' });
    
    // Fill in login form with invalid credentials
    await page.type('#email', 'invalid@example.com');
    await page.type('#password', 'wrongpassword');
    
    // Take a screenshot of filled login form
    await page.screenshot({ path: 'test/screenshots/invalid-login-form.png', fullPage: true });
    
    // Submit the form
    const loginButton = await page.$('#login-button');
    
    if (loginButton) {
      // Click login button and don't expect navigation to complete
      await loginButton.click();
      // Wait a moment for error messages
      await page.waitForTimeout(1000);
    } else {
      // If there's no specific login button, try to submit the form
      const form = await page.$('form');
      await form.evaluate(form => form.submit());
      // Wait a moment for error messages
      await page.waitForTimeout(1000);
    }
    
    // Take a screenshot after failed login attempt
    await page.screenshot({ path: 'test/screenshots/after-failed-login.png', fullPage: true });
    
    // Check for console errors
    console.log('Console Logs after failed login:', consoleLogs);
    console.log('Console Errors after failed login:', consoleErrors);
    console.log('Network Errors after failed login:', networkErrors);
    
    // Check if we're still on the login page
    const currentUrl = page.url();
    expect(currentUrl).toContain('login.html');
    
    // Check for error message on page
    const errorMessage = await page.evaluate(() => {
      const errorElement = document.querySelector('.error-message, .alert-danger, #error-message');
      return errorElement ? errorElement.textContent : null;
    });
    
    console.log('Error message:', errorMessage);
    
    // Verify we're still on login page
    const loginForm = await page.$('form');
    expect(loginForm).not.toBeNull();
  }, testTimeout);

  // Test: Logout functionality
  test('User logout process', async () => {
    // First ensure we're logged in
    await page.goto(`${baseUrl}/login.html`, { waitUntil: 'networkidle2' });
    await page.type('#email', testUser.email);
    await page.type('#password', testUser.password);
    
    const loginButton = await page.$('#login-button');
    if (loginButton) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {}),
        loginButton.click()
      ]);
    } else {
      const form = await page.$('form');
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {}),
        form.evaluate(form => form.submit())
      ]);
    }
    
    // Now attempt to logout
    const logoutButton = await page.$('.logout-button, #logout, a[href="/logout"]');
    
    if (logoutButton) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {}),
        logoutButton.click()
      ]);
      
      // Take a screenshot after logout
      await page.screenshot({ path: 'test/screenshots/after-logout.png', fullPage: true });
      
      // Check if we're redirected to login page
      const currentUrl = page.url();
      expect(currentUrl).toContain('login.html');
      
      // Check for console errors
      console.log('Console Logs after logout:', consoleLogs);
      console.log('Console Errors after logout:', consoleErrors);
      console.log('Network Errors after logout:', networkErrors);
      
      // Verify token is removed from localStorage
      const hasToken = await page.evaluate(() => {
        return localStorage.getItem('token') !== null;
      });
      
      console.log('Has token after logout:', hasToken);
      expect(hasToken).toBe(false);
    } else {
      console.log('Logout button not found, may need to use a different selector');
      // Take a screenshot to help debug
      await page.screenshot({ path: 'test/screenshots/logout-button-not-found.png', fullPage: true });
    }
  }, testTimeout);
}); 