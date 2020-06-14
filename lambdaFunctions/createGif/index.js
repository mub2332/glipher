const ytdl = require('ytdl-core')
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg')
const {uploadImage} = require('../s3/S3Interface')

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);


exports.handler = async (event, context) => {
    try {
        const { url, startDuration, endDuration } = event;

        if (startDuration >= endDuration) {
            throw {message: "End time is put before start time"}
        }

        const gifDuration = endDuration - startDuration

        console.log("Downloading Video");
        const byteStream = await ytdl(url, {begin:convertToString(startDuration)});

        const editedStream = fs.createWriteStream('result.gif');
        
        console.log("Trimming Video")
        ffmpeg(byteStream)
            .setDuration(gifDuration).format('gif')
            .output(editedStream)
            .on('end', () => {
                const buffer = fs.readFileSync('result.gif');
                console.log(`File turned into buffer`);
                uploadImage(buffer, 'result.gif');
            }).run();

        // Upload the gif into the 
        return {
            statusCode: 200,
            body: { downloadUrl :"ABD" },
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: err.message,
        };
    }
};

const convertToString = duration => {
    const minuteString = String(Math.floor(duration / 60));
    const secondString = String(duration % 60);

    return '00:' + padding(minuteString) + ":" + padding(secondString);
};

const padding = timeString => {
    if (timeString.length === 1) {
        return "0" + timeString;
    } else return timeString;
};