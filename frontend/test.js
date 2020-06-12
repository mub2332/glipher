const ytdl = require("ytdl-core");
const fs = require("fs");

const video = ytdl("https://www.youtube.com/watch?v=1VD70_8IN1w").pipe(
    fs.createWriteStream("video.flv")
);
