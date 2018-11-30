// ------------------------------------------------------------------
// This is the graphics object.  The various rendering components
// are located here.
// ------------------------------------------------------------------
Game.graphics = (function () {

	let backgroundCanvas = document.getElementById('backgroundCanvas');
	let backgroundContext = backgroundCanvas.getContext('2d');
	let gameCanvas = document.getElementById('gameCanvas');
	let gameContext = gameCanvas.getContext('2d');
	let topLayerCanvas = document.getElementById('topLayerCanvas');
	let topLayerContext = topLayerCanvas.getContext('2d');
	let bodyFillStyle = 'rgb(0, 208, 208)';  //The best cyan
	let headFillStyle = 'rgba(0, 255, 0, 1)'; // Very Green
	let blockFillStyle = 'rgba(225, 225, 0, 1)'; // Very Yellow
	let appleFillStyle = 'rgba(255, 0, 0, 1)'; //Very Red
	let BLOCKSIZE = 25;

	//------------------------------------------------------------------
	// Public function that allows the client code to clear the canvas.
	//------------------------------------------------------------------
	function clear() {
		gameContext.save();
		gameContext.setTransform(1, 0, 0, 1, 0, 0);
		gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
		gameContext.restore();
	}

	function clearTopLayer() {
		topLayerContext.save();
		topLayerContext.setTransform(1, 0, 0, 1, 0, 0);
		topLayerContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
		topLayerContext.restore();
	}

	function drawBackground() {
		backgroundContext.fillStyle = "rgba(0, 0, 0, 0.25)";
		backgroundContext.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
		backgroundContext.fillStyle = 'red';
	}

	function setCountdownTextProperties() {
		topLayerContext.font = '45px Roboto';
		topLayerContext.fillStyle = "rgba(0, 0, 0, 0.25)";
		topLayerContext.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
		topLayerContext.fillStyle = '#00d0d0';
	}

	function setScoreTextProps() {
		gameContext.font = '15px Roboto';
		gameContext.fillStyle = '#00d0d0';
	}

	function setLargeTextProperties() {
		topLayerContext.font = '125px Roboto';
		topLayerContext.fillStyle = "rgba(0, 0, 0, 0.25)";
		topLayerContext.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
		topLayerContext.fillStyle = '#00d0d0';
	}

	function drawText(text, x, y) {
		topLayerContext.fillText(text, x, y);

		// This was used to set the correct x coordinate for text.
		// For no conceivable reason text is drawn from the x: left y: bottom
		// or x: left y:middle of the character/string
		//console.log(topContext.measureText(text));
	}

	function drawScore(score) {
		setScoreTextProps();
		var scoreText = 'Score: ' + score;
		var textWidth = gameContext.measureText(scoreText).width + 10;
		gameContext.fillText(scoreText, gameCanvas.width - textWidth, gameCanvas.height - 10);
	}

	function intersection(r1l, r1r, r1t, r1b, r2l, r2r, r2t, r2b) {
		return !(r2l > r1r ||
			r2r < r1l ||
			r2t > r1b ||
			r2b < r1t);
	}

	function BlocksIntersect(blockArr, x, y) {
		if (blockArr.length == 0) { return false; }
		for (let i = 0; i < blockArr.length - 1; i++) {
			var r1 = blockArr[i].getCoords();
			if (intersection(r1.x, r1.x + BLOCKSIZE, r1.y, r1.y + BLOCKSIZE, x, x + BLOCKSIZE, y, y + BLOCKSIZE)) {
				return true;
			}
		}
		return false;
	}

	function Apple(spec) {
		that = {};
		var coords = {
			x: spec.x,
			y: spec.y
		};

		that.getCoords = function () {
			return coords;
		}

		that.draw = function () {
			gameContext.save();
			gameContext.fillStyle = appleFillStyle;
			gameContext.strokestyle = 'black';
			gameContext.fillRect(coords.x, coords.y, BLOCKSIZE, BLOCKSIZE);
			gameContext.strokeRect(coords.x, coords.y, BLOCKSIZE, BLOCKSIZE);
			gameContext.restore();
		}

		return that;
	}

	function Obstacles() {
		that = {};
		var blocks = [];
		var count = 0;

		while (count <= 15) {
			let testX = Random.nextRange(0, 29) * BLOCKSIZE;
			let testY = Random.nextRange(0, 29) * BLOCKSIZE;
			if (!BlocksIntersect(blocks, testX, testY)) {
				blocks.push(Obstacle({ x: testX, y: testY }));
				count++;
			}
		}

		that.getBlocks = function () {
			return blocks;
		}

		that.draw = function () {
			for (let i = 0; i < blocks.length; i++) {
				blocks[i].draw();
			}
		}

		return that;
	};

	function Obstacle(spec) {
		that = {};
		var coords = {
			x: spec.x,
			y: spec.y
		};

		that.getCoords = function () {
			return coords;
		}

		that.draw = function () {
			gameContext.save();
			gameContext.fillStyle = blockFillStyle;
			gameContext.strokestyle = 'black';
			gameContext.fillRect(coords.x, coords.y, BLOCKSIZE, BLOCKSIZE);
			gameContext.strokeRect(coords.x, coords.y, BLOCKSIZE, BLOCKSIZE);
			gameContext.restore();
		}

		return that;
	}

	function Snake(spec) {
		that = {};
		that.dirX = 0;
		that.dirY = 0;
		var segments = [];

		segments.push(Segment({
			fillStyle: bodyFillStyle,
			x: Random.nextRange(0, 49) * 10,
			y: Random.nextRange(0, 49) * 10
		}));

		that.getHead = function () {
			return segments[0];
		}

		that.getSegments = function () {
			return segments;
		}

		that.addSegements = function () {
			let lastSegX = null;
			let lastSegY = null;

			for (let i = 0; i < 3; i++) {
				if (Math.abs(dirX) > 0) {
					if (segments[segments.length - 1].x < segments[0].x) {
						lastSegX = segments[segments.length - 1].x - BLOCKSIZE;
					} else {
						lastSegX = segments[segments.length - 1].x + BLOCKSIZE;
					}
				} else {
					if (segments[segments.length - 1].y < segments[0].y) {
						lastSegX = segments[segments.length - 1].y - BLOCKSIZE;
					} else {
						lastSegX = segments[segments.length - 1].y + BLOCKSIZE;
					}
				}

				segments.push(Segment({
					fillStyle: bodyFillStyle,
					x: lastSegX,
					y: lastSegY
				}));
			}
		}

		that.update = function () {
			const head = { x: segments[0].x + dirX, y: segments[0].y + dirY };
			segments.unshift(head);
			segments.pop();
		}

		that.moveUp = function (dy) {
			if (dy < 0) { return; }
			dirY = dy;
			dirX = 0;
		}

		that.moveDown = function (dy) {
			if (dy > 0) { return; }
			dirY = dy;
			dirX = 0;
		}

		that.moveLeft = function (dx) {
			if (dx > 0) { return; }
			dirX = dx;
			dirY = 0;
		}

		that.moveRight = function (dx) {
			if (dx > 0) { return; }
			dirX = dx;
			dirY = 0;
		}

		that.draw = function () {
			for (let i = 0; i < segments.length; i++) {
				segments[i].draw();
			}
		};

		return that;
	}

	function Segment(spec) {
		that = {};
		that.x = spec.x;
		that.y = spec.y;

		that.draw = function () {
			gameContext.save();
			gameContext.fillStyle = spec.fillStyle;
			gameContext.strokestyle = 'black';
			gameContext.fillRect(x, y, BLOCKSIZE, BLOCKSIZE);
			gameContext.strokeRect(x, y, BLOCKSIZE, BLOCKSIZE);
			gameContext.restore();
		}

		return that;
	}


	return {
		drawBackground: drawBackground,
		drawScore: drawScore,
		setCountdownTextProperties: setCountdownTextProperties,
		setLargeTextProperties: setLargeTextProperties,
		drawText: drawText,
		clearTopLayer: clearTopLayer,
		clear: clear,
		BlocksIntersect: BlocksIntersect,
		intersection: intersection,
		Snake: Snake,
		Obstacles: Obstacles,
		Apple: Apple
	};

}());
