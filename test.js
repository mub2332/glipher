const { handler: createGif } = require("./lambdaFunctions/createGif/index");

createGif({
    startDuration: 3,
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
