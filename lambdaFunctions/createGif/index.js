const ytdl = require("ytdl-core");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const { uploadImage } = require("../s3/S3Interface");
const Promise = require('bluebird')

const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
ffmpeg.setFfmpegPath(ffmpegPath);

exports.handler = async (event, context) => {
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
    const byteStream = await ytdl(url, {
      begin: convertToString(startDuration),
    });

    const editedStream = fs.createWriteStream(correctedTitle);

    console.log("Trimming Video");

    const trimingCommand = new Promise((resolve, reject) => {
      ffmpeg(byteStream)
        .setDuration(gifDuration)
        .format("gif")
        .output(editedStream)
        .on("end", () => {
            const buffer = fs.readFileSync(correctedTitle);
            console.log(`File turned into buffer`);
            uploadImage(buffer, correctedTitle);
          })
        .on("error", (error) => {
            console.error(error.message);
          }).run()
        })

    await trimingCommand.then(() => {console.log("URL")})
    

    // Upload the gif into the
    return {
      statusCode: 201,
      body: { downloadUrl: "ABD" },
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: err.message,
    };
  }
};

const convertToString = (duration) => {
  const minuteString = String(Math.floor(duration / 60));
  const secondString = String(duration % 60);

  return "00:" + padding(minuteString) + ":" + padding(secondString);
};

const padding = (timeString) => {
  if (timeString.length === 1) {
    return "0" + timeString;
  } else return timeString;
};