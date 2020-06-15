const ytdl = require('ytdl-core')
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg')
const {getImage} = require('../s3/S3Interface')

exports.handler = async (event, context) => {
    try {
        const { userName, title } = event;
        
        console.log("Getting Video")
        getImage(userName, title);

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