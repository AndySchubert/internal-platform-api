const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQ FAIL:', request.url(), request.failure() ? request.failure().errorText : ''));
  
  await page.goto('http://localhost:4200/login');
  await page.waitForSelector('#username');
  await page.type('#username', 'andy.schubert0201@gmail.com');
  await page.type('#password', 'password123');
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation()
  ]).then(() => console.log("Login finished, navigated.")).catch(e => console.log("Login nav error:", e.message));
  
  console.log("Current URL:", page.url());
  await page.waitForTimeout(3000);
  await browser.close();
})();
