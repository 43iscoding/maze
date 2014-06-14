(function(){

    function loadGame() {
        initScreen();
        res.onReady(loaded);
        res.load(["mailto"]);
    }

    function initScreen() {
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        canvas.width = WIDTH * PIXEL_RATIO();
        canvas.height = (HEIGHT + PANEL_HEIGHT) * PIXEL_RATIO();
        canvas.style.width = WIDTH + 'px';
        canvas.style.height = HEIGHT + PANEL_HEIGHT + 'px';
        context.setTransform(PIXEL_RATIO(), 0, 0, PIXEL_RATIO(), 0, 0);
    }

    function loaded() {
        var context = document.getElementById('canvas').getContext('2d');
        context.font = "25px Monospace bold";
        context.textAlign = "center";
        context.fillStyle = "black";
        context.fillRect(0, 0, WIDTH, HEIGHT);
        context.fillStyle = "#77B";
        context.fillText("LOADED!", WIDTH / 2, HEIGHT / 2);
        setTimeout(proceed, 1000);
    }

    function proceed() {
        var context = document.getElementById('canvas').getContext('2d');
        context.fillStyle = "black";
        context.fillRect(0, 0, WIDTH, HEIGHT);
        init();
    }

    function updateLoading(value) {
        var context = document.getElementById('canvas').getContext('2d');
        context.font = "25px Monospace bold";
        context.textAlign = "center";
        context.fillStyle = "black";
        context.fillRect(0, 0, WIDTH, HEIGHT);
        context.fillStyle = "#77B";
        context.fillText("Loading: " + value + "%", WIDTH / 2, HEIGHT / 2);
    }

    window.loadGame = loadGame;
    window.loader = {
        update : updateLoading
    }
}());