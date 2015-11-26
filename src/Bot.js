import PullsCommand from "./commands/pulls";
import {Promise} from "q";

export default class Bot {
    constructor(slack, usersService, projects, commands) {
        this.slack = slack;
        this.usersService = usersService;
        this.projects = projects;
        this.commands = commands;
    }
    wakeUp() {
        this.slack.onMessage(message => {
            this.isToMe(message).then(isToMe => {
                if(this.isMine(message)) {
                    return;
                }
                this.answer(message);
            });
        });
    }
    isToMe(message) {
        return new Promise.resolve(true);
    }
    isMine(message) {
        return message.username === this.slack.name;
    }
    answer(message) {
        return this.commands.run(this, message, message.user, this.projects);
    }
    replyToUser(slackUser, messageText) {
        console.log("Going to answer", slackUser, messageText);
        return this.slack.postMessageToUser(slackUser.slack || slackUser, messageText);
    }
    replyToChannel(channel, messageText) {
    }
    replyToMessage(message, replyText) {
        return this.replyToUser(message.user, replyText);
    }
    notifyUsersAboutPRs(users) {
    }
}
