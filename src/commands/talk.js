export default function constructor(){
    function Talk(user, bot){
        bot.angryReply(user);
    }
    Talk.canHandle = function(){ return false; };

    return Talk;
}
