var assert = require('assert');

var gameServer = require('../gameServer.js');

suite('gameServerTest', function() {
	setup(function() {
		//do nothing.
	});

	test('"GameServer" Object must not be null', function() {
		assert.equal(true, gameServer !== undefined);
		assert.equal(true, gameServer !== null);
	});

	test('"GameServer" is fuction', function() {
		assert.equal( typeof (gameServer), 'function');
	});

});
