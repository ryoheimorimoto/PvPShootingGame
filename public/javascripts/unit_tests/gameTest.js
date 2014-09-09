var chai = require('../../../node_modules/chai/');

assert = chai.assert;

var game = require('../game.js');

suite('gameTest', function() {
	setup(function() {
		//do nothing.
	});

	suite('Constructor Test', function() {
		test('"game" Object must not be null', function() {
			assert.equal(true, game !== undefined);
			assert.equal(true, game !== null);
		});
		
		test('"Game" is fuction', function() {
			assert.equal(typeof(game()), 'function');
		});
		
	});
});
