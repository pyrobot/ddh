var protocol = require('./protocol');

// testing
protocol.define('test', [{x: 'float'}, {y: 'float'}], function (x, y) {
	console.log("(test) parameters: %d, %d", x, y);
	//this.echo('durp', 1, 2);
});
