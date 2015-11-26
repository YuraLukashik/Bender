import PullsCommand from "./pulls";
import TalkCommand from "./talk";

export default class Commands {
    constructor(github) {
        this.github = github;
        this.commands = {
            pulls: PullsCommand(github),
            talk: TalkCommand()
        };
        this.fallbackCommand = this.getCommand("talk");
    }
    getCommand(commandName) {
        return this.commands[commandName];
    }
    run(bot, message, user, data){
        const commands = Object.keys(this.commands).map(commandName => {
            return this.commands[commandName];
        }).filter(command => {
            return command.canHandle(bot, message);
        });
        if (commands.length) {
            commands.forEach(command => {
                command(bot, message, user, data);
            });
        } else {
            this.fallbackCommand(bot, message, user, data);
        }
    }
}
