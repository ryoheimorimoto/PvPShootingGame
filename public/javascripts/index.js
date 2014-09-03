enchant();
window.onload = function() {
	var socket;
	var roomId;
	var userName;
	var Game;
	socket = io.connect(location.origin);
	roomId = $('meta[name=roomId]').attr('content');
	userName = $('meta[name=userName]').attr('content');

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
			socket.emit('doAction', data);
		});

		socket.on('onAction', function(data) {
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
