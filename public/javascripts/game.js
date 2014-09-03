function game(spec, my) {

	var FRAME_RATE = 15;
	//fps
	var MACHINE_MOVE_PIX = 10;
	var BULLET_MOVE_PIX = 12;

	var SYNC_TIME_INTERVAL = 5;

	var PICT_PREFIX = location.origin + '/images/';

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

	var syncFrameEvent = function() {
	};
	var syncFrameCount = 0;

	var core = new Core(320, 480);
	core.fps = FRAME_RATE;
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
			this.y -= BULLET_MOVE_PIX;
			if (this.y < 0) {
				console.log("My bullet removed");
				delete myBulletSprite[0];
				myBulletSprite.shift();
				core.rootScene.removeChild(this);
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
			this.y += BULLET_MOVE_PIX;
			if (this.y > 480) {
				console.log("Enemy bullet removed");
				delete enemyBulletSprite[0];
				enemyBulletSprite.shift();
				core.rootScene.removeChild(this);
			}
		},
	});

	preLoad();

	core.onload = function() {
		initSprite();
		core.rootScene.addEventListener('enterframe', function(e) {
			if (core.frame === syncFrameCount) {
				syncFrameEvent();
			}

			hitTest();
		});
	};

	function hitTest() {
		console.log("hitTestMain");
		for (var i = 0; i < myBulletSprite.length; i++) {
			if (enemyMachineSprt.intersect(myBulletSprite[i])) {
				console.log("HIT!!!!!!!!!!!");
				enemyMachineSprt.backgroundColor = 'red';
			} else {
				console.log("NOT HIT!!!!!!!!!!!");
			}
		}
		for (var i = 0; i < enemyBulletSprite.length; i++) {
			if (myMachineSprt.intersect(enemyBulletSprite[i])) {
				console.log("HIT!!!!!!!!!!!");
				myMachineSprt.backgroundColor = 'red';
			} else {
				console.log("NOT HIT!!!!!!!!!!!");
			}
		}
	}

	function preLoad() {
		core.preload(PICT_PREFIX + 'battleplane.png');
		core.preload(PICT_PREFIX + 'left.png');
		core.preload(PICT_PREFIX + 'right.png');
		core.preload(PICT_PREFIX + 'shoot.png');
		core.preload(PICT_PREFIX + 'bullet.png');
	}
	
	function createMachineSprt(x, y, width, height, resource, scale, rotation) {
		var machineSprt = new Sprite(width, height);
		machineSprt.x = x;
		machineSprt.y = y;
		machineSprt.image = resource;
		machineSprt.frame = 0;
		machineSprt.scale(scale, scale);
		machineSprt.rotation = rotation;
		machineSprt.addEventListener('enterframe', function(e) {
			//TODO
		});
		return machineSprt;
	}
	
	function createButtonSprt(x, y, width, height, resource, scale, actionName) {
		
	}

	function initSprite() {
		myMachineSprt = createMachineSprt(128, 348, 64, 64, core.assets[PICT_PREFIX + 'battleplane.png'], 1.0, 0);
		core.rootScene.addChild(myMachineSprt);

		enemyMachineSprt = createMachineSprt(128, 10, 64, 64, core.assets[PICT_PREFIX + 'battleplane.png'], 1.0, 180);
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
			var data = {};
			data.x = myMachineSprt.x;
			data.y = 0;
			data.user = userId;
			data.action = "move.left";
			emitAction(data);
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
			var data = {};
			data.x = myMachineSprt.x;
			data.y = 0;
			data.user = userId;
			data.action = "move.right";
			emitAction(data);
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
			data.action = "shoot";
			emitAction(data);
		});
		core.rootScene.addChild(shootButtonSprt);

	}

	var emitAction;
	core.doAction = function(func) {
		emitAction = func;
	};

	core.onAction = function(data) {
		console.log('onAction!!!' + data.user + data.x + data.y);

		if (data.user === userId) {
			if (data.action === "shoot") {
				myBulletSprite.push(new MyBullet(data));
			} else if (data.action === "move.right") {
				myMachineSprt.x += MACHINE_MOVE_PIX;
			} else if (data.action === "move.left") {
				myMachineSprt.x -= MACHINE_MOVE_PIX;
			}
		} else {
			enemyMachineSprt.x = data.x;

			if (data.action === "shoot") {
				enemyBulletSprite.push(new EnemyBullet(data));
			} else if (data.action === "move.right") {
				enemyMachineSprt.x += MACHINE_MOVE_PIX;
			} else if (data.action === "move.left") {
				enemyMachineSprt.x -= MACHINE_MOVE_PIX;
			}
		}

	};

	return core;
}
