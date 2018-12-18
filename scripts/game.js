//https://bft.usu.edu/kv9rq
Game.screens['game-play'] = (function (input, graphics, records, menu) {

	let BLOCKSIZE = 25;
	let cancelNextRequest = false;
	let play = false;
	let didEat = false;
	let dx = 0;
	let dy = 0;
	let grid = new Array(30);
	let keyboard = input.Keyboard();
	let scores = records;
	let score = 0;
	let speed = 0;
	let snake = [];
	let obstacles = [];
	let apple = { row: 0, col: 0 };
	let timeAccumultor = 150;

	// 0: empty 
	// 1: obstacle
	// 2: snake
	// 3: apple

	function addSegment() {
		let lastRow = snake[snake.length - 1].row;
		let lastCol = snake[snake.length - 1].col;

		if (dy > 0 && dx == 0) { snake.push({ row: lastRow + BLOCKSIZE, col: lastCol }); return; }
		if (dy < 0 && dx == 0) { snake.push({ row: lastRow - BLOCKSIZE, col: lastCol }); return; }
		if (dx < 0 && dy == 0) { snake.push({ row: lastRow, col: lastCol - BLOCKSIZE }); return; }
		if (dx > 0 && dy == 0) { snake.push({ row: lastRow, col: lastCol + BLOCKSIZE }); return; }
	}

	function createApple() {
		grid[apple.row][apple.col] = 0;
		let appleCol = Random.nextRange(0, 29);
		let appleRow = Random.nextRange(0, 29);

		while (grid[appleRow][appleCol] != 0) {
			appleCol = Random.nextRange(0, 29);
			appleRow = Random.nextRange(0, 29);
		}

		grid[appleRow][appleCol] = 3;
		apple = { row: appleRow, col: appleCol };
	}

	function blocksIntersect(blockArr, x, y) {
		if (blockArr.length == 0) { return false; }
		for (let i = 0; i < blockArr.length; i++) {
			let r1 = blockArr[i].getCoords();
			if (intersection(r1.x, r1.x + BLOCKSIZE, r1.y, r1.y + BLOCKSIZE, x, x + BLOCKSIZE, y, y + BLOCKSIZE)) {
				return true;
			}
		}
		return false;
	}

	function createObstacles() {
		let count = 0;

		while (count <= 10) {
			let obRow = Random.nextRange(0, 29);
			let obCol = Random.nextRange(0, 29);

			while (grid[obRow][obCol] != 0) {
				obRow = Random.nextRange(0, 29);
				obCol = Random.nextRange(0, 29);
			}

			count++;
			grid[obRow][obCol] = 1;
		}
	}

	function detectCollision() {
		const head = snake[0];

		//walls and ceiling
		if (head.row < 0 || head.row > 29 || head.col < 0 || head.col > 29) {
			cancelNextRequest = true;
			gameOver();
		}

		// obstacles
		for (let i = 0; i < grid.length; i++) {
			for (let j = 0; j < grid.length; j++) {
				if (grid[i][j] == 1 && head.row == i && head.col == j) {
					cancelNextRequest = true;
					gameOver();
				}
			}
		}

		//apple
		if (head.row == apple.row && head.col == apple.col) {
			didEat = true;
		}

		// snake collides with self			
		if (SelfCollision(head)) {
			cancelNextRequest = true;
			gameOver();
		}
	}

	function initialize() {
		initializeGrid();
		initializeSnake();
		createApple();
		createObstacles();
		grid[14][16] = 0;
		grid[14][15] = 0;
		grid[14][14] = 0;
		grid[14][13] = 0;
		score = 0;
		speed = 0;
		Game.records.initialize();

		keyboard.registerCommand(KeyEvent.DOM_VK_LEFT, moveLeft);
		keyboard.registerCommand(KeyEvent.DOM_VK_RIGHT, moveRight);
		keyboard.registerCommand(KeyEvent.DOM_VK_UP, moveUp);
		keyboard.registerCommand(KeyEvent.DOM_VK_DOWN, moveDown);
		keyboard.registerCommand(KeyEvent.DOM_VK_SPACE, go);
		keyboard.registerCommand(KeyEvent.DOM_VK_R, run);
		keyboard.registerCommand(KeyEvent.DOM_VK_I, initialize)
		keyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, function () {
			cancelNextRequest = true;
			menu.showScreen('main-menu');
		});
	}

	function initializeGrid() {
		for (let i = 0; i < grid.length; i++) {
			grid[i] = new Array(30);
		}
		for (i = 0; i < grid.length; i++) {
			for (let j = 0; j < grid.length; j++) {
				grid[i][j] = 0;
			}
		}
	}

	function initializeSnake() {
		snake.push({ row: 14, col: 16 });
		snake.push({ row: 14, col: 15 });
		snake.push({ row: 14, col: 14 });
		snake.push({ row: 14, col: 13 });
		grid[14][16] = 2;
		grid[14][15] = 2;
		grid[14][14] = 2;
		grid[14][13] = 2;
	}

	function intersection(r1l, r1r, r1t, r1b, r2l, r2r, r2t, r2b) {
		return !(r2l > r1r ||
			r2r < r1l ||
			r2t > r1b ||
			r2b < r1t);
	}

	function SelfCollision(head) {
		for (let i = 3; i < snake.length; i++) {
			if (head.row == snake[i].row && head.col == snake[i].col) { return true; }
		}
		return false;
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
	}

	function gameOver() {
		graphics.setLargeTextProperties();
		graphics.drawText("Game Over :(", 25, 350);
		setTimeout(function () { menu.showScreen('main-menu'), 1000 });
		scores.update(score);
	}

	function go() {
		if (speed > 0) { return; }
		graphics.clearTopLayer();
		graphics.setCountdownTextProperties();
		graphics.drawText("3", 187, 250);
		setTimeout(function () { graphics.drawText("2", 375, 250); }, 1000);
		setTimeout(function () { graphics.drawText("1", 562, 250); }, 2000);
		setTimeout(function () { graphics.setLargeTextProperties(); }, 2999);
		setTimeout(function () { graphics.drawText("Go!", 280, 500); }, 3000);
		setTimeout(function () { graphics.clearTopLayer(); }, 3300);
		setTimeout(function () { speed = 150; go = true; dx = 1;}, 3300);
	}

	function moveDown() {
		if (dy < 0) { return; }
		dx = 0;
		dy = 1;
	}

	function moveLeft() {
		if (dx > 0) { return; }
		dx = -1;
		dy = 0;
	}

	function moveRight() {
		if (dx < 0) { return; }
		dx = 1;
		dy = 0;
	}

	function moveUp() {
		if (dy > 0) { return; }
		dx = 0;
		dy = -1
	}

	function processInput(elapsedTime) {
		keyboard.update(elapsedTime);
	}

	function render() {
		graphics.clear();

		for (let i = 0; i < grid.length; i++) {
			for (let j = 0; j < grid.length; j++) {
				if (grid[i][j] == 1) { graphics.drawObstacle(i, j); }
				if (grid[i][j] == 3) { graphics.drawApple(i, j); }
			}
		}

		for (let i = 0; i < snake.length; i++) {
			graphics.drawSnakeSegment(snake[i].row, snake[i].col);
		}

		graphics.drawScore(score);
	}

	function run() {
		lastTimeStamp = performance.now();
		cancelNextRequest = false;
		requestAnimationFrame(gameLoop);
		console.log('Snakes on a Plane!');
	}

	function update(elapsedTime) {
			timeAccumultor -= elapsedTime;
			if (timeAccumultor > 0) { return; }
			timeAccumultor = 5000;
			detectCollision();
			const head = { row: snake[0].row + dy * BLOCKSIZE, col: snake[0].row + dx * BLOCKSIZE };
			snake.unshift(head);

			if (didEat) {
				didEat = false;
				score++;
				createApple();
			}
			else { snake.pop(); }
	}

	return {
		initialize: initialize,
		run: run
	};

}(Game.input,
	Game.graphics,
	Game.records,
	Game.menu));
