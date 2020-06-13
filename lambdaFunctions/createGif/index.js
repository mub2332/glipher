const ytdl = require('ytdl-core')
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg')

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);


exports.handler = async (event, context) => {
    try {
        const { url, startDuration, endDuration } = event;

        if (startDuration >= endDuration) {
            throw {message: "End time is put before start time"}
        }

        const gifDuration = endDuration - startDuration

        // Video Download
        const byteStream = await ytdl(url, {begin:convertToString(startDuration)});

        const buffer = fs.createWriteStream('result.gif')
        
        ffmpeg(byteStream)
            .setDuration(gifDuration).format('gif')
            .output(buffer)
            .run();

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