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

    window.levels = [level1, level2, level3, level4];
    window.getLevelIndex = function() {
        return currentLevelIndex;
    };
    window.getNextLevel = function() {
        currentLevelIndex = ++currentLevelIndex % levels.length;
        return levels[currentLevelIndex];
    };
    window.getCurrentLevel = function() {
        return levels[currentLevelIndex];
    }
}());
