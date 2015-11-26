import PullsCommand from "./pulls";
import TalkCommand from "./talk";

export default class Commands {
    constructor(github) {
        this.github = github;
        this.commands = {
            pulls: PullsCommand(github)
        };
        this.fallbackCommand = TalkCommand();
    }
    getCommand(commandName) {
        this.commands[commandName];
    }
    run(bot, message, user, data){
        const commands = Object.keys(this.commands).map(commandName => {
            return this.commands[commandName];
        }).filter(command => {
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
