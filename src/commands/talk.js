import Phrases from "../Phrases";

const phrases = new Phrases([
    "What do you want from me?",
    "And what now?",
    "?",
    "...",
    "I hate you"
]);

export default function constructor(){
    function Talk(user, bot, message){
        bot.replyToMessage(message, phrases.phrase());
    }
    Talk.canHandle = function(){ return false; };

    return Talk;
}
