function game(spec) {

	var SCREEN_WIDTH = 360;
	var SCREEN_HEIGHT = 540;
	var FRAME_RATE = 30;

	var RES_PATH_DROID = '../images/droid.dae';
	var RES_BACKGROUND_TEXTURE = '../images/tex.jpg';

	var game = new Game(SCREEN_WIDTH, SCREEN_HEIGHT);
	game.fps = FRAME_RATE;
	game.preload(RES_PATH_DROID);

	var scene;
	var droid;
	var stage;

	var isOnTouch = false;

	DroidSprite = Class.create(Sprite3D, {
		initialize : function(x, y, z) {
			Sprite3D.call(this);
			this.set(game.assets[RES_PATH_DROID]);
			this.noToon = false;
			this.x = x;
			this.y = y;
			this.z = z;
			scene.addChild(this);
		}
	});

	game.onload = function() {
		scene = new Scene3D();
		scene.setDirectionalLight(new DirectionalLight());
		scene.setCamera(new Camera3D());

		droid = new DroidSprite(0, -0.5, 0);
		droid.v = 0;

		stage = new PlaneXZ();
		stage.y = -0.5;
		stage.mesh.texture = new Texture(RES_BACKGROUND_TEXTURE);
		stage.scale(60, 1, 60);
		scene.addChild(stage);

		game.rootScene.addEventListener('touchstart', function(e) {
			tmpEv = e;
			isOnTouch = true;
		});
		game.rootScene.addEventListener('touchend', function(e) {
			droid.v = 0;
			isOnTouch = false;
		});
		game.rootScene.addEventListener('touchmove', function(e) {

			//フリックのX移動量に応じて方向転換
			droid.rotateYaw(-(e.x - tmpEv.x) * 0.02);

			//フリックのY移動量に応じて速度を増す
			droid.v += -(e.y - tmpEv.y) * 0.1;
			if (droid.v > 5)
				droid.v = 5;
			if (droid.v < 0.1)
				droid.v = 0.1;
			tmpEv = e;
		});

		camera = scene.getCamera();
		camera.y = 0;
		game.rootScene.addEventListener('enterframe', function(e) {
			//droidを前進させる
			if (isOnTouch) {
				droid.forward(droid.v * 0.07);
			}

			//キーボード操作にも対応
			if (game.input.left) {
				droid.rotateYaw(0.05);
			}
			if (game.input.right) {
				droid.rotateYaw(-0.05);
			}
			if (game.input.up) {
				droid.forward(droid.v * 0.07);
				droid.v += 1;
				if (droid.v > 5)
					droid.v = 5;
			}
			if (game.input.down) {
				droid.forward(droid.v * 0.07);
				droid.v *= 0.8;
			}

			//フィールドの端に達したら方向転換
			if (droid.x < -30)
				droid.rotateYaw(Math.PI * 0.25);
			if (droid.x > 30)
				droid.rotateYaw(Math.PI * 0.25);
			if (droid.z < -30)
				droid.rotateYaw(Math.PI * 0.25);
			if (droid.z > 30)
				droid.rotateYaw(Math.PI * 0.52);

			//droidをカメラが追いかける
			camera.chase(droid, -20, 10);

			//droidをカメラが見る
			camera.lookAt(droid);
			camera.y = 4;
		});
	};

	game.moveScene = function(func) {
		//TODO
	};

	game.doAction = function(func) {
		//TODO
	};

	game.onAction = function(data) {
		//TODO
	};
	return game;
}
