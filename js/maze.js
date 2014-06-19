(function(){
    var action = actions.NONE;

    var DEBUG = false;

    function Player(id, index) {
        this._id = id;
        this._index = index;
        this.ammo = MAX_AMMO;
        this.bombs = MAX_BOMBS;
        this.treasure = false;
    }

    Player.prototype = {
        get index() {
            return this._index;
        },
        set index(index) {
            this._index = index;
        },
        get id() {
            return this._id;
        },
        hasAmmo : function() {
            return this.ammo > 0;
        },
        decreaseAmmo : function() {
            this.ammo--;
        },
        hasBomb : function() {
            return this.bombs > 0;
        },
        decreaseBombs : function() {
            this.bombs--;
        },
        hasTreasure : function() {
            return this.treasure;
        },
        pickUpTreasure : function() {
            this.treasure = true;
        },
        replenishAmmo : function() {
            this.ammo = MAX_AMMO;
            this.bombs = MAX_BOMBS;
        }
    };

    function Cell(index, type) {
        this.index = index;
        this.players = [];
        this.objects = [ type ];
        if (type == OBJECT.PLAYER || type == OBJECT.TREASURE) {
            this.objects.push(OBJECT.EMPTY);
        }
    }

    Cell.prototype = {
        addObject : function(object) {
            if (typeof object == "string") {
                this.objects.push(object);
            } else {
                this.players.push(object);
            }
        },
        removeObject : function(object) {
            if (typeof object == "string") {
                var index = this.objects.indexOf(object);
                if (index != -1) {
                    this.objects.splice(index, 1);
                }
            } else {
                this.players.splice(this.players.indexOf(object), 1);
            }
        },
        contains: function(toFind) {
            if (toFind == OBJECT.PLAYER) {
                return this.players.length > 0;
            }
            var found = false;
            this.objects.forEach(function(object) {
                if (object == toFind) found = true;
            });
            return found;
        },
        getPlayer : function(id) {
            for (var i = 0; i < this.players.length; i++) {
                if (this.players[i].id == id) return this.players[i];
            }
        },
        getValue : function() {
            if (this.players.length > 0) return OBJECT.PLAYER;
            var value = { cell: OBJECT.UNKNOWN, priority : getPriority(OBJECT.UNKNOWN)};
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

    window.OBJECT = {
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
            case OBJECT.OUT_OF_BOUNDS: return 6;
            case OBJECT.PLAYER: return 5;
            case OBJECT.BULLET: return 4;
            case OBJECT.ARSENAL:
            case OBJECT.HOSPITAL:
            case OBJECT.TREASURE:
            case OBJECT.EXIT: return 3;
            case OBJECT.OUTER_WALL: return 2;
            case OBJECT.WALL:
            case OBJECT.PORTAL: return 1;
            case OBJECT.EMPTY: return 0;
            case OBJECT.UNKNOWN: return -1;
        }
    }

    function createLevel(level) {
        map = [];
        players = [];
        currentPlayer = 0;
        for (var i = 0; i < level.length; i++) {
            if (level[i] == OBJECT.PLAYER) {
                var player = new Player(currentPlayer++, i);
                players.push(player);
                var cell = new Cell(i, OBJECT.EMPTY);
                cell.addObject(player);
                map.push(cell);
            } else {
                map.push(new Cell(i, level[i]));
            }
        }
        currentPlayer = 0;
        return map;
    }

    var map = [];
    var players = [];

    var currentPlayer = 0;

    function getMapSide() {
        return Math.sqrt(map.length);
    }

    window.init = function() {
        restart();
        input.onPressed(turn);
    };

    function proceedToNextLevel() {
        startLevel(getNextLevel());
    }

    function restart() {
        startLevel(getCurrentLevel());
    }

    function startLevel(level) {
        map = createLevel(level);
        printMapToHTML();
    }

    function turn(key) {
        action = processInput(key);
        if (action == actions.NONE) return;
        var result = processAction(action);
        if (DEBUG) console.log(result);
        mazeConsole.print(result);
        printMapToHTML();
        currentPlayer = currentPlayer == players.length - 1 ? 0 : currentPlayer + 1;
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

    function checkCell(){
        if (map[getPlayerIndex()].contains(OBJECT.ARSENAL)){
            getPlayer().replenishAmmo();
            return RESULT.ARSENAL;
        }

        if (map[getPlayerIndex()].contains(OBJECT.TREASURE)) {
            getPlayer().pickUpTreasure();
            remove(getPlayerIndex(), OBJECT.TREASURE);
            return RESULT.PICKUP_TREASURE;
        }

        if (map[getPlayerIndex()].contains(OBJECT.EXIT)) {
            proceedToNextLevel();
        }

        return RESULT.OK;
    }

    function processAction() {
        if (DEBUG) {
            console.log("Process action: " + action);
        }

        switch (action) {
            case actions.MOVE_UP: {
                return processMovement(getPlayerIndex() - getMapSide());
            }
            case actions.MOVE_DOWN: {
                return processMovement(getPlayerIndex() + getMapSide());
            }
            case actions.MOVE_LEFT: {
                return processMovement(getPlayerIndex() - 1);
            }
            case actions.MOVE_RIGHT: {
                return processMovement(getPlayerIndex() + 1);
            }
            case actions.HOLD: {
                return RESULT.OK;
            }
            case actions.SHOOT: {
                if (getPlayer().hasAmmo()){
                    getPlayer().decreaseAmmo();
                    return RESULT.OK;
                }
                else {
                    return RESULT.NO_AMMO;
                }
            }
            case actions.BOMB: {
                if (getPlayer().hasBomb()){
                    getPlayer().decreaseBombs();
                    return RESULT.OK;
                }
                else {
                    return RESULT.NO_BOMB;
                }
            }
            case actions.JUMP: {
                return processJump();
            }
            default: {
                console.log("Unknown action: " + action);
                return RESULT.UNKNOWN_ACTION;
            }
        }
    }

    function processJump() {
        if (map[getPlayerIndex()].contains(OBJECT.PORTAL)) {
            var target = getDestinationPortal(getPlayerIndex());
            if (target != -1) {
                movePlayer(getPlayer(), target);
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
            if (map[i].contains(OBJECT.PORTAL) && i != current) {
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
        if (DEBUG) console.log("process move: " + getPlayerIndex() + " -> " + target);
        var targetCell = cellAt(target);
        if (!getPlayer().hasTreasure() && targetCell.contains(OBJECT.EXIT)) return RESULT.CANT_EXIT;
        if (targetCell.contains(OBJECT.WALL) || targetCell.contains(OBJECT.OUTER_WALL)) return RESULT.WALL;

        movePlayer(getPlayer(), target);

        return checkCell();
    }

    function remove(index, value) {
        map[index].removeObject(value);
    }

    function add(index, value) {
        map[index].addObject(value);
    }

    function movePlayer(player, to) {
        remove(getPlayerIndex(), player);
        add(to, player);
        player.index = to;
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
            return OBJECT.OUT_OF_BOUNDS;
        }
        return map[index];
    }

    function getPlayerIndex() {
        return getPlayer().index;
    }

    function getPlayer() {
        return players[currentPlayer];
    }

    function printMapToHTML() {
        var mapDiv = document.getElementById('mapDiv');
        mapDiv.style.width = "15px";
        if (players.length > 1) {
            mapDiv.style.color = PLAYERS_COLORS[currentPlayer];
        } else {
            mapDiv.style.color = DEFAULT_COLOR;
        }
        mapDiv.innerHTML = "";
        for (var i = 0; i < map.length; i++) {
            mapDiv.innerHTML += map[i].getValue();
            if ((i + 1) % getMapSide() == 0) {
                mapDiv.innerHTML += '\n';
            }
        }
    }


}());