function game(spec, my) {
	var PICT_PREFIX = location.origin + '/images/';

	var MACHINE_MOVE_PIX = 10;

	var playerName = spec.playerName;
	var enemyName = spec.enemyName;

	var userId = Math.random();

	var myMachineSprt;
	var enemyMachineSprt;

	var myBulletSprite = [];
	var enemyBulletSprite = [];

	var leftButtonSprt;
	var rightButtonSprt;
	var shootButtonSprt;

	var emitFrameEvent = function() {
	};
	var emitFrame = -1;

	var core = new Core(320, 480);
	core.fps = 30;
	core.rootScene.backgroundColor = "black";

	var count = 0;

	MyBullet = Class.create(Sprite, {
		initialize : function(data) {
			Sprite.call(this, 16, 16);
			this.image = core.assets[PICT_PREFIX + 'bullet.png'];
			this.x = data.x + 24;
			this.y = 348;
			core.rootScene.addChild(this);
		},
		onenterframe : function() {
			this.y -= 5;
			if (this.y < 0) {
				delete this;
			}
		},
	});

	EnemyBullet = Class.create(Sprite, {
		initialize : function(data) {
			Sprite.call(this, 16, 16);
			this.image = core.assets[PICT_PREFIX + 'bullet.png'];
			this.x = data.x + 24;
			this.y = 74;
			core.rootScene.addChild(this);
		},
		onenterframe : function() {
			this.y += 5;
			if (this.y > 480) {
				delete this;
			}
		},
	});

	preLoad();

	core.onload = function() {
		initSprite();
		console.log('Path 001 : ' + 'pre setInterval');
		//setInterval(onUpdate, 33);

		console.log('Path 002 : ' + 'after setInterval');
		core.rootScene.addEventListener('enterframe', function(e) {
			if (core.frame === emitFrame) {
				emitFrameEvent();
			}
		});
	};

	function preLoad() {
		core.preload(PICT_PREFIX + 'battleplane.png');
		core.preload(PICT_PREFIX + 'left.png');
		core.preload(PICT_PREFIX + 'right.png');
		core.preload(PICT_PREFIX + 'shoot.png');
		core.preload(PICT_PREFIX + 'bullet.png');
	}

	function initSprite() {
		//My Machine
		myMachineSprt = new Sprite(64, 64);
		myMachineSprt.image = core.assets[PICT_PREFIX + 'battleplane.png'];
		myMachineSprt.frame = 0;
		myMachineSprt.x = 128;
		myMachineSprt.y = 348;
		myMachineSprt.scale(1.0, 1.0);
		myMachineSprt.addEventListener('enterframe', function(e) {
			//TODO
		});
		core.rootScene.addChild(myMachineSprt);

		//Enemy Machine
		enemyMachineSprt = new Sprite(64, 64);
		enemyMachineSprt.image = core.assets[PICT_PREFIX + 'battleplane.png'];
		enemyMachineSprt.frame = 1;
		enemyMachineSprt.rotation = 180;
		enemyMachineSprt.x = 128;
		enemyMachineSprt.y = 10;
		enemyMachineSprt.scale(1.0, 1.0);
		enemyMachineSprt.addEventListener(Event.TOUCH_START, function(e) {
			//TODO
		});
		core.rootScene.addChild(enemyMachineSprt);

		//left button
		leftButtonSprt = new Sprite(32, 32);
		leftButtonSprt.image = core.assets[PICT_PREFIX + 'left.png'];
		leftButtonSprt.frame = 1;
		leftButtonSprt.x = 32;
		leftButtonSprt.y = 420;
		leftButtonSprt.scale(1.0, 1.0);
		leftButtonSprt.addEventListener(Event.TOUCH_START, function(e) {
			console.log('Left!!');
			myMachineSprt.x -= MACHINE_MOVE_PIX;
			var data = {};
			data.x = myMachineSprt.x;
			data.y = 0;
			data.user = userId;
			data.isShoot = false;
			emitMove(data);
		});
		core.rootScene.addChild(leftButtonSprt);

		//right button
		rightButtonSprt = new Sprite(32, 32);
		rightButtonSprt.image = core.assets[PICT_PREFIX + 'right.png'];
		rightButtonSprt.frame = 1;
		rightButtonSprt.x = 256;
		rightButtonSprt.y = 420;
		rightButtonSprt.scale(1.0, 1.0);
		rightButtonSprt.addEventListener(Event.TOUCH_START, function(e) {
			console.log('Right!!');
			myMachineSprt.x += MACHINE_MOVE_PIX;
			var data = {};
			data.x = myMachineSprt.x;
			data.y = 0;
			data.user = userId;
			data.isShoot = false;
			emitMove(data);
		});
		core.rootScene.addChild(rightButtonSprt);

		//Shoot button
		shootButtonSprt = new Sprite(128, 32);
		shootButtonSprt.image = core.assets[PICT_PREFIX + 'shoot.png'];
		shootButtonSprt.frame = 1;
		shootButtonSprt.x = 96;
		shootButtonSprt.y = 420;
		shootButtonSprt.scale(1.0, 1.0);
		shootButtonSprt.addEventListener(Event.TOUCH_START, function(e) {
			console.log('Shoot!!');
			var data = {};
			data.x = myMachineSprt.x;
			data.y = 0;
			data.user = userId;
			data.isShoot = true;
			emitMove(data);
		});
		core.rootScene.addChild(shootButtonSprt);

	}

	var emitMove;
	core.doMove = function(func) {
		emitMove = func;
	};

	core.onMove = function(data) {
		console.log('onMove!!!' + data.user + data.x + data.y);

		if (data.user === userId) {
			if (data.isShoot) {
				myBulletSprite.push(new MyBullet(data));
			}
		} else {
			enemyMachineSprt.x = data.x;

			if (data.isShoot) {
				enemyBulletSprite.push(new EnemyBullet(data));
			}
		}

	};

	return core;
}
