(function(){

    var width = 6;
    var height = 6;

    /**
     * Maze map.
     *
     * 0 - empty cell
     * 1 - breakable wall
     * 2 - non-breakable wall
     * 3 - exit
     * 4 - player
     *
     */
    var map = [
        2, 2, 2, 2, 2, 2,
        2, 0, 0, 0, 0, 2,
        2, 0, 4, 0, 0, 3,
        2, 0, 0, 0, 0, 2,
        2, 0, 0, 0, 0, 2,
        2, 2, 2, 2, 2, 2,
    ];

    window.init = function() {
        console.log('Game loaded!');
        printMapToHTML();
    };


    function printMapToHTML() {
        var mapContainer = document.getElementById('mapContainer');
        mapContainer.style.width = "15px";
        mapContainer.innerHTML = "";
        for (var i = 0; i < map.length; i++) {
            mapContainer.innerHTML += map[i];
            if ((i + 1) % width == 0) {
                mapContainer.innerHTML += '\n';
            }
        }
    }
}());