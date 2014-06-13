(function(){

    var side = 6;

    var action = actions.NONE;

    var DEBUG = false;

    /**
     * Maze map.
     *
     * . - Empty cell
     * ^ - Inner wall
     * * - Outer (Non-breakable) wall
     * E - Exit
     * A - Arsenal
     * H - Hospital
     * P - Player
     * @ - Out of bounds
     */

    window.CELL = {
        EMPTY : '.',
        WALL : '^',
        OUTER_WALL : '*',
        EXIT : 'E',
        ARSENAL : 'A',
        HOSPITAL : 'H',
        PLAYER : 'P',
        OUT_OF_BOUNDS : '@'
    };

    var map =
        '******' +
        '*....*' +
        '*.P..E' +
        '*...H*' +
        '*..A.*' +
        '******';

    window.init = function() {
        console.log('Game loaded!');
        printMapToHTML();
        input.onPressed(turn);
    };


    function turn(key) {
        action = processInput(key);
        if (action == actions.NONE) return;
        var result = processAction(action);
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
        if (DEBUG) {
            console.log("Process action: " + action);
            console.log("player at index:" + getPlayer() + " {" + getXY(getPlayer()).x + ";" + getXY(getPlayer()).y + "}");
            printNeighbours(getPlayer());
        }

        switch (action) {
            case actions.MOVE_UP: {
                return processMovement(getPlayer() - side);
            }
            case actions.MOVE_DOWN: {
                return processMovement(getPlayer() + side);
            }
            case actions.MOVE_LEFT: {
                return processMovement(getPlayer() - 1);
            }
            case actions.MOVE_RIGHT: {
                return processMovement(getPlayer() + 1);
            }
            default: {
                console.log("Unknown action: " + action);
                return RESULT.UNKNOWN_ACTION;
            }
        }

        return RESULT.OK;
    }

    function processMovement(target) {
        if (DEBUG) console.log("process move: " + getPlayer() + " -> " + target);
        var targetCell = cellAt(target);
        if (targetCell == CELL.WALL || targetCell == CELL.OUTER_WALL) return RESULT.WALL;

        updateMap(getPlayer(), CELL.EMPTY);
        updateMap(target, CELL.PLAYER);

        return RESULT.OK;
    }

    function updateMap(index, value) {
        if (value < 0 || value > side * side - 1) return;

        map = map.substr(0, index) + value + map.substr(index + 1);
    }

    function printNeighbours(index) {
        console.log("Neighbours: ");
        console.log("  Up: " + cellAt(index - side));
        console.log("  Down: " + cellAt(index + side));
        console.log("  Left: " + cellAt(index - 1));
        console.log("  Right: " + cellAt(index + 1));
    }

    function getXY(index) {
        return {x: index % side, y: Math.floor(index / side)};
    }

    function getIndex(x, y) {
        return y * side + x;
    }

    function cellAt(indexOrX, y) {
        var index = (y == undefined ? indexOrX : getIndex(indexOrX, y));
        if (index < 0 || index > side * side - 1) {
            return CELL.OUT_OF_BOUNDS;
        }
        return map[index];
    }

    function getPlayer() {
        for (var i = 0; i < map.length; i++) {
            if (map[i] == CELL.PLAYER) return i;
        }
        console.log("COULD NOT FIND PLAYER!");
        return -1;
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