// ------------------------------------------------------------------
// This is the graphics object.  The letious rendering components
// are located here.
// ------------------------------------------------------------------
Game.graphics = (function () {

	let backgroundCanvas = document.getElementById('backgroundCanvas');
	let backgroundContext = backgroundCanvas.getContext('2d');
	let gameCanvas = document.getElementById('gameCanvas');
	let gameContext = gameCanvas.getContext('2d');
	let topLayerCanvas = document.getElementById('topLayerCanvas');
	let topLayerContext = topLayerCanvas.getContext('2d');
	let snakeFillStyle = 'rgba(0, 255, 0, 1)'; // Very Green
	let obstacleFillStyle = 'rgba(0, 208, 208, 1)'; // Cyan
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

	function drawApple(row, col) {
		drawBlock({ x: col * BLOCKSIZE, y: row * BLOCKSIZE, fillStyle: appleFillStyle });
	}	

	function drawBackground() {

	}

	function drawBlock(spec) {
		gameContext.save();
		gameContext.fillStyle = spec.fillStyle;
		gameContext.strokestyle = 'black';
		gameContext.fillRect(spec.x, spec.y, BLOCKSIZE, BLOCKSIZE);
		gameContext.strokeRect(spec.x, spec.y, BLOCKSIZE, BLOCKSIZE);
		gameContext.restore();
	}

	function drawObstacle(row, col) {
		drawBlock({ x: col * BLOCKSIZE, y: row * BLOCKSIZE, fillStyle: obstacleFillStyle });
	}

	function drawScore(score) {
		setScoreTextProps();
		let scoreText = 'Score: ' + score;
		let textWidth = gameContext.measureText(scoreText).width + 10;
		gameContext.fillText(scoreText, gameCanvas.width - textWidth, gameCanvas.height - 10);
	}	

	function drawSnakeSegment(row, col) {
		drawBlock({ x: col * BLOCKSIZE, y: row * BLOCKSIZE, fillStyle: snakeFillStyle });
	}

	function drawText(text, x, y) {
		topLayerContext.fillText(text, x, y);

		// This was used to set the correct x coordinate for text.
		// For no conceivable reason text is drawn from the x: left y: bottom
		// or x: left y:middle of the character/string
		//console.log(topContext.measureText(text));
	}

	function setCountdownTextProperties() {
		topLayerContext.font = '45px Roboto';
		topLayerContext.fillStyle = "rgba(0, 0, 0, 0.25)";
		topLayerContext.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
		topLayerContext.fillStyle = '#00d0d0';
	}

	function setLargeTextProperties() {
		topLayerContext.font = '125px Roboto';
		topLayerContext.fillStyle = "rgba(0, 0, 0, 0.25)";
		topLayerContext.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
		topLayerContext.fillStyle = '#00d0d0';
	}

	function setScoreTextProps() {
		gameContext.font = '15px Roboto';
		gameContext.fillStyle = '#00d0d0';
	}	

	return {
		clear: clear,
		clearTopLayer: clearTopLayer,
		drawApple: drawApple,
		drawBackground: drawBackground,		
		drawObstacle: drawObstacle,
		drawScore: drawScore,
		drawSnakeSegment: drawSnakeSegment,	
		drawText: drawText,	
		setCountdownTextProperties: setCountdownTextProperties,
		setLargeTextProperties: setLargeTextProperties,		
		setScoreTextProps: setScoreTextProps
	};

}());
