const { IgApiClient } = require('instagram-private-api');
const fs = require('fs');
const imgDownloader = require('./imageDownloader');
const {Account, uploadVideo, uploadVideoPaw} = require("./instacounts");
const {follow} = require("./vidUploader");

const ig = new IgApiClient();
ig.state.generateDevice('theBistroEnt');

const cron = require('node-cron');




function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let theBistro = new Account("17841459762355857", "The Bistro");

let PixelatedOasis = new Account("17841461603080719", "Pixelated Oasis");

let pawesomeVideos = new Account("17841461561328750", "Pawesome Videos");



async function loginAndStoreCookies() {
    await await ig.simulate.preLoginFlow()
    await ig.account.login('theBistroEnt', 'Owen20211!!!');
    process.nextTick(async () => await ig.simulate.postLoginFlow());
    await saveSession();
}

async function saveSession() {
    const serialized = await ig.state.serialize();
    delete serialized.constants; // remove this part as it's sensitive
    fs.writeFileSync('./session.json', JSON.stringify(serialized));
}

async function loadSession() {
    if (fs.existsSync('./session.json')) {
        const savedState = require('./session.json');
        await ig.state.deserialize(savedState);
        return true;
    }
    return false;
}

async function getFollowersPKByUsername(username) {
    try {
        const user = await ig.user.searchExact(username);
        const followersFeed = ig.feed.accountFollowers(user.pk);
        const followers = await followersFeed.items();
        return followers.map(follower => follower.pk);
    } catch (error) {
        if (error.response && error.response.statusCode === 403) {
            console.log('Session expired. Re-logging in...');
            await loginAndStoreCookies();
            return getFollowersPKByUsername(username);
        } else if(error.response && error.response.statusCode === 404){
            console.log('Session expired. Re-logging in...');
            await loginAndStoreCookies();
            return getFollowersPKByUsername(username);
        }else {
            throw error;
        }
    }
}

async function followByPK(userId) {
    const result = await ig.friendship.create(userId);
    return result.following;  // This should be true if the follow was successful
}

const censorWord = (str) => {
    const regex = /\bnigga\b/gi;
    return str.replace(regex, 'brotha');
}

async function uploadPicture(user, subreddit, unfilteredCaption) {
    try {
        const imageBuffer = fs.readFileSync('./picture.jpg');
        let newCaption = censorWord(unfilteredCaption);
        let caption = `${newCaption}\n\nPosted by ${user} in ${subreddit}`;
        return await ig.publish.photo({ file: imageBuffer, caption: caption });

    } catch (error) {
        if (error.name === 'IgLoginRequiredError') {
            console.log('Session expired. Re-logging in...');
            await loginAndStoreCookies();
            return uploadPicture(user, subreddit, unfilteredCaption);
        } else {
            console.error(`Error encountered: ${error.message}`);
            console.log("Sleeping for 10 minutes then restarting...");
            await sleep(600000);  // sleep for 10 minutes
            return mainExecution();
        }
    }
}

async function mainExecution() {
    /*
    try {


    
        const hasSession = await loadSession();
        if (!hasSession) {
            await loginAndStoreCookies();
        }

        

        let vidData = await imgDownloader();
        let didIt = await uploadPicture(vidData.username, vidData.reddit, vidData.caption);

        if (didIt) {
            console.log("Picture successfully uploaded!");
        }
    

        while (true) {
            let ms = Math.floor((Math.random() * 10000) + 10000);
            console.log(`Sleeping for ${ms} milliseconds.`);
            await sleep(ms);

            for (const userPerson of usernames) {
                ms = Math.floor((Math.random() * 2) + 60) * 1000;
                console.log(`Following users who follow ${userPerson} after ${ms} milliseconds.`);
                await sleep(ms);
                const followers = await getFollowersPKByUsername(userPerson);

                for (const follower of followers) {
                    let random = Math.floor((Math.random() * 20) + 10);
                    await sleep(random * 1000);
                    let followed = false;
                    try {
                        followed = await followByPK(follower);
                    } catch (err) {
                        if (err.response && err.response.statusCode === 400) {
                            throw new Error('Received a 400 status code from Instagram API.');
                        } 
                        
                        else if (err.response && err.response.statusCode === 403){
                           await loginAndStoreCookies();

                        }
                    }
                    if (followed) {
                        console.log(`${follower} was followed!`);
                    }
                    else {
                        console.log(`Tried to follow ${follower}`)
                    }
                }
            }
        }

    
    } catch (error) {
        console.error(`Unexpected error encountered: ${error.message}`);
        console.log("Sleeping for 10 minutes then restarting...");
        await sleep(600000);  // sleep for 10 minutes
        mainExecution();  // restart main execution
    }
*/ 

    await uploadVideo(PixelatedOasis);
    await uploadVideo(theBistro);

}

function chooseRandomUsername() {
    const usernames = [
        "fightgirlsofus", "crazy.videos", "craziest.media"]
    const randomIndex = Math.floor(Math.random() * usernames.length);
    return usernames[randomIndex];
}

function chooseRandomUsernamePaw() {
    const usernames = [
        "doggosreels", "funny.dog.videos", "_funny_._cats_"]
    const randomIndex = Math.floor(Math.random() * usernames.length);
    return usernames[randomIndex];
}


let otherexec = async () => {
    
   let username = chooseRandomUsername();
   await follow(username, 10, "cookies.json");

   await sleep(120000);
    username = chooseRandomUsername();
    await follow(username, 10, "cookies2.json");

    await sleep(120000);

    await uploadVideoPaw(pawesomeVideos);

    await sleep(60000)
    
    username = chooseRandomUsernamePaw();
    await follow(username, 15, "cookies3.json");

}
        

cron.schedule('19 6-20 * * *', () => {
    otherexec();
});

cron.schedule('0 9,12,15,18 * * *', () => {
    mainExecution();
});


const http = require('http');
http.createServer(() => {}).listen(3010);


