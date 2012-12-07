var protocol = require('./protocol');

protocol.define('ping', [{x: 'float'}, {y: 'float'}], function (x, y) {
	console.log("received ping; sending pong");
	this.echo('pong', x, y);
});

protocol.define('pong', [{x: 'float'}, {y: 'float'}]);

protocol.define('beep', [{x: 'float'}, {y: 'float'}], function (x, y) {
	console.log("received beep; sending boop");
	this.echo('boop', x, y);
});

protocol.define('boop', [{x: 'float'}, {y: 'float'}]);