const puppeteer = require('puppeteer');

// This script demonstrates how to use browser-tools with Puppeteer
async function runBrowserToolsDemo() {
  console.log('Starting Browser Tools Demo');
  
  // Launch browser
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100,
    args: ['--window-size=1366,768']
  });
  
  try {
    // Create a new page
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    
    // Setup console log listeners
    page.on('console', (msg) => {
      console.log('Browser Console Log:', msg.text());
    });
    
    // Setup console error listeners
    page.on('pageerror', (error) => {
      console.error('Browser Console Error:', error.message);
    });
    
    // Setup network error listeners
    page.on('requestfailed', (request) => {
      console.error('Network Error:', `${request.method()} ${request.url()} failed: ${request.failure().errorText}`);
    });
    
    // Setup network success listeners
    page.on('requestfinished', (request) => {
      console.log('Network Success:', `${request.method()} ${request.url()}`);
    });
    
    // Navigate to the application
    console.log('Navigating to application...');
    await page.goto('http://localhost:5000', { waitUntil: 'networkidle2' });
    
    // Take a screenshot
    console.log('Taking screenshot...');
    await page.screenshot({ path: 'test/screenshots/demo-homepage.png', fullPage: true });
    
    // Execute JavaScript in the browser
    console.log('Executing JavaScript in browser...');
    const title = await page.evaluate(() => {
      console.log('This is a log from the browser');
      console.error('This is an error from the browser');
      return document.title;
    });
    
    console.log('Page title:', title);
    
    // Find and interact with elements
    console.log('Interacting with elements...');
    
    // Example: Find all links
    const links = await page.$$('a');
    console.log(`Found ${links.length} links on the page`);
    
    // Example: Hover over a link if available
    if (links.length > 0) {
      console.log('Hovering over first link...');
      await links[0].hover();
      await page.screenshot({ path: 'test/screenshots/demo-hover.png' });
      
      // Get the href attribute
      const href = await page.evaluate(link => link.getAttribute('href'), links[0]);
      console.log('Link href:', href);
      
      // Click the link if it's not external
      if (href && (href.startsWith('/') || href.startsWith('http://localhost'))) {
        console.log('Clicking link...');
        await Promise.all([
          page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {}),
          links[0].click()
        ]);
        
        // Take a screenshot after navigation
        await page.screenshot({ path: 'test/screenshots/demo-after-click.png', fullPage: true });
        console.log('Current URL after click:', page.url());
      }
    }
    
    // Wait for user to see the results
    console.log('Demo completed. Waiting 5 seconds before closing...');
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
runBrowserToolsDemo().catch(console.error); 