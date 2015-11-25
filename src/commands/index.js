import PullsCommand from "./pulls";
import TalkCommand from "./talk";

export default class Commands {
    constructor(github) {
        this.github = github;
        this.commands = [
            PullsCommand(github)
        ];
        this.fallbackCommand = TalkCommand();
    }
    run(bot, message, user, data){
        const commands = this.commands.filter(command => {
            return command.canHandle(bot, message);
        });
        if (commands.length) {
            commands.forEach(command => {
                command(user, bot, data);
            });
        } else {
            this.fallbackCommand(user, bot, data);
        }
    }
}
