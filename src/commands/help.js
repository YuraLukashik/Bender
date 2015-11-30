import Phrases from "../Phrases";


const phrases = new Phrases([
    "oh, come on",
    "And what now?",
    "?",
    "..."
]);

export default HelpCommandConstructor;
function HelpCommandConstructor(commands) {

    function Help(bot, message) {
        let helpMessage = phrases.phrase() + "\n";
        const commandsArray = Object.keys(commands).map(commandName => {
            return commands[commandName];
        });
        commandsArray.forEach(command => {
            if(typeof command.getName == 'function' && typeof command.getDescription == 'function') {
                helpMessage += command.getName() + " - " + command.getDescription() + "\n";
               }
        });
        bot.replyToMessage(message, helpMessage);
    }

    Help.canHandle = function can(bot, message) {
        return message.text.indexOf("help") !== -1;
    };

    Help.getName = function getName() {
        return 'help';
    };

    Help.getDescription = function getDescription() {
        return 'show a list of available commands';
    };

    return Help;
}
