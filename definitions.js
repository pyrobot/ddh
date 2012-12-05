var protocol = require('./protocol');

// testing
protocol.define('test', [{x: 'uint'}, {y: 'uint'}], function (x, y) {
	console.log("Received: %d, %d", x, y);
});
