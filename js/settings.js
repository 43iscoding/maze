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

    window.gameMode = GAME_MODE.KEYBOARD;

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
        MOVE_UP: 'UP',
        MOVE_DOWN: 'DOWN',
        MOVE_LEFT: 'LEFT',
        MOVE_RIGHT: 'RIGHT',
        HOLD: 'HOLD',
        SHOOT: 'SHOOT',
        BOMB: 'BOMB',
        JUMP: 'JUMP'
    };

    window.RESULT = {
        OK: 'OK',
        WALL: 'WALL',
        UNKNOWN_ACTION: 'UNKNOWN_ACTION',
        NO_AMMO: 'NO_AMMO',
        NO_BOMB: 'NO_BOMB',
        NO_PORTAL: 'NO_PORTAL',
        JUMP: "JUMP",
        ARSENAL: "ARSENAL",
        PICKUP_TREASURE: "PICKUP_TREASURE",
        CANT_EXIT: "CANT_EXIT"
    };


    window.MAX_AMMO = 3;
    window.MAX_BOMBS = 1;

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