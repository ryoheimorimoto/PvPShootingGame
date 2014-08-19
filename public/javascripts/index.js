enchant();
window.onload = function(){
    var socket;
    var roomId;
    var userName;
    var Game;
    socket = io.connect(location.origin);
    roomId = $("meta[name=roomId]").attr('content');
    userName = $("meta[name=userName]").attr('content');
    
    console.log('userName : '+userName);
    
    socket.emit('EnterRoom',{
        roomId : roomId,
        name : userName
    });
    
    socket.on('GameStart', function(data){
        var enemyName = getEnemyName(userName,data.players);
        Game = game({
            playerName : userName,
            enemyName : enemyName
        });
        Game.start();
        
        Game.onThrowHand(function(hand) {
            if(1 === hand){
                console.log('seikou');
            }
            socket.emit('Janken', hand);
        });
        
        Game.doMove(function(data) {
            console.log('Game.doMove!, ' + data.x + ':' + data.y);
			socket.emit('doMove', data);
        });
        
        socket.on('onMove', function(data) {
        	console.log('onMove!!, data = ' + data.x + ':' + data.y);
        	Game.onMove(data);
        });
        
        socket.on('Result', function(data) {
            console.log(data);
            Game.emitJankenResult(data);
        });
    });

    function getEnemyName(playerName, players) {
        var enemyName;
        for(var i in players){
            if(players[i]!==userName){
                enemyName = players[i];
                break;
            }
        }
        return enemyName;
    }
};