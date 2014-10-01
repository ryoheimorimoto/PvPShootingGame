/*
 * GET home page.
 */

exports.index = function(req, res) {
	res.render('index', {
		title : 'node.jsでゲームを作ってみる'
	});
};

exports.game = function(req, res) {
	var userName = req.body.userName;
	var roomId = req.body.roomId;
	res.render('game', {
		title : 'node.jsでゲームを作ってみる',
		userName : userName,
		roomId : roomId
	});
};

exports.finish = function(req, res) {
	res.render('finish', {
		title : 'node.jsでゲームを作ってみる。番外編',
	});
};
