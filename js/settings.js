(function() {
    //ui settings
    window.fps = 60;
    window.WIDTH = 320;
    window.HEIGHT = 240;

    window.GAME_MODE = {
        TEXT: 'TEXT',
        KEYBOARD: 'KEYBOARD',
        MOUSE: 'MOUSE'
    };

    var gameMode = GAME_MODE.KEYBOARD;
    window.getMode = function() {
        return gameMode;
    };
    window.setMode = function(mode) {
        gameMode = mode;
    };

    window.cookie = {
        MUTED : "muted",
        HIGHSCORE : "highscore"
    };

    window.muted = {
        NONE : "mute_none",
        MUSIC : "mute_music",
        ALL : "mute_all"
    };

    window.actions = {
        NONE: 'NONE',
        CANCEL: 'CANCEL',
        MOVE_UP: 'UP',
        MOVE_DOWN: 'DOWN',
        MOVE_LEFT: 'LEFT',
        MOVE_RIGHT: 'RIGHT',
        HOLD: 'HOLD',
        SHOOT: 'SHOOT',
            SHOOT_MODIFIER: 'SHOOT_MOD',
            SHOOT_UP: 'SHOOT_UP',
            SHOOT_DOWN: 'SHOOT_DOWN',
            SHOOT_LEFT: 'SHOOT_LEFT',
            SHOOT_RIGHT: 'SHOOT_RIGHT',
        BOMB: 'BOMB',
            BOMB_MODIFIER: 'BOMB_MOD',
            BOMB_UP: 'BOMB_UP',
            BOMB_DOWN: 'BOMB_DOWN',
            BOMB_LEFT: 'BOMB_LEFT',
            BOMB_RIGHT: 'BOMB_RIGHT',
        JUMP: 'JUMP',
        SET_MODE_KEYBOARD: 'SET_MODE_KEYBOARD',
        SET_MODE_TEXT: 'SET_MODE_TEXT'
    };

    window.DIRECTION = {
        UP: 'UP',
        DOWN: 'DOWN',
        LEFT: 'LEFT',
        RIGHT: 'RIGHT'
    };

    window.RESULT = {
        OK: 'OK',
        WALL: 'WALL',
        UNKNOWN_ACTION: 'UNKNOWN_ACTION',
        NO_AMMO: 'NO_AMMO',
        NO_BOMB: 'NO_BOMB',
        BOMB_SUCCESS: "BOMB_SUCCESS",
        BOMB_NO_WALL: "BOMB_NO_WALL",
        SHOOT_SUCCESS: "SHOOT_SUCCESS",
        SHOOT_ELIMINATED: "SHOOT_ELIMINATED",
        SHOOT_WALL: "SHOOT_WALL",
        NO_PORTAL: 'NO_PORTAL',
        JUMP: "JUMP",
        ARSENAL: "ARSENAL",
        HOSPITAL: "HOSPITAL",
        PICKUP_TREASURE: "PICKUP_TREASURE",
        EXIT: "EXIT",
        CANT_EXIT: "CANT_EXIT",
        SHOOT_MODIFIER: "SHOOT_MODIFIER",
        BOMB_MODIFIER: "BOMB_MODIFIER",
        FELL_INTO_SWAMP: "FELL_INTO_SWAMP",
        STUCK_IN_SWAMP: "STUCK_IN_SWAMP",
        EMPTY: "EMPTY",
        MODE_KEYBOARD: "MODE_KEYBOARD",
        MODE_TEXT: "MODE_TEXT"
    };


    window.MAX_AMMO = 3;
    window.MAX_BOMBS = 1;

    window.PLAYERS_COLORS = ['#279C38', '#AD3832', '#BFBA71', '#657B8A', '#C75FC5', '#E38340'];
    window.DEFAULT_COLOR = '#77B';

    window.PIXEL_RATIO = function () {
        var ctx = document.getElementById("canvas").getContext("2d"),
            dpr = window.devicePixelRatio || 1,
            bsr = ctx.webkitBackingStorePixelRatio ||
                ctx.mozBackingStorePixelRatio ||
                ctx.msBackingStorePixelRatio ||
                ctx.oBackingStorePixelRatio ||
                ctx.backingStorePixelRatio || 1;
        return dpr / bsr;
    };

}());