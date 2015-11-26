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
                if (isToMe) {
                    this.answer(message);
                }
            });
        });
    }
    isToMe(message) {
        return Promise.resolve(message.isDirect);
    }
    isMine(message) {
        return message.username === this.slack.name;
    }
    answer(message) {
        return this.commands.run(
            this,
            message,
            this.usersService.findBySlack(message.username),
            this.projects
        );
    }
    replyToUser(slackUser, messageText) {
        return this.slack.postMessageToUser(slackUser.slack || slackUser, messageText);
    }
    replyToChannel(channel, messageText) {
        return this.slack.postMessageToChannel(channel, messageText);
    }
    replyToMessage(message, replyText) {
        if (message.isDirect) {
            return this.replyToUser(message.username, replyText);
        } else {
            return this.replyToChannel(message.channelName, replyText);
        }
    }
    notifyUsersAboutPRs(users) {
        return this.commands.get("pulls").notifyUsers(this, this.projects, users);
    }
}
