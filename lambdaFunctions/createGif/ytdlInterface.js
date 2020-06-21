const ytdl = require("ytdl-core");
const fs = require("fs");
const path = require("path");

const downloadVideo = async url => {
    console.log("Downloading Video");

    const acceptableItags = [243, 167, 134, 242, 133];

    await new Promise((resolve, reject) => {
        ytdl(url, { quality: acceptableItags })
            .pipe(fs.createWriteStream(path.join(`/tmp/`, "buffer.avi")))
            .on("finish", resolve);
    });

    return;
};

module.exports = { downloadVideo };
