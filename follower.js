const puppeteer = require('puppeteer');
const fs = require('fs');
const { createCursor } = require( "ghost-cursor");




function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}




async function follow(account, numOfFollows) {
    // Reading cookies from the file
    const cookiesString = fs.readFileSync('cookies.json');
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
    await page.goto('https://www.instagram.com/' + account);  // Replace with your desired URL

    // Here, you can perform your further tasks

    await sleep(7000);

    try {
        await randSleepClick(('button._a9--._a9_1'));
    }
    catch(err) {
        console.log("didn't work :(");
    }




    const buttonSelector = 'div._aatp';
    const buttons = await page.$$(buttonSelector);

    for (const button of buttons) {
        try {
            await randSleepClick(button);
            await sleep(5000);
            await randSleepClick("span.x193iq5w.xeuugli.x1fj9vlw.x13faqbe.x1vvkbs.xt0psk2.x1i0vuye.xvs91rp.x1s688f.x5n08af.x10wh9bi.x1wdrske.x8viiok.x18hxmgj");
            await sleep(5000);
            break;
        } catch(err) {
            await page.goto('https://www.instagram.com/' + account);
            await sleep(3000);
        }
    }

    await sleep(4000);

    const followButton = 'div._aacl._aaco._aacw._aad6._aade';

    // Fetch the divs that match the selector
    let fButtons = await page.$$(followButton);
    
    // Filter the divs to get only those whose innerHTML contains "follow"
    fButtons = await Promise.all(
        fButtons.map(async button => {
            const innerHTML = await page.evaluate(el => el.innerHTML, button);
            return innerHTML.trim().toLowerCase() === 'follow' ? button : null;
        })
    );
    
    // Remove null values and then slice
    fButtons = fButtons.filter(Boolean);
    let fbuttonsToClick = Array.from(fButtons).slice(2, 2 + numOfFollows);
    
    let i = 0;
    for (const follow of fbuttonsToClick) {
        await randSleepClick(follow);
        await sleep(Math.ceil(Math.random() * 1000 + 1000));
        i++;
        console.log(i + " buttons clicked!");
    }
    
    while (i < numOfFollows) {
        fButtons = await page.$$(followButton);
        fButtons = await Promise.all(
            fButtons.map(async button => {
                const innerHTML = await page.evaluate(el => el.innerHTML, button);
                return innerHTML.trim().toLowerCase() === 'follow' ? button : null;
            })
        );
    
        fButtons = fButtons.filter(Boolean);
        fbuttonsToClick = Array.from(fButtons).slice(2, 2 + numOfFollows);
        await randSleepClick(fbuttonsToClick[0]);
        i++;
        console.log(i + " buttons clicked!");
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