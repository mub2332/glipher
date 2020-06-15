const { handler: createGif } = require("./lambdaFunctions/createGif/index");
const {
    handler: retrieveGif,
} = require("./lambdaFunctions/node_modules/presentGif/index");
const fs = require("fs");

createGif({
    startDuration: 0,
    endDuration: 20,
    url: "https://www.youtube.com/watch?v=ZmrrIIhtY7w",
    videoTitle: "Chika Dance",
}).then(response => {
    console.log(response.body);
});

// retrieveGif({
//     filename: "Chika_Dance0-30.gif",
// }).then(response => {
//     console.log(response.body, "Response Result");
// });
