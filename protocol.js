// define the types that will be allowed to be passed
// and how many bytes they each take to transfer
var types = {
	//'string': NaN,
	'short': 1,
	'ushort': 1,
	'int': 2,
	'uint': 2,
	'long': 4,
	'ulong': 4,
	'float': 4,
	'double': 8
}

var splice = [].splice,
	shift  = [].shift;

var functions = {};

var id = 0;

function defineServerFunction (name, params, callback) {
	var obj = {};

	functions.length = id + 1;

	obj.id = id++;
	obj.name = name;
	obj.params = params;
	obj.callback = callback;

	// associate by name
	functions[obj.name] = obj;

	// associate by id
	functions[obj.id] = obj;
}

function callServerFunction () {
	var name, args, serverFunc,	params,	callback;

	name = splice.call(arguments, 0, 1)
	args = arguments;

	serverFunc = functions[name];

	if (serverFunc) {
		return runServerFunction(name, args, serverFunc);
	}
}

function runServerFunction (name, args, serverFunc) {
	var params, sendBuf, i, l, bufSize = 0;

	params = serverFunc.params;

	params.forEach(function (param) {
		for (var paramName in param) {
			var paramType = param[paramName];
			bufSize += types[paramType];
		}
	});

	sendBuf = new Buffer(2 + bufSize);

	// start command
	sendBuf.writeInt8(10, 0);

	// command id
	sendBuf.writeUInt8(serverFunc.id, 1);

	var offset = 2;
	for (i = 0, l = args.length; i < l; i++) {
		var param = params[i], type;
		for (var k in param) {
			type = param[k];
			break;
		}

		switch(type) {
			case 'short':
				sendBuf.writeInt8(args[i], offset);
				offset++;
				break;
			case 'ushort':
				sendBuf.writeUInt8(args[i], offset);
				offset++;
				break;
			case 'int':
				sendBuf.writeInt16LE(args[i], offset);
				offset+=2;
				break;
			case 'uint':
				sendBuf.writeUInt16LE(args[i], offset);
				offset+=2;
				break;
			case 'long':
				sendBuf.writeInt32LE(args[i], offset);
				offset+=4;
				break;
			case 'ulong':
				sendBuf.writeUInt32LE(args[i], offset);
				offset+=4;
				break;
			case 'float':
				sendBuf.writeFloatLE(args[i], offset);
				offset+=4;
				break;
			case 'double':
				sendBuf.writeDoubleLE(args[i], offset);
				offset+=8;
				break;
		}
	}

	return sendBuf;
}

function process (buf, socket) {
	var ch = [].shift.call(buf); 
	
	if (ch === 0x0A) {
		beginCommand(buf, socket);
	} 
	// else if (ch === 0x1A) {
	// 	beginCommandSeries(buf, socket);
	// }
}

function beginCommand (buf, socket) {
	var func = functions[buf[0]];
	var args = [];
	var offset = 1;
	func.params.forEach(function (param) {
		for (var k in param) {
			var type = param[k], val;
			switch (type) {
				case 'short':
					val = buf.readInt8(offset);
					offset++;
					break;
				case 'ushort':
					val = buf.readUInt8(offset);
					offset++;
					break;
				case 'int':
					val = buf.readInt8(offset);
					offset+=2;
					break;
				case 'uint':
					val = buf.readUInt8(offset);
					offset+=2;
					break;
				case 'long':
					val = buf.readInt32(offset);
					offset+=4;
					break;
				case 'ulong':
					val = buf.readUInt32(offset);
					offset+=4;
					break;
				case 'float':
					val = buf.readFloatLE(offset);
					offset+=4;
					break;
				case 'double':
					val = buf.readDoubleLE(offset);
					offset+=8;
					break;
			}
			args.push(val);
		}
	})
	func.callback.apply(socket, args);
}

module.exports = exports = {
	process: process,
	define: defineServerFunction,
	run: callServerFunction
};