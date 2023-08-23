const axios = require('axios');
const fs = require('fs');

const MAX_RETRIES = 3; // You can adjust this number as needed
const DOWNLOADED_IMAGES_FILE = 'downloaded.json'; // Replace with your path

let downloaded = [];
// Try to read previously downloaded images from file
try {
    downloaded = JSON.parse(fs.readFileSync(DOWNLOADED_IMAGES_FILE, 'utf-8'));
} catch (error) {
    console.warn("Couldn't read downloaded images, starting with an empty list.");
}

async function getHottestImageURL(page) {
    let retries = 0;

    while (retries < MAX_RETRIES) {
        try {
            console.log(`Fetching the top 50 hottest posts from ${page}...`);
            const response = await axios.get(`https://www.reddit.com/${page}/hot.json?limit=50`);
            console.log('Processing posts to find a suitable image...');

            const posts = response.data.data.children;

            for (const post of posts) {
                if (post.data.post_hint === 'image' && 
                    !downloaded.includes(post.data.id) && 
                    !post.data.over_18) {
                    const redditURL = `https://www.reddit.com${post.data.permalink}`;
                    const imageURL = post.data.url;  // Image URL
                    const posterUsername = post.data.author;  // Get the poster's username
                    const caption = post.data.title;  // Get the caption

                    console.log(`Found a suitable image with URL: ${imageURL} by user: ${posterUsername}. Caption: ${caption}`);

                    downloaded.push(post.data.id);
                    fs.writeFileSync(DOWNLOADED_IMAGES_FILE, JSON.stringify(downloaded));

                    return {
                        url: imageURL,
                        redditURL: redditURL,
                        username: posterUsername,
                        caption: caption
                    };
                }
            }
            throw new Error('No suitable image found');

        } catch (error) {
            console.error(`Attempt ${retries + 1} failed: ${error.message}`);
            retries++;
        }
    }
    throw new Error('Max retries reached. Exiting.');
}


async function downloadImage(imageURL, filename) {
    const response = await axios.get(imageURL, {
        responseType: 'arraybuffer'
    });

    fs.writeFileSync(filename, response.data);
    console.log(`Image downloaded and saved as ${filename}`);
}


async function imgDownloader() {
    try {
        let reddit = chooseRandomSubreddit();
        let img = await getHottestImageURL(reddit); 
        await downloadImage(img.url, 'picture.jpg');
        return {username: img.username, caption: img.caption, reddit: reddit}
    } catch (error) {
        await imgDownloader();
    }
}



function chooseRandomSubreddit() {
    const subreddits = [
        "r/BruceDropEmOff",
        "r/Whatcouldgowrong",
        "r/publicfreakout",
        "r/WhyWereTheyFilming"
    ];

    const randomIndex = Math.floor(Math.random() * subreddits.length);
    return subreddits[randomIndex];
}

module.exports = imgDownloader;

