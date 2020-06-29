const AWS = require("aws-sdk");

const sendPayload = async (connectionId, payload) => {
    var gateway = new AWS.ApiGatewayManagementApi({
        endpoint: `https://sth4zqzl5e.execute-api.us-east-1.amazonaws.com/dev/`,
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
        region: process.env.REGION,
    });

    const params = {
        ConnectionId: connectionId,
        Data: JSON.stringify(payload),
    };

    console.log("Posting Message");

    await new Promise((resolve, reject) => {
        gateway.postToConnection(params, (err, data) => {
            if (err) console.log(err, err.stack), reject();
            // an error occurred
            else console.log("DAI SEIKOU"), resolve(); // successful response
        });
    });
};

module.exports = { sendPayload };
