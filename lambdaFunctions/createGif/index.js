const ytdl = require("ytdl-core");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const { uploadImage, getDownloadURL } = require("./S3Interface");
const path = require("path");

const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
ffmpeg.setFfmpegPath(ffmpegPath);

const handler = async (event, context) => {
    try {
        console.log("Request Params", event);

        const { url, startDuration, endDuration, videoTitle } = event;

        if (startDuration >= endDuration) {
            throw { message: "End time is put before start time" };
        }

        const correctedTitle = videoTitle
            .replace("/", "_")
            .split(" ")
            .join("_")
            .concat(String(startDuration), "-", String(endDuration), ".gif");

        const gifDuration = endDuration - startDuration;

        console.log("Downloading Video");
        const byteStream = ytdl(url);

        console.log(path.join(`/tmp/`, correctedTitle));

        const editedStream = fs.createWriteStream(
            path.join(`/tmp/`, correctedTitle)
        );

        console.log("Trimming Video");

        const trimingCommand = new Promise((resolve, reject) => {
            ffmpeg(byteStream)
                .setStartTime(convertToString(startDuration))
                .setDuration(gifDuration)
                .format("gif")
                .output(editedStream)
                .on("end", () => {
                    console.log(`Stream converted to buffer`);
                    resolve();
                })
                .on("error", error => {
                    console.error(error);
                    reject();
                })
                .run();
        });

        await trimingCommand;
        const buffer = fs.readFileSync(path.join(`/tmp/`, correctedTitle));
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
            body: err,
        };
    }
};

const convertToString = duration => {
    const minuteString = String(Math.floor(duration / 60));
    const secondString = String(duration % 60);

    return "00:".concat(padding(minuteString), ":", padding(secondString));
};

const padding = timeString => {
    if (timeString.length === 1) {
        return "0".concat(timeString);
    } else return timeString;
};

module.exports = { handler };
