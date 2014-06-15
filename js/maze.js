(function(){

    var action = actions.NONE;

    var DEBUG = false;

    var hasTreasure = false;
    var ammo = 0;
    var bomb = 0;

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
        TREASURE: 'T',
        PORTAL: 'O'
    };

    function getPriority(object) {
        switch (object) {
            case CELL.OUT_OF_BOUNDS: return 6;
            case CELL.PLAYER: return 5;
            case CELL.BULLET: return 4;
            case CELL.ARSENAL:
            case CELL.HOSPITAL:
            case CELL.TREASURE:
            case CELL.EXIT: return 3;
            case CELL.OUTER_WALL: return 2;
            case CELL.WALL:
            case CELL.PORTAL: return 1;
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

    var map = [];

    function getMapSide() {
        return Math.sqrt(map.length);
    }

    window.init = function() {
        restart();
        input.onPressed(turn);
    };

    function restart() {
        var level = getNextLevel();
        map = createLevel(level);
        printMapToHTML();
    }

    function turn(key) {
        action = processInput(key);
        if (action == actions.NONE) return;
        var result = processAction(action);
        if (DEBUG) console.log(result);
        mazeConsole.print(result);
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
        } else if (key == 'SPACE') {
            return actions.SHOOT;
        } else if (key == 'B') {
            return actions.BOMB;
        } else if (key == 'J') {
            return actions.JUMP;
        } else if (key == 'H') {
            return actions.HOLD;
        }

        return actions.NONE;
    }

    function processTriggers() {
        //TODO: pickup treasure

        //process exit
        //TODO: process exit only if treasure is in inventory
        if (map[getPlayer()].contains(CELL.EXIT)) {
            restart();
        }
    }

    function processAction() {
        if (DEBUG) {
            console.log("Process action: " + action);
        }

        switch (action) {
            case actions.MOVE_UP: {
                return processMovement(getPlayer() - getMapSide());
            }
            case actions.MOVE_DOWN: {
                return processMovement(getPlayer() + getMapSide());
            }
            case actions.MOVE_LEFT: {
                return processMovement(getPlayer() - 1);
            }
            case actions.MOVE_RIGHT: {
                return processMovement(getPlayer() + 1);
            }
            case actions.HOLD: {
                return RESULT.OK;
            }
            case actions.SHOOT: {
                return RESULT.NO_AMMO;
            }
            case actions.BOMB: {
                return RESULT.NO_BOMB;
            }
            case actions.JUMP: {
                return processJump();
            }
            default: {
                console.log("Unknown action: " + action);
                return RESULT.UNKNOWN_ACTION;
            }
        }

        return RESULT.OK;
    }

    function processJump() {
        if (map[getPlayer()].contains(CELL.PORTAL)) {
            var target = getDestinationPortal(getPlayer());
            if (target != -1) {
                remove(getPlayer(), CELL.PLAYER);
                add(target, CELL.PLAYER);
                return RESULT.JUMP;
            } else {
                return RESULT.NO_PORTAL;
            }

        }
        return RESULT.NO_PORTAL;
    }

    function getDestinationPortal(current) {
        var candidates = [];
        for (var i = 0; i < map.length; i++) {
            if (map[i].contains(CELL.PORTAL) && i != current) {
                candidates.push(i);
            }
        }

        if (candidates.length > 0) {
            return candidates[Math.round(Math.random() * (candidates.length - 1))];
        }

        var pos = getXY(current);
        console.log("Could not find destination portal for (" + pos.x + "," + pos.y + "). Level index: " + getLevelIndex());
        return -1;
    }

    function processMovement(target) {
        if (DEBUG) console.log("process move: " + getPlayer() + " -> " + target);
        var targetCell = cellAt(target);
        if (targetCell.contains(CELL.WALL) || targetCell.contains(CELL.OUTER_WALL)) return RESULT.WALL;

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

    function printNeighbours(index) {
        console.log("Neighbours: ");
        console.log("  Up: " + cellAt(index - getMapSide()));
        console.log("  Down: " + cellAt(index + getMapSide()));
        console.log("  Left: " + cellAt(index - 1));
        console.log("  Right: " + cellAt(index + 1));
    }

    function getXY(index) {
        return {x: index % getMapSide(), y: Math.floor(index / getMapSide())};
    }

    function getIndex(x, y) {
        return y * getMapSide() + x;
    }

    function cellAt(indexOrX, y) {
        var index = (y == undefined ? indexOrX : getIndex(indexOrX, y));
        if (index < 0 || index > getMapSide() * getMapSide() - 1) {
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
        var mapDiv = document.getElementById('mapDiv');
        mapDiv.style.width = "15px";
        mapDiv.innerHTML = "";
        for (var i = 0; i < map.length; i++) {
            mapDiv.innerHTML += map[i].getValue();
            if ((i + 1) % getMapSide() == 0) {
                mapDiv.innerHTML += '\n';
            }
        }
    }


}());