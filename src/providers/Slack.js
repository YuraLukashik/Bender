import Slack from "slackbots";
import {Promise} from "q";

const slackUserMap = {};
const slackChannelMap = {};

export default class SlackProvider {
    constructor(config) {
        this.slack = new Slack(config);
    }
    onMessage(callback) {
        this.slack.on("message", data => {
            if (data.type !== 'message') {
                return;
            }
            const message = {
                text: data.text
            };
            this.findUserById(data.user).then(userName => {
                if (userName) {
                    message.user = userName;
                } else {
                    message.user = data.user;
                }
                return this.findChannelById(data.channel);
            }).then(channel => {
                console.log(channel);
            }).then(() => {
                console.log(message);
                //callback(message);
            });
        })
    }
    postMessageToUser() {
        return this.slack.apply(this.slack, argumets);
    }
    findUserById(userId) {
        if(slackUserMap[userId]) {
            return Promise.resolve(slackUserMap[userId]);
        } else {
            this.__updateSlackUserMap().then(() => {
                return slackUserMap[userId];
            })
        }
    }
    findChannelById(channelId) {
        if(slackChannelMap[channelId]) {
            return Promise.resolve(slackChannelMap[channelId]);
        } else {
            this.__updateSlackChannelMap().then(() => {
                return slackChannelMap[channelId];
            });
        }
    }

    __updateSlackChannelMap() {
        return this.slack.getChannels()
        .then(function(resp) {
            resp.channels.forEach(function(channel) {
                console.log(channel);
                slackChannelMap[channel.id] = channel.name;
            });
        });
    }

    __updateSlackUserMap() {
        return this.slack.getUsers()
        .then(function(resp) {
            resp.members.forEach(function(user) {
                slackUserMap[user.id] = user.name;
            });
        });
    }
}
