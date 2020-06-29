const { invokeLambda } = require("./LambdaInterface");

exports.handler = async event => {
    console.log("Receiving Payload", event.body);

    var { payload } = JSON.parse(event.body);

    payload = JSON.parse(payload);

    const newPayload = {
        ...payload,
        connectionId: event.requestContext.connectionId,
    };

    console.log("New Payload", newPayload);

    await invokeLambda("createGif", newPayload);

    const response = {
        statusCode: 200,
        body: { response: "Request Successfully Submitted" },
    };
    return response;
};
