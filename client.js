var p = require('./protocol'),
	defs = require('./definitions');

var net = require('net'),
	socket = new net.Socket();

socket.pipe(process.stdout);

socket.connect(1337, 'localhost', function () {
	socket.write(p.run('test', 128, 255));
});
