enchant();
window.onload = function() {

	var PICT_PREFIX = location.origin + '/images/';

	var game = new Game(480, 480);
	game.fps = 60;

	var testCount = 0;
	game.preload(PICT_PREFIX + 'tex.jpg');
	// game.preload(PICT_PREFIX + 'F15C/F-15C_Eagle.dae');
	game.preload(PICT_PREFIX + 'droid.dae');
	// game.preload(PICT_PREFIX + 'Boeing747/Boeing747.dae');
	// game.preload(PICT_PREFIX + 'Galaxy/galaxy.dae');

	var directionX = 1;
	var directionY = 1;
	var directionZ = 1;

	var directionBoxX = 1;
	var directionBoxY = 1;

	var WIDTH = 1.5;
	var HEIGHT = 1.5;
	var DEPTH = 5.0;

	game.onload = function() {
		var scene = new Scene3D();

		var droid = Sprite3D();
		droid.set(game.assets[PICT_PREFIX + 'droid.dae']);
		droid.x = 0;
		droid.y = 0;
		droid.scaleX = 0.5;
		droid.scaleY = 0.5;
		droid.scaleZ = 0.5;
		scene.addChild(droid);

		// var machine = Sprite3D();
		// // machine.set(game.assets[PICT_PREFIX + 'F15C/F-15C_Eagle.dae']);
		// machine.set(game.assets[PICT_PREFIX + 'Boeing747/Boeing747.dae']);
		// machine.x = -0.5;
		// machine.y = 0.5;
		// machine.scaleX = 3;
		// machine.scaleY = 3;
		// machine.scaleZ = 3;
		// scene.addChild(machine);

		var sphere = new Sphere(0.3);
		sphere.x = -1.5;
		sphere.y = -0.6;
		sphere.mesh.texture.src = game.assets[PICT_PREFIX + 'tex.jpg'];

		scene.addChild(sphere);
		setInterval(function() {
			if (sphere.x > WIDTH) {
				directionX *= -1;
			} else if (sphere.x < -WIDTH) {
				directionX *= -1;
			}
			sphere.x += 0.04 * directionX;

			if (sphere.y > HEIGHT) {
				directionY *= -1;
			} else if (sphere.y < -HEIGHT) {
				directionY *= -1;
			}
			sphere.y += 0.02 * directionY;

			if (sphere.z > DEPTH) {
				directionZ *= -1;
			} else if (sphere.z < -DEPTH) {
				directionZ *= -1;
			}
			sphere.z += 0.2 * directionZ;
		}, 33);

		var cylinder = new Cylinder(0.3, 0.5);
		cylinder.x = 1;
		scene.addChild(cylinder);

		var box = new Box(0.3, 0.3, 0.3);
		box.x = -1;
		scene.addChild(box);
		setInterval(function() {
			if (box.x > WIDTH) {
				directionBoxX *= -1;
			} else if (box.x < -WIDTH) {
				directionBoxX *= -1;
			}
			box.x += 0.03 * directionBoxX;

			if (box.y > HEIGHT) {
				directionBoxY *= -1;
			} else if (box.y < -HEIGHT) {
				directionBoxY *= -1;
			}
			box.y += 0.05 * directionBoxY;

		}, 33);

		for (var it in scene.childNodes ) {
			var node = scene.childNodes[it];
			node.count = 0;
			node.factor = (Math.random() * 100 + 37);
			node.addEventListener(Event.ENTER_FRAME, function() {++this.count;
				var rot = Math.PI * this.count / this.factor;
				this.rotation = [1, 0, 0, 0, 0, Math.cos(rot), -Math.sin(rot), 0, 0, Math.sin(rot), Math.cos(rot), 0, 0, 0, 0, 1];
			}.bind(node));
		}
		var light = new DirectionalLight();
		light.count = 0;

		// this.addEventListener(Event.ENTER_FRAME, function() {++light.count;
		// var urad = Math.PI * light.count / 97;
		// light.directionX = Math.sin(urad);
		// light.directionY = Math.cos(urad);
		// light.color = [Math.sin(urad), Math.cos(urad), 0.5];
		// });

		this.addEventListener('enterframe', function() {
			if (game.input.up) {
				this.testCount++;
				console.log("Up");
			}
			if (game.input.down) {
				this.testCount--;
				console.log("Down");
			}
			if (game.input.right) {
				console.log("Right");
			}
			if (game.input.left) {
				console.log("Up");
			}

			var rot = Math.PI * this.count / this.factor;
			this.rotation = [1, 0, 0, 0, 0, Math.cos(rot), -Math.sin(rot), 0, 0, Math.sin(rot), Math.cos(rot), 0, 0, 0, 0, 1];
		});

		scene.setDirectionalLight(light);

	};
	game.start();

};
