//https://bft.usu.edu/kv9rq
Game.screens['game-play'] = (function (input, graphics, records, menu) {

	var BLOCKSIZE = 25;
	var CANVASWIDTH = 750;

	var cancelNextRequest = false;

	var keyboard = input.Keyboard();
	var scores = records;
	var snake = graphics.Snake()
	var ObsBlks = graphics.Obstacles();
	var score = 0;
	var speed = 0;


	var apple = null;

	function createApple() {
		var appleX = Random.nextRange(0, 29) * BLOCKSIZE;
		var appleY = Random.nextRange(0, 29) * BLOCKSIZE;
		let verified = !graphics.BlocksIntersect(ObsBlks.getBlocks(), appleX, appleY) && !graphics.BlocksIntersect(snake.getSegments(), appleX, appleY);

		while (!verified) {
			appleX = Random.nextRange(0, 29) * BLOCKSIZE;
			appleY = Random.nextRange(0, 29) * BLOCKSIZE;
			verified = !graphics.BlocksIntersect(ObsBlks.getBlocks(), appleX, appleY) && !graphics.BlocksIntersect(snake.getSegments(), appleX, appleY);
		}

		apple = graphics.Apple({
			x: appleX,
			y: appleY,
		});

		console.log(apple.getCoords().x);
		console.log(apple.getCoords().y);
	}

	function initialize() {
		// score = 0;
		// speed = 0;
		// Game.records.initialize(); 
		// //ObsBlks.draw();
		// //snake.draw();
		// createApple();
		// apple.draw();

		keyboard.registerCommand(KeyEvent.DOM_VK_LEFT, snake.moveLeft(-speed));
		keyboard.registerCommand(KeyEvent.DOM_VK_RIGHT, snake.moveRight(speed));
		keyboard.registerCommand(KeyEvent.DOM_VK_UP, snake.moveUp(-speed));
		keyboard.registerCommand(KeyEvent.DOM_VK_DOWN, snake.moveDown(speed));
		keyboard.registerCommand(KeyEvent.DOM_VK_SPACE, go);
		keyboard.registerCommand(KeyEvent.DOM_VK_R, run);
		keyboard.registerCommand(KeyEvent.DOM_VK_I, initialize)
		keyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, function () {
			cancelNextRequest = true;
			menu.showScreen('main-menu');
		});
	}

	function detectCollision() {
		let head = snake.getHead();

		//walls and ceiling
		if (head.x <= 0
			|| head.x + BLOCKSIZE >= CANVASWIDTH
			|| head.y <= 0
			|| head.y >= CANVASWIDTH) {
			cancelNextRequest = true;
			gameOver();
		}

		//obstacles
		if (!graphics.BlocksIntersect(ObsBlks.getBlocks, head.x, head.y)) {
			cancelNextRequest = true;
			gameOver();
		}

		//apple
		if (graphics.intersection(head.x, head.x + BLOCKSIZE, head.y, head.y + BLOCKSIZE, apple.x, apple.x + BLOCKSIZE, apple.y, apple.y + BLOCKSIZE)) {
			snake.addSegments();
			score++;
			createApple();
		}

		// snake collides with self			
		if (SelfCollision(head)) {
			cancelNextRequest = true;
			gameOver();
		}
	}

	function SelfCollision(head) {
		if (snake.getSegments.length < 4) { return false; }
		for (let i = 3; i < snake.segments.length; i++) {
			let seg = snake.getSegments[i];
			if (graphics.intersection(head.x, head.x + BLOCKSIZE, head.y, head.y + BLOCKSIZE, seg.x, seg.x + BLOCKSIZE, seg.y, seg.y + BLOCKSIZE)) {
				return true;
			}
		}
		return false;
	}



	function processInput(elapsedTime) {
		keyboard.update(elapsedTime);
	}

	function gameOver() {
		graphics.setLargeTextProperties();
		graphics.drawText("Game Over :(", 141, 350);
		//setTimeout(function () { menu.showScreen('main-menu'), 1000 });
		scores.update(score);
	}

	function go() {
		if (speed > 0) { return; }
		graphics.clearTopLayer();
		graphics.setCountdownTextProperties();
		graphics.drawText("3", 187, 250);
		setTimeout(function () { graphics.drawText("2", 375, 200); }, 1000);
		setTimeout(function () { graphics.drawText("1", 562, 200); }, 2000);
		setTimeout(function () { graphics.setLargeTextProperties(); }, 2999);
		setTimeout(function () { graphics.drawText("Go!", 280, 500); }, 3000);
		setTimeout(function () { graphics.clearTopLayer(); }, 3300);
		setTimeout(function () { speed = 150; }, 3300);
	}

	function run() {
		initialize();
		lastTimeStamp = performance.now();
		cancelNextRequest = false;
		requestAnimationFrame(gameLoop);
		console.log('Snakes on a Plane!');
	}

	function update(elapsedTime) {
		detectCollision();
		snake.update();
	}

	function render() {
		graphics.clear();
		snake.draw();
		obstacles.draw();
		apple.draw();
		graphics.drawScore(score);
	}

	function gameLoop(currentTime) {
		let elapsedTime = currentTime - lastTimeStamp;
		lastTimeStamp = currentTime;
		processInput(elapsedTime);
		update(elapsedTime);
		render();
		if (!cancelNextRequest) {
			requestAnimationFrame(gameLoop);
		}
	};

	return {
		initialize: initialize,
		run: run
	};

}(Game.input,
	Game.graphics,
	Game.records,
	Game.menu));
