var net = require('net'),
	protocol = require('./protocol'),
	defs = require('./definitions');

var server = net.createServer();

var connections = [];
server.on('connection', function (socket) {
	socket.echo = function () {
		for (var con in connections) {
			console.log("con == socket ?" + (con === socket));
			if (con != socket) {
				con.write(protocol.run.apply(null, arguments));
			}
		}
	}

	socket.on('data', function (buf) {
		protocol.process(buf, socket);
	});

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