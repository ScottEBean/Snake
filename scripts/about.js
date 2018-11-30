Game.screens['about'] = (function (menu) {

	function initialize() {
		document.getElementById('id-about-back').addEventListener(
			'click',
			function () { menu.showScreen('main-menu'); });
	}

	function run() {
		// I know this is empty, there isn't anything to do.
	}

	return {
		initialize: initialize,
		run: run
	};
}(Game.menu));
