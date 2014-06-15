(function() {

    var language = 'en';

    function initDictionary() {
        var dict = {};
        dict[RESULT.OK] = {
            en: ["You managed to do that", "Success", "Operation successful"]
        };
        dict[RESULT.NO_AMMO] = {
            en: ["You have no ammo", "No ammo: Cannot shoot"]
        };
        dict[RESULT.NO_BOMB] = {
            en: ["You have no bombs", "No bombs found in your inventory"]
        };
        dict[RESULT.WALL] = {
            en: ["You encountered... a wall", "There's a wall in your way"]
        };
        dict[RESULT.NO_PORTAL] = {
            en: ["There is no portal here", "Error 404: Portal not found"]
        };
        dict[RESULT.JUMP] = {
            en: ["You have jumped through the portal", "You have been teleported"]
        };
        dict[RESULT.UNKNOWN_ACTION] = {
            en: ["Unknown action: What are you trying to do?", "Unknown action - You should not see this message"]
        };
        return dict;
    }

    var dictionary = initDictionary();

    window.mazeConsole = {
        print : print
    };

    function print(key) {
        var consoleDiv = document.getElementById('consoleDiv');
        consoleDiv.innerHTML = get(key);
    }

    function get(key) {
        if (dictionary[key] == undefined) {
            console.log("Warning! No dictionary entry for key: " + key);
            return "";
        }
        var responses = dictionary[key][language];
        if (responses == undefined) {
            console.log("Warning! No translation found for (key: " + key + ", lang: " + language + ")");
            return "";
        }
        return responses[Math.round(Math.random() * (responses.length - 1))];
    }
}());