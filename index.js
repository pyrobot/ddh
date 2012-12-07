var net = require('net'),
	protocol = require('./protocol'),
	defs = require('./definitions');

var masterServer = net.createServer(),
	slaveServer = net.createServer();

var masterSocket,
	slaveSocket;

masterServer.on('connection', function (socket) {
	if (masterSocket == null) {
		masterSocket = socket;
	} else {
		socket.end('server is full\n');
	}

	socket.echo = function () {
		if (slaveSocket) {
			try {
				slaveSocket.write(protocol.run.apply(null, arguments));
			} catch (err) {
				slaveSocket = null;
			}
		}
	}

	socket.on('data', function (buf) {
		protocol.process(buf, socket);
	});
});

slaveServer.on('connection', function (socket) {
	if (slaveSocket == null) {
		slaveSocket = socket;
	} else {
		socket.end('server is full\n');
	}

	socket.echo = function () {
		if (masterSocket) {
			try {
				masterSocket.write(protocol.run.apply(null, arguments));
			} catch (err) {
				masterSocket = null;
			}
		}
	}

	socket.on('data', function (buf) {
		protocol.process(buf, socket);
	});
});

masterServer.listen(1337);
console.log("Master started on port 1337");

slaveServer.listen(1338);
console.log("Slave started on port 1338");
