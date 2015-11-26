import Slack from "slackbots";
import {Promise} from "q";

const slackUserMap = {};
const slackChannelMap = {};

export default class SlackProvider {
    constructor(config) {
        this.slack = new Slack(config);
    }
    get name() {
        return this.slack.name;
    }
    onMessage(callback) {
        this.slack.on("message", data => {
            if (data.type !== 'message') {
                return;
            }
            this.findUserById(data.user).then(userName => {
                if (userName) {
                    data.username = userName;
                }
                return this.findChannelById(data.channel);
            }).then(channel => {
                data.isDirect = data.channel[0] === 'D';
                data.channelName = channel;
            }).then(() => {
                callback(data);
            });
        })
    }
    postMessageToUser() {
        return this.slack.postMessageToUser.apply(this.slack, arguments);
    }
    postMessageToChannel() {
        return this.slack.postMessageToChannel.apply(this.slack, arguments);
    }

    findUserById(userId) {
        if(slackUserMap[userId]) {
            return Promise.resolve(slackUserMap[userId]);
        } else {
            return this.__updateSlackUserMap().then(() => {
                return slackUserMap[userId];
            })
        }
    }

    findIdByUser(userName) {
        const id = Object.keys(slackUserMap).find(id => {
            return slackUserMap[id] === userName;
        });
        if (id) {
            return Promise.resolve(id);
        } else {
            return this.__updateSlackUserMap().then(() => {
                return Object.keys(slackUserMap).find(id => {
                    return slackUserMap[id] === userName;
                });
            });
        }
    }

    findChannelById(channelId) {
        if(slackChannelMap[channelId]) {
            return Promise.resolve(slackChannelMap[channelId]);
        } else {
            return this.__updateSlackChannelMap().then(() => {
                return slackChannelMap[channelId];
            });
        }
    }

    __updateSlackChannelMap() {
        return this.slack.getChannels().then(function(resp) {
            resp.channels.forEach(function(channel) {
                slackChannelMap[channel.id] = channel.name;
            });
        });
    }

    __updateSlackUserMap() {
        return this.slack.getUsers().then(function(resp) {
            resp.members.forEach(function(user) {
                slackUserMap[user.id] = user.name;
            });
        });
    }
}
