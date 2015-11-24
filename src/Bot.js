import PullsCommand from "./commands/pulls";
import {Promise} from "q";

const angryReplies = [
    "What do you want from me?",
    "And what now?",
    "?",
    "...",
    "I hate you"
];
let prevIndex = -1;
function getRandomArrayItem(arr) {
    let index;
    while((index = Math.floor(Math.random() * arr.length)) == prevIndex){}
    return arr[index];
}
export default class Bot {
    constructor(slack, usersService, projects, commands) {
        this.slack = slack;
        this.usersService = usersService;
        this.projects = projects;
        this.commands = commands;
    }
    wakeUp() {
        this.slack.on("message", data => {
            this.isToMe(data).then(isToMe => {
                if(this.isMine(data)) {
                    return;
                }
                if(data.type == "message" && isToMe) {
                    this.answer(data);
                }
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
        return this.usersService.findBySlackId(message.user).then(user => {
            return this.commands.run(this, message, user, this.projects);
        });
    }
    replyToUser(slackUser, messageText) {
        console.log("Going to answer", slackUser, messageText);
        return this.slack.postMessageToUser(slackUser.slack || slackUser, messageText);
    }
    replyToChannel(channel, messageText) {
    }
    notifyUsersAboutPRs(users) {
    }
    angryReply(user) {
        return this.replyToUser(user, getRandomArrayItem(angryReplies));
    }
}
