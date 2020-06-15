const ytdl = require("ytdl-core");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const { uploadImage, getDownloadURL } = require("./S3Interface");

const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
ffmpeg.setFfmpegPath(ffmpegPath);

const handler = async (event, context) => {
    try {
        const { url, startDuration, endDuration, videoTitle } = event;

        if (startDuration >= endDuration) {
            throw { message: "End time is put before start time" };
        }

        const correctedTitle =
            videoTitle.split(" ").join("_") +
            String(startDuration) +
            "-" +
            String(endDuration) +
            ".gif";

        const gifDuration = endDuration - startDuration;

        console.log("Downloading Video");
        const byteStream = ytdl(url, {
            begin: convertToString(startDuration),
        });

        const editedStream = fs.createWriteStream("/tmp/" + correctedTitle);

        console.log("Trimming Video");

        const trimingCommand = new Promise((resolve, reject) => {
            ffmpeg(byteStream)
                .setDuration(gifDuration)
                .format("gif")
                .output(editedStream)
                .on("end", () => {
                    console.log(`Stream converted to buffer`);
                    resolve();
                })
                .on("error", error => {
                    console.error(error.message);
                    reject();
                })
                .run();
        });

        await trimingCommand;
        const buffer = fs.readFileSync("/tmp/" + correctedTitle);
        await uploadImage(buffer, correctedTitle);

        const downloadURL = await getDownloadURL(correctedTitle);

        // Upload the gif into the
        return {
            statusCode: 201,
            body: {
                downloadUrl: downloadURL,
            },
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

    return "00:" + padding(minuteString) + ":" + padding(secondString);
};

const padding = timeString => {
    if (timeString.length === 1) {
        return "0" + timeString;
    } else return timeString;
};

module.exports = { handler };
