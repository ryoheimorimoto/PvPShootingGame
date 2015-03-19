enchant();
window.onload = function() {
	var SERVER_IP = '127.0.0.1';
	var SERVER_PORT = '20903';
	var game = new Game(480, 480);
	game.fps = 60;

	game.onload = function() {

		var socket = io.connect(SERVER_IP + ':' + SERVER_PORT);
		socket.on('connect', function(msg) {
			console.log("connet");
			document.getElementById("connectId").innerHTML = "あなたの接続ID::" + socket.socket.transport.sessid;
			document.getElementById("type").innerHTML = "接続方式::" + socket.socket.transport.name;
		});

		// メッセージを受けたとき
		socket.on('message', function(msg) {
			// メッセージを画面に表示する
			document.getElementById("receiveMsg").innerHTML = msg.value;
		});

		// メッセージを送る
		function SendMsg() {
			var msg = document.getElementById("message").value;
			// メッセージを発射する
			socket.emit('message', {
				value : msg
			});
		}

		// 切断する
		function DisConnect() {
			var msg = socket.socket.transport.sessid + "は切断しました。";
			// メッセージを発射する
			socket.emit('message', {
				value : msg
			});
			// socketを切断する
			socket.disconnect();
		}

	};
	game.start();

};
