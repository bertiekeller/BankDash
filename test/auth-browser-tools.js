const puppeteer = require('puppeteer');

/**
 * This script demonstrates using browser-tools to check for console errors
 * during login and registration processes in the BankDash application.
 */
async function runAuthBrowserToolsDemo() {
  console.log('Starting Auth Browser Tools Demo');
  
  // Launch browser
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100,
    args: ['--window-size=1366,768']
  });
  
  // Test user data
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'Password123!',
    confirmPassword: 'Password123!'
  };
  
  try {
    // Create a new page
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    
    // Setup console log listeners
    page.on('console', (msg) => {
      console.log(`Browser Console [${msg.type()}]: ${msg.text()}`);
    });
    
    // Setup console error listeners for uncaught exceptions
    page.on('pageerror', (error) => {
      console.error('Browser Uncaught Exception:', error.message);
    });
    
    // Setup network error listeners
    page.on('requestfailed', (request) => {
      console.error('Network Error:', `${request.method()} ${request.url()} failed: ${request.failure().errorText}`);
    });
    
    // Setup network success listeners
    page.on('requestfinished', (request) => {
      console.log('Network Success:', `${request.method()} ${request.url()}`);
    });
    
    // 1. Test Registration Process
    console.log('\n=== TESTING REGISTRATION PROCESS ===\n');
    
    // Navigate to registration page
    console.log('Navigating to registration page...');
    await page.goto('http://localhost:5000/register.html', { waitUntil: 'networkidle2' });
    
    // Take a screenshot
    await page.screenshot({ path: 'test/screenshots/auth-tools-register.png', fullPage: true });
    
    // Fill in registration form
    console.log('Filling registration form...');
    await page.type('#name', testUser.name);
    await page.type('#email', testUser.email);
    await page.type('#password', testUser.password);
    await page.type('#confirm-password', testUser.confirmPassword);
    
    // Take a screenshot of filled form
    await page.screenshot({ path: 'test/screenshots/auth-tools-register-filled.png', fullPage: true });
    
    // Submit the form
    console.log('Submitting registration form...');
    const registerButton = await page.$('#register-button');
    
    if (registerButton) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {}),
        registerButton.click()
      ]);
    } else {
      // If there's no specific register button, try to submit the form
      const form = await page.$('form');
      if (form) {
        await Promise.all([
          page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {}),
          form.evaluate(form => form.submit())
        ]);
      } else {
        console.log('Registration form not found');
      }
    }
    
    // Take a screenshot after registration attempt
    await page.screenshot({ path: 'test/screenshots/auth-tools-after-register.png', fullPage: true });
    console.log('Current URL after registration:', page.url());
    
    // 2. Test Login Process
    console.log('\n=== TESTING LOGIN PROCESS ===\n');
    
    // Navigate to login page
    console.log('Navigating to login page...');
    await page.goto('http://localhost:5000/login.html', { waitUntil: 'networkidle2' });
    
    // Take a screenshot
    await page.screenshot({ path: 'test/screenshots/auth-tools-login.png', fullPage: true });
    
    // Fill in login form
    console.log('Filling login form...');
    await page.type('#email', testUser.email);
    await page.type('#password', testUser.password);
    
    // Take a screenshot of filled form
    await page.screenshot({ path: 'test/screenshots/auth-tools-login-filled.png', fullPage: true });
    
    // Submit the form
    console.log('Submitting login form...');
    const loginButton = await page.$('#login-button');
    
    if (loginButton) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {}),
        loginButton.click()
      ]);
    } else {
      // If there's no specific login button, try to submit the form
      const form = await page.$('form');
      if (form) {
        await Promise.all([
          page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {}),
          form.evaluate(form => form.submit())
        ]);
      } else {
        console.log('Login form not found');
      }
    }
    
    // Take a screenshot after login attempt
    await page.screenshot({ path: 'test/screenshots/auth-tools-after-login.png', fullPage: true });
    console.log('Current URL after login:', page.url());
    
    // Check for authentication token in localStorage
    const hasToken = await page.evaluate(() => {
      return localStorage.getItem('token') !== null;
    });
    
    console.log('Has authentication token:', hasToken);
    
    // 3. Test Failed Login
    console.log('\n=== TESTING FAILED LOGIN ===\n');
    
    // Navigate to login page
    console.log('Navigating to login page...');
    await page.goto('http://localhost:5000/login.html', { waitUntil: 'networkidle2' });
    
    // Fill in login form with invalid credentials
    console.log('Filling login form with invalid credentials...');
    await page.type('#email', 'invalid@example.com');
    await page.type('#password', 'wrongpassword');
    
    // Take a screenshot of filled form
    await page.screenshot({ path: 'test/screenshots/auth-tools-invalid-login.png', fullPage: true });
    
    // Submit the form
    console.log('Submitting login form with invalid credentials...');
    const invalidLoginButton = await page.$('#login-button');
    
    if (invalidLoginButton) {
      // Click login button and don't expect navigation to complete
      await invalidLoginButton.click();
      // Wait a moment for error messages
      await page.waitForTimeout(1000);
    } else {
      // If there's no specific login button, try to submit the form
      const form = await page.$('form');
      if (form) {
        await form.evaluate(form => form.submit());
        // Wait a moment for error messages
        await page.waitForTimeout(1000);
      } else {
        console.log('Login form not found');
      }
    }
    
    // Take a screenshot after failed login attempt
    await page.screenshot({ path: 'test/screenshots/auth-tools-after-failed-login.png', fullPage: true });
    console.log('Current URL after failed login:', page.url());
    
    // Check for error message on page
    const errorMessage = await page.evaluate(() => {
      const errorElement = document.querySelector('.error-message, .alert-danger, #error-message');
      return errorElement ? errorElement.textContent : null;
    });
    
    console.log('Error message:', errorMessage);
    
    // Wait for user to see the results
    console.log('\nDemo completed. Waiting 5 seconds before closing...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
  } catch (error) {
    console.error('Error during demo:', error);
  } finally {
    // Close the browser
    await browser.close();
    console.log('Browser closed. Demo finished.');
  }
}

// Run the demo
runAuthBrowserToolsDemo().catch(console.error); 