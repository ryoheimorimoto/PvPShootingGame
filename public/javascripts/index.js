enchant();
window.onload = function() {
	var socket;
	var roomId;
	var userName;
	var Game;
	socket = io.connect(location.origin);
	roomId = $("meta[name=roomId]").attr('content');
	userName = $("meta[name=userName]").attr('content');

	console.log('userName : ' + userName);

	socket.emit('EnterRoom', {
		roomId : roomId,
		name : userName
	});

	socket.on('GameStart', function(data) {
		var enemyName = getEnemyName(userName, data.players);
		Game = game({
			playerName : userName,
			enemyName : enemyName
		});
		Game.start();

		Game.doAction(function(data) {
			console.log('Game.doAction!, ' + data.x + ':' + data.y);
			socket.emit('doAction', data);
		});

		socket.on('onAction', function(data) {
			console.log('onAction!!, data = ' + data.x + ':' + data.y);
			Game.onAction(data);
		});

	});

	function getEnemyName(playerName, players) {
		var enemyName;
		for (var i in players) {
			if (players[i] !== userName) {
				enemyName = players[i];
				break;
			}
		}
		return enemyName;
	}

};
