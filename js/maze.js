(function(){

    var side = 6;

    var action = actions.NONE;

    /**
     * Maze map.
     *
     * . - empty cell
     * 1 - breakable wall
     * * - non-breakable wall
     * E - exit
     * P - player
     *
     */

    var map =
        '******' +
        '*....*' +
        '*.P..E' +
        '*....*' +
        '*....*' +
        '******';

    window.init = function() {
        console.log('Game loaded!');
        printMapToHTML();
        input.onPressed(turn);
    };


    function turn(key) {
        action = processInput(key);
        if (action == actions.NONE) return;
        processAction(action);
        printMapToHTML();
    }

    function processInput(key) {
        if (key == 'UP' || key == 'W') {
            return actions.MOVE_UP;
        } else if (key == 'DOWN' || key == 'S') {
            return actions.MOVE_DOWN;
        } else if (key == 'RIGHT' || key == 'D') {
            return actions.MOVE_RIGHT;
        } else if (key == 'LEFT' || key == 'A') {
            return actions.MOVE_LEFT;
        }

        return actions.NONE;
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
            if ((i + 1) % side == 0) {
                mapContainer.innerHTML += '\n';
            }
        }
    }
}());