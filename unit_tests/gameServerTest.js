var chai = require('../node_modules/chai/');

assert = chai.assert;
should = chai.should;

suite('Array', function() {
	setup(function() {
		//do nothing.
	});

	suite('#indexOf()', function() {
		test('should return -1 when not present', function() {
			assert.equal(-1, [1, 2, 3].indexOf(4));
		});
	});
});
