(function(){

    var side = 6;

    var action = actions.NONE;

    var DEBUG = false;

    function Cell(index, type) {
        this.index = index;
        this.pos = getXY(index);
        this.objects = [ type ];
        if (type == CELL.PLAYER || type == CELL.TREASURE) {
            this.objects.push(CELL.EMPTY);
        }
    }

    Cell.prototype = {
        addObject : function(object) {
            this.objects.push(object);
        },
        removeObject : function(object) {
            var index = this.objects.indexOf(object);
            if (index != -1) {
                this.objects.splice(index, 1);
            }
        },
        contains: function(toFind) {
            var found = false;
            this.objects.forEach(function(object) {
                if (object == toFind) found = true;
            });
            return found;
        },
        getX : function() { return this.pos.x; },
        getY : function() { return this.pos.y; },
        getValue : function() {
            var value = { cell: CELL.UNKNOWN, priority : getPriority(CELL.UNKNOWN)};
            this.objects.forEach(function(object) {
                if (value.priority < getPriority(object)) {
                    value = { cell : object, priority : getPriority(object)};
                }
            });
            return value.cell;
        },
        toString: function() {
            return this.getValue();
        },
        constructor : Cell
    };

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
     * ~ - Bullet
     * T - Treasure
     */

    window.CELL = {
        UNKNOWN : '?',
        EMPTY : '.',
        WALL : '^',
        OUTER_WALL : '*',
        EXIT : 'E',
        ARSENAL : 'A',
        HOSPITAL : 'H',
        PLAYER : 'P',
        OUT_OF_BOUNDS : '@',
        BULLET: '~',
        TREASURE: 'T'
    };

    function getPriority(object) {
        switch (object) {
            case CELL.OUT_OF_BOUNDS: return 6;
            case CELL.PLAYER: return 5;
            case CELL.ARSENAL:
            case CELL.HOSPITAL:
            case CELL.TREASURE:
            case CELL.EXIT: return 4;
            case CELL.OUTER_WALL: return 3;
            case CELL.WALL: return 2;
            case CELL.BULLET: return 1;
            case CELL.EMPTY: return 0;
            case CELL.UNKNOWN: return -1;
        }
    }

    function createLevel(level) {
        var newMap = [];
        for (var i = 0; i < level.length; i++) {
            newMap.push(new Cell(i, level[i]));
        }
        return newMap;
    }

    var level1 =
        '******' +
        '*..T.*' +
        '*.P..E' +
        '*...H*' +
        '*..A.*' +
        '******' ;

    var map = [];

    window.init = function() {
        console.log('Game loaded!');
        restart();
        input.onPressed(turn);
    };

    function restart() {
        map = createLevel(level1);
        printMapToHTML();
    }

    function turn(key) {
        action = processInput(key);
        if (action == actions.NONE) return;
        var result = processAction(action);
        processTriggers();
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
        } else if (key == 'R') {
            restart();
            return actions.NONE;
        }

        return actions.NONE;
    }

    function processTriggers() {
        //TODO: pickup treasure

        //process exit
        //TODO: process exit only if treasure is in inventory
        if (map[getPlayer()].contains(CELL.EXIT)) {
            console.log("WE WON!");
            restart();
        }
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

        remove(getPlayer(), CELL.PLAYER);
        add(target, CELL.PLAYER);

        return RESULT.OK;
    }

    function remove(index, value) {
        map[index].removeObject(value);
    }

    function add(index, value) {
        map[index].addObject(value);
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
            if (map[i].contains(CELL.PLAYER)) return i;
        }
        console.log("COULD NOT FIND PLAYER!");
        return -1;
    }

    function printMapToHTML() {
        var mapContainer = document.getElementById('mapContainer');
        mapContainer.style.width = "15px";
        mapContainer.innerHTML = "";
        for (var i = 0; i < map.length; i++) {
            mapContainer.innerHTML += map[i].getValue();
            if ((i + 1) % side == 0) {
                mapContainer.innerHTML += '\n';
            }
        }
    }
}());