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
        dict[RESULT.ARSENAL] = {
            en: ["Your ammo was replenished"]
        };
        dict[RESULT.PICKUP_TREASURE] = {
            en: ["You have found a treasure!"]
        }
        dict [RESULT.CANT_EXIT] = {
            en: ["You can`t exit maze without treasure"]
        }
        dict[RESULT.UNKNOWN_ACTION] = {
            en: ["Unknown action: What are you trying to do?", "Unknown action - You should not see this message"]
        };
        return dict;
    }

    var dictionary = initDictionary();

    window.mazeConsole = {
        print : print,
        input : processInput
    };

    function processInput(key) {
        var consoleInput = document.getElementById("consoleInput");
        if (key == 'BACKSPACE') {
            consoleInput.innerHTML = consoleInput.innerHTML.substring(0, consoleInput.innerHTML.length - 1);
        } else if (key == 'ENTER') {
            processCommand(consoleInput.innerHTML);
            consoleInput.innerHTML = '';
        } else if (input.isAlphaNumeric(key)) {
            consoleInput.innerHTML += key;
        } else if (key == 'SPACE') {
            consoleInput.innerHTML += ' ';
        }
    }

    function print(key) {
        var output = document.getElementById('consoleOutput');
        output.innerHTML = get(key);
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