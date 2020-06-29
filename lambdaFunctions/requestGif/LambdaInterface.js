const AWS = require("aws-sdk");

const invokeLambda = async (funcName, payload) => {
    const lambdaInterface = new AWS.Lambda({
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
        region: process.env.REGION,
    });

    console.log("Adjusting Payload");

    const params = {
        FunctionName: "createGif",
        Payload: JSON.stringify(payload),
        InvocationType: "Event",
    };

    console.log("Params", params);

    await new Promise((resolve, reject) => {
        lambdaInterface.invoke(params, (err, results) => {
            if (err) console.log("Invocation ERROR", err), reject();
            else console.log("SUCCESS INVOKE", results), resolve();
        });
    });
    return;
};

module.exports = { invokeLambda };
