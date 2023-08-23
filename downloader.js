const axios = require('axios');
const fetch = require('node-fetch');
const fs = require('fs');
const { exec } = require('child_process');
const getURL = require('./lol');  // Import the getURL function
const https = require('https');
const { Readable } = require('stream');



const DOWNLOADED_VIDEOS_FILE = 'downloaded.json';

let downloaded = [];

if (fs.existsSync(DOWNLOADED_VIDEOS_FILE)) {
    downloaded = JSON.parse(fs.readFileSync(DOWNLOADED_VIDEOS_FILE, 'utf-8'));
}


async function getHottestVideoURL(page) {
    console.log(`Fetching the top 50 hottest posts from ${page}...`);
    const response = await axios.get(`https://www.reddit.com/${page}/hot.json?limit=500`);
    console.log('Processing posts to find a suitable video...');
    
    const posts = response.data.data.children;

    for (const post of posts) {
        if (post.data.is_video && 
            !downloaded.includes(post.data.id) && 
            post.data.secure_media.reddit_video.duration >= 5 && 
            post.data.secure_media.reddit_video.duration <= 45 &&
            !post.data.secure_media.reddit_video.is_gif &&
            !post.data.over_18) {
            const redditURL = `https://www.reddit.com${post.data.permalink}`;
            const posterUsername = post.data.author;  // Get the poster's username
            const caption = post.data.title;  // Get the caption

            console.log(`Found a suitable video with URL: ${redditURL} by user: ${posterUsername}. Caption: ${caption}`);
            
            downloaded.push(post.data.id);
            fs.writeFileSync(DOWNLOADED_VIDEOS_FILE, JSON.stringify(downloaded));
            
            return {
                url: redditURL,
                username: posterUsername,
                caption: caption
            };
        }
    }
    throw new Error('No suitable video found');
}


// ... [your previous imports and variables here]

function removeVideoId(videoId) {
    // Remove the video ID from the 'downloaded' array
    const index = downloaded.indexOf(videoId);
    if (index > -1) {
        downloaded.splice(index, 1);
    }

    // Rewrite the 'downloaded' array to the JSON file
    fs.writeFileSync(DOWNLOADED_VIDEOS_FILE, JSON.stringify(downloaded));
}

async function downloader() {
    try {
        let reddit = chooseRandomSubreddit();

        const videoData = await getHottestVideoURL(reddit);

        console.log(`URL: ${videoData.url}`);
        console.log(`Posted by: ${videoData.username}`);
        console.log(`Caption: ${videoData.caption}`);

        let url = await getURL(videoData.url);
        console.log(url);

        if (typeof url === 'undefined') {
            console.error('Download link is undefined. Removing the video ID and retrying...');
            removeVideoId(videoData.id);
            return downloader();
        }

        const videoFileUrl = url;
        const videoFileName = 'video.mp4';

        if (typeof (fetch) === 'undefined') throw new Error('Fetch API is not supported.');

        const response = await fetch(videoFileUrl);

        if (!response.ok) throw new Error('Response is not ok.');

        const writeStream = fs.createWriteStream(videoFileName);

        response.body.pipe(writeStream);

        await new Promise((resolve, reject) => {
            response.body.on('end', resolve);
            response.body.on('error', reject);
        });

        return {
            username: videoData.username,
            caption: videoData.caption,
            reddit: reddit
        }
    } catch (err) {
        console.error('An error occurred:', err);
        return downloader(); // Try again on error
    }
}

// ... [rest of your code]


function chooseRandomSubreddit() {
    const subreddits = [
        "r/BruceDropEmOff",
        "r/unexpected",
        "r/whatcouldgowrong",
        "r/yourRAGE"
    ];

    const randomIndex = Math.floor(Math.random() * subreddits.length);
    return subreddits[randomIndex];
}

module.exports = downloader;

