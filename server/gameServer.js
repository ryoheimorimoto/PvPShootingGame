var room = require('./room.js');

function gameServer(spec, my) {
	var app = spec.httpServer;
	var logLevel = spec.logLevel || 1;
	var io = require('socket.io').listen(app, {
		'log level' : logLevel
	});

	var roomArray = {};
	for (var i = 0; i < 10; i++) {
		(roomArray[i] = room()).setMaxPlayerNum(2);
	}

	io.sockets.on('connection', function(socket) {
		socket.on('EnterRoom', function(data) {
			var roomId = data.roomId;
			var name = data.name;
			var loginInfo = {
				roomId : roomId,
				name : name
			};
			socket.set('loginInfo', loginInfo, function() {
				roomArray[roomId].join(name);
				socket.join(roomId);
				if (roomArray[roomId].isStartGame()) {
					var ret = {
						players : roomArray[roomId].getPlayers()
					};
					io.sockets.in(roomId).emit('GameStart', ret);
				}
			});
		});

		socket.on('doAction', function(data) {
			var x = data.x;
			var y = data.y;
			var action = data.action;
			console.log('action, x=' + x + ', y=' + y, ', action = ' + action);
			var tempData = data;

			socket.get('loginInfo', function(err, data) {
				var roomId = data.roomId;
				var ret = tempData;
				io.sockets.in(roomId).emit('onAction', ret);
			});
		});

		socket.on('disconnect', function(data) {
			socket.get('loginInfo', function(err, data) {
				var roomId = data.roomId;
				socket.leave(roomId);
				var clients = io.sockets.clients(roomId);
				if (clients.length === 0) {
					roomArray[roomId] = room();
				} else {
					for (var i in clients) {
						clients[i].disconnect();
					}
				}
			});
		});
	});

	return io;
};

module.exports = gameServer;
