(function(){

    var currentLevelIndex = 0;

    var level1 =
        '****' +
        '*PT*' +
        '*..E' +
        '****' ;

    var level2 =
        '******' +
        '*O.T.*' +
        '*.P..E' +
        '*...H*' +
        '*O.A.*' +
        '******' ;

    var level3 =
        '*E******' +
        '*.^T..O*' +
        '*.^.^..*' +
        '*.^.^^.*' +
        '*O.P^H.*' +
        '*.^^^^^*' +
        '*....AO*' +
        '********' ;

    var level4 =
        '***E****' +
        '*.^....*' +
        '*...^^P*' +
        '*.^^^H.*' +
        '*..A^^.*' +
        '*.^^...*' +
        '*O^T.^O*' +
        '********' ;

    var arena1 =
        '****' +
        '*P.E' +
        '*TP*' +
        '****' ;

    var arena2 =
        '*******' +
        '*....O*' +
        '*.P.***' +
        '*.**OTE' +
        '*.P.***' +
        '*....O*' +
        '*******' ;

    var arena3 =
        '*****E****' +
        '*P..O...P*' +
        '*..*.A*..*' +
        '*.**.***.*' +
        'E.A*.T..O*' +
        '*O..H.*A.E' +
        '*.***.**.*' +
        '*..*A.*..*' +
        '*P...O..P*' +
        '****E*****' ;


    window.levels = [level1, level2, level3, level4];
    window.arenas = [arena1, arena2, arena3];

    window.MULTIPLAYER = false;

    window.getLevelIndex = function() {
        return currentLevelIndex;
    };
    window.getLevelName = function() {
        return MULTIPLAYER ? "arena" + getLevelIndex() : "level" + getLevelIndex();
    };
    window.getNextLevel = function() {
        currentLevelIndex = ++currentLevelIndex % getLevels().length;
        return getLevels()[currentLevelIndex];
    };
    window.getCurrentLevel = function() {
        return getLevels()[currentLevelIndex];
    };

    function getLevels() {
        return MULTIPLAYER ? arenas : levels;
    }
}());
