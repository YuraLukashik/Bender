import Phrases from "../Phrases";

const phrases = new Phrases([
    "What do you want from me?",
    "And what now?",
    "?",
    "...",
    "I hate you"
]);

export default function constructor(){
    function Talk(bot, message, user){
        bot.replyToMessage(message, phrases.phrase());
    }
    Talk.canHandle = function(){ return false; };

    return Talk;
}
