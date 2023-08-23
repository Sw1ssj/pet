const { spawn } = require('child_process');

function splitTextEverySixWords(text) {
    const words = text.split(' ');
    const chunks = [];

    while (words.length) {
        chunks.push(words.splice(0, 8).join(' '));
    }

    return chunks;
}

function generateFilterForText(lines) {
    let currentY = 125;
    let filter = '';

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].replace(/'/g, "\\'");  // Escape single quotes
        filter += `[${i === 0 ? "1:v" : "bg_with_text" + i}]drawtext=fontfile='/Windows/Fonts/seguiemj.ttf':text='${line}':fontsize=50:fontcolor=black:x=(w-text_w)/2:y=${currentY}[bg_with_text${i + 1}];`;
        currentY += 64;
    }

    filter += `[0:v]scale=w='if(gt(a,1080/1300),1080,-1)':h='if(gt(a,1080/1300),-1,1300)',force_original_aspect_ratio=decrease[scaled_video];[bg_with_text${lines.length}][scaled_video]overlay=(W-w)/2:(H-h)/2[outv]`;

    return filter;

}


function addTextToVideo(inputVideo, outputVideo, text, callback) {
    const textLines = splitTextEverySixWords(text);
    const filters = generateFilterForText(textLines);
    console.log("Filter:", filters);

    const args = [
        '-y', '-i', inputVideo,
        '-f', 'lavfi', '-i', 'color=c=white:s=1080x1920:d=10',   // Create a blue background
        '-filter_complex', filters,
        '-map', '[outv]', '-an',
        outputVideo
    ];

    const ffmpeg = spawn('ffmpeg', args);
    ffmpeg.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    ffmpeg.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    ffmpeg.on('close', (code) => {
        if (code !== 0) {
            return callback(new Error(`ffmpeg process exited with code ${code}`));
        }
        console.log('Video processed successfully.');
        callback(null);
    });
}

// ... [rest of your code]

// Usage:

module.exports = {
    addTextToVideo
}