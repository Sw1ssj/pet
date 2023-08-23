const puppeteer = require('puppeteer');
const fs = require("fs");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
    // Launching browser and opening a new page
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Navigating to a URL
    await page.goto('https://www.instagram.com');  // Replace with your desired URL

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');


    // Waiting for 100 seconds
    await sleep(100 * 1000);

    // Fetching cookies
    const cookies = await page.cookies();

    // Saving cookies to a file
    fs.writeFileSync('cookies3.json', JSON.stringify(cookies, null, 4));

    // Closing the browser
    await browser.close();

    console.log('Cookies saved!');
})();
