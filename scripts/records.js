Game.records = (function () {
    var scores = {};
    var previousScores = localStorage.getItem('Game.scores');

    if (previousScores !== null) {
        scores = JSON.parse(previousScores);
    } else {
        for (var i = 0; i < 5; i++) {
            scores[i] = (i + 1) * 5;            
        }
        localStorage['Game.scores'] = JSON.stringify(scores);
    }

    function initialize() {
        var highScoreNode = document.getElementById('hs0');
        highScoreNode.innerHTML = scores[0];
        highScoreNode = document.getElementById('hs1');
        highScoreNode.innerHTML = scores[1];
        highScoreNode = document.getElementById('hs2');
        highScoreNode.innerHTML = scores[2];
        highScoreNode = document.getElementById('hs3');
        highScoreNode.innerHTML = scores[3];
        highScoreNode = document.getElementById('hs4');
        highScoreNode.innerHTML = scores[4];
    }       

    function update (score) {
        for (var i = 4; i >= 0; i--) {
            var test = scores[i];
            if (score > test) {
                var highScoreNode = document.getElementById('hs' + i);
                highScoreNode.innerHTML = score;
                localStorage['Game.scores'] = JSON.stringify(scores);
                return;
            }
        }
    };

    return {
        update: update,
        initialize: initialize
    };

}());
