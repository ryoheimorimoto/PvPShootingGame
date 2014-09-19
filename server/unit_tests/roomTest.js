var assert = require('assert');

var roomFunc = require('../room.js');
var room;

suite('roomTest', function() {
	setup(function() {
		room = roomFunc();
	});

	test('"room" Object must not be null', function() {
		assert.equal(true, room !== undefined);
		assert.equal(true, room !== null);
	});

	test('one player can join in "room"', function() {
		room.join('player1');
		assert.equal(room.getPlayers()[0], 'player1');
	});

	test('two players can join in "room"', function() {
		room.join('player1');
		room.join('player2');
		assert.equal(room.getPlayers()[0], 'player1');
		assert.equal(room.getPlayers()[1], 'player2');
	});

	test('20 players can join in "room"', function() {
		for (var i = 0; i < 20; i++) {
			room.join('player' + i);
		}
		var numOfPlayers = room.getPlayers().length;
		assert.equal(numOfPlayers, 20);
	});

	test('"getPlayers" can sort the player list', function() {
		room.join('player2');
		room.join('player1');
		assert.equal(room.getPlayers()[0], 'player1');
		assert.equal(room.getPlayers()[1], 'player2');
	});

	test('"setMaxPlayerNum()" can set the Max Player Number in a room', function() {
		room.setMaxPlayerNum(2);
		assert.equal(room.getMaxPlayerNum(), 2);
	});
	
	test('isStartGame()" returns true when Player number match the Max Player Number', function() {
		room.setMaxPlayerNum(2);
		room.join('player1');
		room.join('player2');
		assert.equal(room.isStartGame(), true);
	});
	
	test('isStartGame()" returns false when Player number does not match the Max Player Number', function() {
		room.setMaxPlayerNum(2);
		room.join('player1');
		assert.equal(room.isStartGame(), false);
	});

});
