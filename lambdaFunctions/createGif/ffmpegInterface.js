const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
ffmpeg.setFfmpegPath(ffmpegPath);
const path = require("path");
const fs = require("fs");

const trimVideo = async (correctedTitle, startDuration, gifDuration) => {
    console.log(path.join(`/tmp/`, correctedTitle));

    console.log("Trimming Video");

    const editedStream = fs.createWriteStream(
        path.join(`/tmp/`, correctedTitle)
    );

    const trimingCommand = ffmpeg(path.join(`/tmp/`, "buffer.avi"))
        .setDuration(gifDuration)
        .format("gif")
        .output(editedStream);

    if (startDuration > 0) {
        console.log("Gif with start time at ", convertToString(startDuration));
        trimingCommand.seekInput(convertToString(startDuration));
    }

    await new Promise((resolve, reject) => {
        trimingCommand
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

    return;
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

module.exports = { trimVideo };
