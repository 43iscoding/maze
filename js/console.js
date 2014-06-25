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
        };
        dict[RESULT.CANT_EXIT] = {
            en: ["You can`t exit maze without treasure"]
        };
        dict[RESULT.UNKNOWN_ACTION] = {
            en: ["What are you trying to do?", "Unknown action"]
        };
        dict[RESULT.SHOOT_MODIFIER] = {
            en: ["Choose direction where to shoot!", "So where do we shoot at?"]
        };
        dict[RESULT.BOMB_MODIFIER] = {
            en: ["Throw a bomb.. where?", "Throwing a bomb to.. ?"]
        };
        dict[RESULT.CANCEL] = {
            en: ["Action cancelled.", "Ok, let's not do that", "No? As you wish"]
        };
        dict[RESULT.BOMB_NO_WALL] = {
            en: ["You destroyed nothing.", "Wow, what a waste.", "You did not blew any walls"]
        };
        dict[RESULT.BOMB_SUCCESS] = {
            en: ["You have destroyed a wall.", "Wall has been demolished.", "Boom! Poor wall..."]
        };
        dict[RESULT.SHOOT_SUCCESS] = {
            en: ["You have killed an opponent.", "Headshot!", "Bingo! You killed someone"]
        };
        dict[RESULT.SHOOT_ELIMINATED] = {
            en: ["A player has been eliminated.", "Ouch! Someone will NOT respawn now"]
        };
        dict[RESULT.SHOOT_WALL] = {
            en: ["Bullet hit no one...", "Miss", "Right... in the wall"]
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

    var typeWriter;

    function print(key) {
        var output = document.getElementById('consoleOutput');
        output.style.color = getColor();
        if (typeWriter) typeWriter.clear();
        typeWriter = new Typewriter(output, get(key));
    }

    function Typewriter(element, text) {
        var delay = [30, 60];
        element.innerHTML = '';
        var write = function() {
            if (text.length == 0) return;
            element.innerHTML += text[0];
            text = text.substring(1);
        };

        this.interval = setInterval(write, delay[0] + Math.random() * (delay[1] - delay[0]));
    }

    Typewriter.prototype = {
        clear : function() {
            clearInterval(this.interval);
        }
    };

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