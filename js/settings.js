(function() {
    //ui settings
    window.fps = 60;
    window.WIDTH = 320;
    window.HEIGHT = 200;
    window.PANEL_HEIGHT = 40;

    window.cookie = {
        MUTED : "muted",
        HIGHSCORE : "highscore"
    };

    window.muted = {
        NONE : "mute_none",
        MUSIC : "mute_music",
        ALL : "mute_all"
    };

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