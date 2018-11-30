Game.screens['help'] = (function (menu) {

	function initialize() {
		document.getElementById('id-help-back').addEventListener(
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
