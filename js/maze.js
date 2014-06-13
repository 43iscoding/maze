(function(){

    var width = 6;
    var height = 6;

    var action = actions.NONE;

    /**
     * Maze map.
     *
     * 0 - empty cell
     * 1 - breakable wall
     * 2 - non-breakable wall
     * 3 - exit
     * 4 - player
     *
     */
    var map = [
        2, 2, 2, 2, 2, 2,
        2, 0, 0, 0, 0, 2,
        2, 0, 4, 0, 0, 3,
        2, 0, 0, 0, 0, 2,
        2, 0, 0, 0, 0, 2,
        2, 2, 2, 2, 2, 2,
    ];

    window.init = function() {
        console.log('Game loaded!');
        gameTick();
    };

    function gameTick() {
        action = actions.NONE;
        processInput();
        if (action != actions.NONE) {
            processAction();
        }
        printMapToHTML();
        setTimeout(gameTick, 1000);
    }

    function processInput() {
        var last = input.lastPressed();
        if (last == 'UP' || last == 'W') {
            action = actions.MOVE_UP;
        } else if (last == 'DOWN' || last == 'S') {
            action = actions.MOVE_DOWN;
        } else if (last == 'RIGHT' || last == 'D') {
            action = actions.MOVE_RIGHT;
        } else if (last == 'LEFT' || last == 'A') {
            action = actions.MOVE_LEFT;
        }
        input.clearInput();
    }

    function processAction() {
        console.log("Process action: " + action);
    }

    function printMapToHTML() {
        var mapContainer = document.getElementById('mapContainer');
        mapContainer.style.width = "15px";
        mapContainer.innerHTML = "";
        for (var i = 0; i < map.length; i++) {
            mapContainer.innerHTML += map[i];
            if ((i + 1) % width == 0) {
                mapContainer.innerHTML += '\n';
            }
        }
    }
}());