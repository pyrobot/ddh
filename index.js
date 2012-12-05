var net = require('net'),
	protocol = require('./protocol'),
	defs = require('./definitions');

var server = net.createServer();

var connections = [];
server.on('connection', function (socket) {
	socket.on('data', protocol.process);
	connections.push(socket);
});

server.on('listening', function () {
	var address = server.address();
	console.log('listening on: (%s:%s)' 
	          , address.address === '0.0.0.0' 
	            ? 'localhost' 
	            : address.address
	          , address.port
	);
});

server.listen(1337);