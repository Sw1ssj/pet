const puppeteer = require('puppeteer');
const fs = require('fs');
const { createCursor } = require( "ghost-cursor");




function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}




async function follow(account, numOfFollows, cookieLink) {
    // Reading cookies from the file
    const cookiesString = fs.readFileSync(cookieLink);
    const cookies = JSON.parse(cookiesString);

    // Launching browser and opening a new page
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const cursor = createCursor(page);

    // Setting a custom user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    // Setting cookies
    await page.setCookie(...cookies);

    // Navigating to a URL using the saved cookies
    await page.goto('https://www.instagram.com/' + account + "/followers");  // Replace with your desired URL

    // Here, you can perform your further tasks

    await sleep(7000);

    try {
        await randSleepClick(('button._a9--._a9_1'));
    }
    catch(err) {
        console.log("didn't work :(");
    }

    const buttonSelector = 'button._acan._acap._acas._aj1-';
    const buttons = await page.$$(buttonSelector);


    const buttonsToClick = Array.from(buttons).slice(2, 2+ numOfFollows);

    for (const button of buttonsToClick) {
       await randSleepClick(button);
    }



    

    console.log('Page opened with the saved cookies!');

    await sleep(3000);

    await browser.close();


    async function randSleepClick(selector) {
        await sleep(Math.ceil(Math.random() * 2000 + 1000));
        await cursor.click(selector);
    }


}

module.exports = {follow}