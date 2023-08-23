const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const https = require('https');
const UserAgent  =  require('user-agents');


const instance = axios.create({
    withCredentials: true
});



async function getURL(url, retryCount = 0) {
    const maxRetries = 5; // You can change this to any number you prefer

    try {
        const userAgent = new UserAgent();
        axios.defaults.headers.common['User-Agent'] = userAgent.toString();

        // Fetch the webpage content
        const { data: html } = await axios.get('https://savemp4.red/backend.php?url=' + url);
        
        const $ = cheerio.load(html);
        
        // Define videoUrl variable here
        let videoUrl;

        // Iterate through each video tag
        $('video').each((i, video) => {
            if (videoUrl) { // If we have found the video URL already, just return
                return;
            }

            $(video).find('source').each((j, source) => {
                const currentUrl = $(source).attr('src');
                if (!videoUrl && currentUrl.includes("https://files.savemp4.red/")) { // If the videoUrl is not set yet and the source URL contains the required string
                    videoUrl = currentUrl;
                }
            });
        });

        
        console.log("Found video URL:", videoUrl);
        return videoUrl;

    } catch (error) {
        console.error(`Error occurred while fetching the URL. Retry attempt: ${retryCount + 1}.`, error);
        
        if (retryCount < maxRetries) {
            return await getURL(url, retryCount + 1);
        } else {
            console.error("Max retries reached. Aborting.");
            return null; // or throw an error or handle as you see fit
        }
    }
}





module.exports = getURL;
