function game(spec) {

	var SCREEN_WIDTH = 720;
	var SCREEN_HEIGHT = 540;
	var FRAME_RATE = 30;

	var STAGE_GROUND_WIDTH = 80;
	var STAGE_W = 80;

	var RES_PATH_DROID = '../images/droid.dae';
	var RES_BACKGROUND_TEXTURE = '../images/ground.jpg';
	var RES_WALL_TEXTURE = '../images/wall.jpg';
	var RES_PATH_SHOOT_BUTTON = '../images/shoot.png';

	var game = new Game(SCREEN_WIDTH, SCREEN_HEIGHT);
	game.fps = FRAME_RATE;
	game.preload(RES_PATH_DROID);
	game.keybind(' '.charCodeAt(0), 'shoot');

	var userId = Math.random();

	var scene;
	var light;
	var camera;
	var myDroid;
	var stage;
	var tmpEv;

	var enemyDroid;

	var screenRotation = 0;

	var isOnTouch = false;
	var isOnShoot = false;

	var downPoint = {};

	DroidSprite = Class.create(Sprite3D, {
		initialize : function(x, y, z) {
			Sprite3D.call(this);
			this.set(game.assets[RES_PATH_DROID]);
			this.noToon = false;
			this.x = x;
			this.y = y;
			this.z = z;
			scene.addChild(this);
		},
		ontouchstart : function(e) {
			// tmpEv = e;
			// isOnTouch = true;
			downPoint.x = e.x;
			downPoint.y = e.y;
		},
		ontouchend : function(e) {
			if (calcDistance(downPoint.x, downPoint.y, e.x, e.y) < 10.0) {
				emitShootEvent();
			}
			myDroid.v = 0;
			// isOnTouch = false;
		},
		ontouchmove : function(e) {
		},
		onenterframe : function() {
			if (isOnTouch) {
				myDroid.forward(myDroid.v * 0.07);
				emitForward();
			}

			if (game.input.left) {
				emitRotate(0.05);
				// myDroid.rotateYaw(0.05);
			}
			if (game.input.right) {
				emitRotate(-0.05);
				// myDroid.rotateYaw(-0.05);
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
			this.set(game.assets[RES_PATH_DROID]);
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
			// this.forward(0.5);

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
			// this.forward(0.5);

			boundByWall(this);
		}
	});

	game.onload = function() {
		scene = new Scene3D();

		light = new DirectionalLight();
		// light.directionX = myDroid.x;
		// light.directionY = myDroid.y;
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
			tmpEv = e;
			isOnTouch = true;
		});
		game.rootScene.addEventListener('touchend', function(e) {
			myDroid.v = 0;
			isOnTouch = false;
		});
		game.rootScene.addEventListener('touchmove', function(e) {
			myDroid.rotateYaw(-(e.x - tmpEv.x) * 0.02);

			myDroid.v += -(e.y - tmpEv.y) * 0.1;
			if (myDroid.v > 5)
				myDroid.v = 5;
			if (myDroid.v < 0.1)
				myDroid.v = 0.1;
			tmpEv = e;
		});

		camera = scene.getCamera();
		camera.y = 0;
		game.rootScene.addEventListener('enterframe', function(e) {

		});

		// shootButton = new ButtonSprite(0, -0.5, 0, RES_PATH_SHOOT_BUTTON);
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

	function calculateScreenRotation(rotationDiff) {

	}

	function createStage() {
		//Ground
		for (var y = -5; y < 5; y++) {
			for (var x = -5; x < 5; x++) {
				var ground = new PlaneXZ();
				ground.y = -0.5;
				ground.x = (x * STAGE_GROUND_WIDTH / 10) + STAGE_GROUND_WIDTH / 20;
				ground.z = (y * STAGE_GROUND_WIDTH / 10) + STAGE_GROUND_WIDTH / 20;
				ground.mesh.texture = new Texture(RES_BACKGROUND_TEXTURE);
				ground.scale(STAGE_GROUND_WIDTH / 10, 1, STAGE_GROUND_WIDTH / 10);
				scene.addChild(ground);
			}
		}

		//Wall
		// var wall = new PlaneXY();
		// wall.x = (STAGE_GROUND_WIDTH / 10) + STAGE_GROUND_WIDTH / 20;
		// wall.z = (STAGE_GROUND_WIDTH / 10) + STAGE_GROUND_WIDTH / 20;
		// wall.y = -0.5;
		// wall.mesh.texture = new Texture(RES_WALL_TEXTURE);
		// this.mesh.setBaseColor([1.0, 1.0, 1.0, 1.0]);
		// wall.ambient = [0.8, 0.8, 0.8, 1.0];
		// wall.shiness = 1;
		// wall.scale(STAGE_GROUND_WIDTH / 10, STAGE_GROUND_WIDTH / 10, STAGE_GROUND_WIDTH / 10);
		// scene.addChild(wall);
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
