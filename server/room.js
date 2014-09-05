function room() {
	var that = {};
	var inPlayers = [];

	that.join = function(name) {
		inPlayers.push(name);
	};

	that.isStartGame = function() {
		if (inPlayers.length === 2) {
			return true;
		} else {
			return false;
		}
	};

	that.getPlayers = function() {
		inPlayers.sort();
		return inPlayers;
	};

	return that;
}

module.exports = room; 