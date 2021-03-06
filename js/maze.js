(function(){
    var action = actions.NONE;

    var DEBUG = false;

    function Player(id, index) {
        this._id = id;
        this._index = index;
        this.ammo = MAX_AMMO;
        this.bombs = MAX_BOMBS;
        this.treasure = false;
        this.swamp = false;
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
        stuckInSwamp : function() {
            return this.swamp;
        },
        fellIntoSwamp : function(){
            this.swamp = true;
        },
        outOfTheSwamp : function(){
            this.swamp = false;
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
        if (type == OBJECT.PLAYER || type == OBJECT.TREASURE || type == OBJECT.WALL) {
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
        listPlayers : function() {
            return this.players;
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
     * S - Swamp
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
        PORTAL: 'O',
        SWAMP: 'S'
    };

    function getPriority(object) {
        switch (object) {
            case OBJECT.OUT_OF_BOUNDS: return 6;
            case OBJECT.PLAYER: return 5;
            case OBJECT.BULLET: return 4;
            case OBJECT.ARSENAL:
            case OBJECT.HOSPITAL:
            case OBJECT.TREASURE:
            case OBJECT.SWAMP:
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
    window.processCommand = processCommand;
    window.getColor = function() {
        if (players.length > 1) {
            return PLAYERS_COLORS[currentPlayer];
        } else {
            return DEFAULT_COLOR;
        }
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
        printInventoryToHTML();
    }

    var modifier = null;

    function turn(key) {
        switch (getMode()) {
            case GAME_MODE.KEYBOARD: return processKeyboard(key);
            case GAME_MODE.TEXT: return mazeConsole.input(key);
            case GAME_MODE.MOUSE: console.log("Mouse mode not supported yet"); break;
            default: console.log("Unknown game mode: " + getMode());
        }
    }

    function processKeyboard(key) {
        action = processInput(key);
        if (action == actions.NONE) return;
        var result = processAction(action);
        if (DEBUG) console.log(result);
        if (modifier == null) {
            currentPlayer = currentPlayer < players.length - 1 ? currentPlayer + 1 : 0;
        }
        mazeConsole.print(result);
        printMapToHTML();
        printInventoryToHTML();
    }

    function processCommand(command) {
        var result = processAction(command);
        if (DEBUG) console.log(result);
        if (modifier == null) {
            currentPlayer = currentPlayer < players.length - 1 ? currentPlayer + 1 : 0;
        }
        mazeConsole.print(result);
        printMapToHTML();
        printInventoryToHTML();
    }

    function processInput(key) {
        if (modifier != null) {
            var modifiedAction = actions.CANCEL;
            if (key == 'UP' || key == 'W') {
                modifiedAction = modifier + actions.MOVE_UP;
            } else if (key == 'DOWN' || key == 'S') {
                modifiedAction = modifier + actions.MOVE_DOWN;
            } else if (key == 'RIGHT' || key == 'D') {
                modifiedAction = modifier + actions.MOVE_RIGHT;
            } else if (key == 'LEFT' || key == 'A') {
                modifiedAction = modifier + actions.MOVE_LEFT;
            }
            modifier = null;
            return modifiedAction;
        }
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
            return actions.SHOOT_MODIFIER;
        } else if (key == 'B') {
            return actions.BOMB_MODIFIER;
        } else if (key == 'J') {
            return actions.JUMP;
        } else if (key == 'H') {
            return actions.HOLD;
/*        } else if (key == 'F1') {
            return actions.SET_MODE_KEYBOARD;*/
        } else if (key == 'F2') {
            return actions.SET_MODE_TEXT;
        }


        return actions.NONE;
    }

    function checkCell(){
        if (map[getPlayerIndex()].contains(OBJECT.SWAMP)) {
            getPlayer().fellIntoSwamp();
            return RESULT.FELL_INTO_SWAMP;
        }

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
            return RESULT.EXIT;
        }

        if (map[getPlayerIndex()].contains(OBJECT.HOSPITAL)) {
            // HP restoration
            return RESULT.HOSPITAL;
        }

        return RESULT.EMPTY;
    }

    function processShoot(direction) {
        if (!getPlayer().hasAmmo()){
            return RESULT.NO_AMMO;
        }

        getPlayer().decreaseAmmo();
        var next = getNeighbour(getPlayerIndex(), direction);
        while (!map[next].contains(OBJECT.WALL)
            && !map[next].contains(OBJECT.OUTER_WALL)
            && !map[next].contains(OBJECT.PLAYER)) {
            next = getNeighbour(next, direction);
        }
        if (map[next].contains(OBJECT.PLAYER)) {
            var eliminated = false;
            map[next].listPlayers().forEach(function(player) {
                if (getHospitalIndex() != -1) {
                    movePlayer(player, getHospitalIndex());
                } else {
                    //remove player completely
                    remove(player.index, player);
                    players.splice(players.indexOf(player), 1);
                    eliminated = true;
                }
            });
            return eliminated ? RESULT.SHOOT_ELIMINATED : RESULT.SHOOT_SUCCESS;
        } else {
            return RESULT.SHOOT_WALL;
        }
    }

    function processBomb(direction) {
        if (!getPlayer().hasBomb()){
            return RESULT.NO_BOMB;
        }
        getPlayer().decreaseBombs();
        var target = getNeighbour(getPlayerIndex(), direction);
        if (map[target].contains(OBJECT.WALL)) {
            remove(target, OBJECT.WALL);
            return RESULT.BOMB_SUCCESS;
        }
        return RESULT.BOMB_NO_WALL;
    }

    function getNeighbour(index, direction) {
        switch (direction) {
            case DIRECTION.UP: return index - getMapSide();
            case DIRECTION.DOWN: return index + getMapSide();
            case DIRECTION.LEFT: return index - 1;
            case DIRECTION.RIGHT: return index + 1;
            default: {
                console.log("Unknown direction: " + direction);
            }
        }
    }

    function processAction(action) {
        if (DEBUG) {
            console.log("Process action: " + action);
        }

        switch (action) {
            case actions.CANCEL: {
                return RESULT.CANCEL;
            }
            case actions.MOVE_UP: {
                return processMovement(DIRECTION.UP);
            }
            case actions.MOVE_DOWN: {
                return processMovement(DIRECTION.DOWN);
            }
            case actions.MOVE_LEFT: {
                return processMovement(DIRECTION.LEFT);
            }
            case actions.MOVE_RIGHT: {
                return processMovement(DIRECTION.RIGHT);
            }
            case actions.HOLD: {
                return RESULT.OK;
            }
            case actions.SHOOT_MODIFIER: {
                modifier = actions.SHOOT + "_";
                return RESULT.SHOOT_MODIFIER;
            }
            case actions.BOMB_MODIFIER: {
                modifier = actions.BOMB + "_";
                return RESULT.BOMB_MODIFIER;
            }
            case actions.SHOOT_UP: return processShoot(DIRECTION.UP);
            case actions.SHOOT_DOWN: return processShoot(DIRECTION.DOWN);
            case actions.SHOOT_LEFT: return processShoot(DIRECTION.LEFT);
            case actions.SHOOT_RIGHT: return processShoot(DIRECTION.RIGHT);
            case actions.SHOOT: {
                console.log("actions.SHOOT no longer supported");
                return RESULT.UNKNOWN_ACTION;
            }

            case actions.BOMB_UP: return processBomb(DIRECTION.UP);
            case actions.BOMB_DOWN: return processBomb(DIRECTION.DOWN);
            case actions.BOMB_LEFT: return processBomb(DIRECTION.LEFT);
            case actions.BOMB_RIGHT: return processBomb(DIRECTION.RIGHT);
            case actions.BOMB: {
                console.log("actions.BOMB no longer supported");
                return RESULT.UNKNOWN_ACTION;
            }

            case actions.JUMP: {
                return processJump();
            }
            case actions.SET_MODE_KEYBOARD: {
                setMode(GAME_MODE.KEYBOARD);
                return RESULT.MODE_KEYBOARD;
            }
            case actions.SET_MODE_TEXT: {
                setMode(GAME_MODE.TEXT);
                return RESULT.MODE_TEXT;
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
        console.log("Could not find destination portal for (" + pos.x + "," + pos.y + ") in " + getLevelName());
        return -1;
    }

    function processMovement(direction) {
        if (getPlayer().stuckInSwamp()) {
            getPlayer().outOfTheSwamp();
            return RESULT.STUCK_IN_SWAMP;
        }
        var target = getNeighbour(getPlayerIndex(), direction);
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
        remove(player.index, player);
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

    function getHospitalIndex() {
        //If there is no hospital in map, killed player will be eliminated
        for (var i = 0; i < map.length; i++) {
            if (map[i].contains(OBJECT.HOSPITAL)) return i;
        }
        return -1;
    }

    function printMapToHTML() {
        var mapDiv = document.getElementById('mapDiv');
        mapDiv.style.width = "0";
        mapDiv.style.color = getColor();
        mapDiv.innerHTML = "";
        for (var i = 0; i < map.length; i++) {
            mapDiv.innerHTML += map[i].getValue();
            if ((i + 1) % getMapSide() == 0) {
                mapDiv.innerHTML += '\n';
            }
        }
    }

    function printInventoryToHTML() {
        var inventoryDiv = document.getElementById ('inventoryDiv');
        inventoryDiv.style.width = "0";
        inventoryDiv.style.color = getColor();
        inventoryDiv.innerHTML = '</p>';
        inventoryDiv.innerHTML += "Ammo:" + getPlayer().ammo + "\n";
        inventoryDiv.innerHTML += "Bomb:" + getPlayer().bombs + "\n";
        if (getPlayer().hasTreasure()) {
            inventoryDiv.innerHTML += "Treasure";
        }
    }


}());