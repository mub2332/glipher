const {handler} = require('./lambdaFunctions/createGif/index')
const fs = require('fs')

const downloadUrl = handler({
	startDuration:0,
	endDuration: 5,
	url: "https://www.youtube.com/watch?v=1VD70_8IN1w"
})