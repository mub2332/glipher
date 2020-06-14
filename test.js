const { handler } = require('./lambdaFunctions/createGif/index');
const fs = require('fs');

handler({
  startDuration: 0,
  endDuration: 30,
  url: 'https://www.youtube.com/watch?v=ZmrrIIhtY7w',
}).then((response) => {
  console.log(response.body);
});
