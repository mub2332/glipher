const AWS = require("aws-sdk");

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const s3Client = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.REGION,
});

const uploadImage = async (buffer, filename) => {
    try {
        console.log("Uploading Image Start");
        const destparams = {
            Bucket: process.env.BUCKET,
            Key: "public/" + filename,
            Body: buffer,
            ContentType: "video",
        };

        await s3Client.putObject(destparams).promise();

        console.log(`Successfully uploaded ${filename} to ${destparams.Key}`);
        return;
    } catch (error) {
        console.error(error);
        return;
    }
};

const getImage = async filename => {
    try {
        console.log("Getting Image from S3");
        const sourceParam = {
            Bucket: process.env.BUCKET,
            Key: "public/" + filename,
        };

        const downloadedFile = await s3Client.getObject(sourceParam).promise();

        console.log(
            `Successfully downloaded ${filename} from ${sourceParam.Key}`
        );

        return downloadedFile.Body;
    } catch (error) {
        console.error(error);
        return;
    }
};

module.exports = { uploadImage, getImage };
