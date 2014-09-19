function room() {
	var room = {};
	var inPlayers = [];
	var maxPlayerNum;

	room.join = function(name) {
		inPlayers.push(name);
	};

	room.setMaxPlayerNum = function(num) {
		maxPlayerNum = num;
	};

	room.getMaxPlayerNum = function() {
		return maxPlayerNum;
	};

	room.isStartGame = function() {
		if (inPlayers.length === maxPlayerNum) {
			return true;
		} else {
			//TODO behavior of overflow. should throw exception?
			return false;
		}
	};

	room.getPlayers = function() {
		inPlayers.sort();
		return inPlayers;
	};

	return room;
}

module.exports = room;
