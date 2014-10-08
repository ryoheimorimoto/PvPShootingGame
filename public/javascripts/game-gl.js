function game(spec) {

	var SCREEN_WIDTH = 720;
	var SCREEN_HEIGHT = 540;
	var FRAME_RATE = 30;

	var STAGE_GROUND_WIDTH = 80;

	var RES_DROID = '../images/droid.dae';
	var RES_TEXTURE_GROUND = '../images/ground.jpg';

	var game = new Game(SCREEN_WIDTH, SCREEN_HEIGHT);
	game.fps = FRAME_RATE;
	game.preload(RES_DROID);
	game.preload(RES_TEXTURE_GROUND);
	game.keybind(' '.charCodeAt(0), 'shoot');

	var userId = Math.random();
	var scene;
	var light;
	var camera;
	var myDroid;
	var enemyDroid;
	var stage;

	var lastEvent;
	var downPoint = {};

	var isOnTouch = false;
	var isOnShoot = false;

	DroidSprite = Class.create(Sprite3D, {
		initialize : function(x, y, z) {
			Sprite3D.call(this);
			this.set(game.assets[RES_DROID]);
			this.noToon = false;
			this.x = x;
			this.y = y;
			this.z = z;
			scene.addChild(this);
		},
		ontouchstart : function(e) {
			downPoint.x = e.x;
			downPoint.y = e.y;
		},
		ontouchend : function(e) {
			if (calcDistance(downPoint.x, downPoint.y, e.x, e.y) < 10.0) {
				emitShootEvent();
			}
			myDroid.v = 0;
		},
		ontouchmove : function(e) {
			//moved to global event.
		},
		onenterframe : function() {
			if (isOnTouch) {
				myDroid.forward(myDroid.v * 0.07);
				emitForward();
			}

			if (game.input.left) {
				emitRotate(0.05);
			}
			if (game.input.right) {
				emitRotate(-0.05);
			}
			if (game.input.up) {
				myDroid.forward(myDroid.v * 0.07);
				emitForward();
				myDroid.v += 1;
				if (myDroid.v > 5)
					myDroid.v = 5;
			}
			if (game.input.down) {
				myDroid.forward(myDroid.v * 0.07);
				emitForward();
				myDroid.v *= 0.8;
			}
			if (game.input.shoot) {
				if (!isOnShoot) {
					emitShootEvent();
					isOnShoot = true;
					var timerId = setInterval(function() {
						if (game.input.shoot) {
							emitShootEvent();
						} else {
							isOnShoot = false;
							clearInterval(timerId);
						}
					}, 500);
				}

			}

			boundByWall(this);
			camera.chase(myDroid, -20, 10);
			camera.lookAt(myDroid);
			camera.y = 3;
		}
	});

	EnemyDroidSprite = Class.create(Sprite3D, {
		initialize : function(x, y, z) {
			Sprite3D.call(this);
			this.set(game.assets[RES_DROID]);
			this.noToon = false;
			this.x = x;
			this.y = y;
			this.z = z;
			scene.addChild(this);
			this.rotateYaw(Math.PI);
		}
	});

	BallSprite = Class.create(Sphere, {
		initialize : function(x, y, z) {
			Sphere.call(this);
			this.x = x;
			this.y = y;
			this.z = z;
			this.scale(0.25, 0.25, 0.25);
			this.mesh.setBaseColor([0.5, 0.5, 1.0, 1.0]);
			scene.addChild(this);
			this.noToon = false;
			var quat = [];
			for (var i = 0; i < myDroid.rotation.length; i++) {
				quat[i] = myDroid.rotation[i];
			}
			this.rotation = quat;
			setInterval(function(obj) {
				obj.forward(0.5);
			}, 1000 / FRAME_RATE, this);
			this.forward(2.0);
		},
		onenterframe : function() {
			var dist = this.bounding.toBounding(myDroid.bounding);
			var distEnemy = this.bounding.toBounding(enemyDroid.bounding);
			if (dist < 2.0 || distEnemy < 2.0) {
				console.log('HIT!!!');
				this.mesh.setBaseColor([1.0, 0.0, 0.0, 1.0]);
			}
			boundByWall(this);
		}
	});

	EnemyBallSprite = Class.create(Sphere, {
		initialize : function(x, y, z) {
			Sphere.call(this);
			this.x = x;
			this.y = y;
			this.z = z;
			this.scale(0.25, 0.25, 0.25);
			this.mesh.setBaseColor([0.5, 0.5, 1.0, 1.0]);
			scene.addChild(this);
			this.noToon = false;
			var quat = [];
			for (var i = 0; i < enemyDroid.rotation.length; i++) {
				quat[i] = enemyDroid.rotation[i];
			}
			this.rotation = quat;
			setInterval(function(obj) {
				obj.forward(0.5);
			}, 1000 / FRAME_RATE, this);
			this.forward(2.0);
		},
		onenterframe : function() {
			var dist = this.bounding.toBounding(myDroid.bounding);
			if (dist < 2.0) {
				console.log('HIT!!!');
				this.mesh.setBaseColor([1.0, 0.0, 0.0, 1.0]);
			}
			boundByWall(this);
		}
	});

	game.onload = function() {
		scene = new Scene3D();

		light = new DirectionalLight();
		light.directionZ = 0;
		light.color = [1.0, 1.0, 1.0];
		scene.setDirectionalLight(light);

		camera = new Camera3D();
		scene.setCamera(camera);

		myDroid = new DroidSprite(0, -0.5, -20);
		myDroid.v = 0;

		enemyDroid = new EnemyDroidSprite(0, -0.5, 20);
		enemyDroid.v = 0;

		createStage();

		game.rootScene.addEventListener('touchstart', function(e) {
			lastEvent = e;
			isOnTouch = true;
		});
		game.rootScene.addEventListener('touchend', function(e) {
			myDroid.v = 0;
			isOnTouch = false;
		});
		game.rootScene.addEventListener('touchmove', function(e) {
			myDroid.rotateYaw(-(e.x - lastEvent.x) * 0.02);

			myDroid.v += -(e.y - lastEvent.y) * 0.1;
			if (myDroid.v > 5)
				myDroid.v = 5;
			if (myDroid.v < 0.1)
				myDroid.v = 0.1;
			lastEvent = e;
		});

		camera = scene.getCamera();
		camera.y = 0;
		game.rootScene.addEventListener('enterframe', function(e) {
			//do nothing
		});
	};

	game.moveScene = function(func) {
		//TODO
	};

	var emitAction;
	game.doAction = function(func) {
		emitAction = func;
	};

	game.onAction = function(data) {
		console.log('onAction!');

		if (data.user === userId) {
			//TODO
		} else {
			if (data.action === 'shoot') {
				console.log('Enemy Shoot!');
				new EnemyBallSprite(enemyDroid.x, enemyDroid.y + 1.0, enemyDroid.z);
			} else if (data.action === 'rotate') {
				console.log('Enemy Rotate!');
				enemyDroid.rotateYaw(data.value);
			} else if (data.action === 'forward') {
				console.log('Enemy Forward!');
				enemyDroid.x = data.x * -1;
				enemyDroid.y = data.y;
				enemyDroid.z = data.z * -1;
			}
		}
	};

	function emitShootEvent() {
		new BallSprite(myDroid.x, myDroid.y + 1.0, myDroid.z);

		var data = {};
		data.x = myDroid.x;
		data.y = myDroid.y;
		data.z = myDroid.z;
		data.user = userId;
		data.action = 'shoot';
		emitAction(data);
	}

	function emitRotate(val) {
		myDroid.rotateYaw(val);

		var data = {};
		data.x = myDroid.x;
		data.y = myDroid.y;
		data.z = myDroid.z;
		data.user = userId;
		data.value = val;
		data.action = 'rotate';
		emitAction(data);
	};

	function emitForward() {
		var data = {};
		data.x = myDroid.x;
		data.y = myDroid.y;
		data.z = myDroid.z;
		data.user = userId;
		data.action = 'forward';
		emitAction(data);
	}

	function emitMoveEvent() {

	}

	function createStage() {
		for (var y = -5; y < 5; y++) {
			for (var x = -5; x < 5; x++) {
				var ground = new PlaneXZ();
				ground.y = -0.5;
				ground.x = (x * STAGE_GROUND_WIDTH / 10) + STAGE_GROUND_WIDTH / 20;
				ground.z = (y * STAGE_GROUND_WIDTH / 10) + STAGE_GROUND_WIDTH / 20;
				ground.mesh.texture = new Texture(RES_TEXTURE_GROUND);
				ground.scale(STAGE_GROUND_WIDTH / 10, 1, STAGE_GROUND_WIDTH / 10);
				scene.addChild(ground);
			}
		}
	}

	function boundByWall(obj) {
		if (obj.x < -STAGE_GROUND_WIDTH / 2.0)
			obj.rotateYaw(Math.PI * 0.25);
		if (obj.x > STAGE_GROUND_WIDTH / 2.0)
			obj.rotateYaw(Math.PI * 0.25);
		if (obj.z < -STAGE_GROUND_WIDTH / 2.0)
			obj.rotateYaw(Math.PI * 0.25);
		if (obj.z > STAGE_GROUND_WIDTH / 2.0)
			obj.rotateYaw(Math.PI * 0.25);
	}

	function calcDistance(x1, y1, x2, y2) {
		var a, b, d;
		a = x1 - x2;
		b = y1 - y2;
		d = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
		return d;
	}

	return game;
}
