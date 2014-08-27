var chai = require('../node_modules/chai/');

assert = chai.assert;

var gameServer = require('../gameServer.js');

suite('gameServerTest', function() {
	setup(function() {
		//do nothing.
	});

	suite('Constructor Test', function() {
		test('"GameServer" Object should not be null', function() {
			assert.equal(true, gameServer !== null);
		});
		
		test('"GameServer" is fuction', function() {
			assert.equal(typeof(gameServer), 'function');
		});
	});
});
