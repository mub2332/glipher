const {handler} = require('./lambdaFunctions/createGif/index')
const fs = require('fs')

const downloadUrl = handler({
	startDuration:0,
	endDuration: 30,
	url: "https://www.youtube.com/watch?v=ZmrrIIhtY7w"
}).then(res => console.log(res))
