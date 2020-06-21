const fs = require("fs");
const { uploadImage, getDownloadURL } = require("./S3Interface");
const { downloadVideo } = require("./ytdlInterface");
const { trimVideo } = require("./ffmpegInterface");
const path = require("path");

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

        await downloadVideo(url);

        await trimVideo(correctedTitle, startDuration, gifDuration);

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

module.exports = { handler };
