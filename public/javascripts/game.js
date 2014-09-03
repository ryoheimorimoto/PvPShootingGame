function game(spec, my) {

	var SCREEN_WIDTH = 320;
	var SCREEN_HEIGHT = 480;
	var FRAME_RATE = 15;
	var MACHINE_MOVE_PIX = 10;
	var BULLET_MOVE_PIX = 12;

	var SYNC_TIME_INTERVAL = 5;

	var PICT_PREFIX = location.origin + '/images/';

	var playerName = spec.playerName;
	var enemyName = spec.enemyName;

	var userId = Math.random();

	var myMachineSprt;
	var enemyMachineSprt;

	var myBulletSprt = [];
	var enemyBulletSprt = [];

	var leftButtonSprt;
	var rightButtonSprt;
	var shootButtonSprt;

	var syncFrameEvent = function() {
	};
	var syncFrameCount = 0;

	var core = new Core(SCREEN_WIDTH, SCREEN_HEIGHT);
	core.fps = FRAME_RATE;
	core.rootScene.backgroundColor = 'black';

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
				delete myBulletSprt[0];
				myBulletSprt.shift();
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
				delete enemyBulletSprt[0];
				enemyBulletSprt.shift();
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
		for (var i = 0; i < myBulletSprt.length; i++) {
			if (enemyMachineSprt.intersect(myBulletSprt[i])) {
				enemyMachineSprt.backgroundColor = 'red';
			} else {
				//do nothing
			}
		}
		for (var i = 0; i < enemyBulletSprt.length; i++) {
			if (myMachineSprt.intersect(enemyBulletSprt[i])) {
				myMachineSprt.backgroundColor = 'red';
			} else {
				//do nothing
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
		var buttonSprt = new Sprite(width, height);
		buttonSprt.image = resource;
		buttonSprt.frame = 1;
		buttonSprt.x = x;
		buttonSprt.y = y;
		buttonSprt.scale(scale, scale);
		buttonSprt.addEventListener(Event.TOUCH_START, function(e) {
			var data = {};
			data.x = myMachineSprt.x;
			data.y = 0;
			data.user = userId;
			data.action = actionName;
			emitAction(data);
		});
		return buttonSprt;
	}

	function initSprite() {
		myMachineSprt = createMachineSprt(128, 348, 64, 64, core.assets[PICT_PREFIX + 'battleplane.png'], 1.0, 0);
		core.rootScene.addChild(myMachineSprt);

		enemyMachineSprt = createMachineSprt(128, 10, 64, 64, core.assets[PICT_PREFIX + 'battleplane.png'], 1.0, 180);
		core.rootScene.addChild(enemyMachineSprt);

		leftButtonSprt = createButtonSprt(32, 420, 32, 32, core.assets[PICT_PREFIX + 'left.png'], 1.0, 'move.left');
		core.rootScene.addChild(leftButtonSprt);

		rightButtonSprt = createButtonSprt(256, 420, 32, 32, core.assets[PICT_PREFIX + 'right.png'], 1.0, 'move.right');
		core.rootScene.addChild(rightButtonSprt);

		shootButtonSprt = createButtonSprt(96, 420, 128, 32, core.assets[PICT_PREFIX + 'shoot.png'], 1.0, 'shoot');
		core.rootScene.addChild(shootButtonSprt);
	}

	var emitAction;
	core.doAction = function(func) {
		emitAction = func;
	};

	core.onAction = function(data) {
		if (data.user === userId) {
			if (data.action === 'shoot') {
				myBulletSprt.push(new MyBullet(data));
			} else if (data.action === 'move.right') {
				myMachineSprt.x += MACHINE_MOVE_PIX;
			} else if (data.action === 'move.left') {
				myMachineSprt.x -= MACHINE_MOVE_PIX;
			}
		} else {
			enemyMachineSprt.x = data.x;
			if (data.action === 'shoot') {
				enemyBulletSprt.push(new EnemyBullet(data));
			} else if (data.action === 'move.right') {
				enemyMachineSprt.x += MACHINE_MOVE_PIX;
			} else if (data.action === 'move.left') {
				enemyMachineSprt.x -= MACHINE_MOVE_PIX;
			}
		}
	};

	return core;
}
