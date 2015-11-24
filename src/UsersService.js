import q from 'q';

const githubToUserMap = {};
const slackToUserMap = {};
const slackMap = {};

export default class UsersService {
    constructor(slack, config) {
        this.slack = slack;
        this.config = config;
        for(var id in config.users) {
            var user = config.users[id];
            githubToUserMap[user.github] = user;
            slackToUserMap[user.slack] = user;
        }
    }
    findByGithub(username) {
        return githubToUserMap[username];
    }

    findBySlack(username) {
        return slackToUserMap[username];
    }

    findBySlackId(id) {
        if(slackMap[id]) {
            return q.fcall(() => {
                return this.findBySlack(slackMap[id]);
            });
        } else {
            return this.__updateSlackMap()
            .then(() => {
                return this.findBySlack(slackMap[id]);
            });
        }
    }

    __updateSlackMap() {
        return this.slack.getUsers()
        .then(function(resp) {
            resp.members.forEach(function(user) {
                slackMap[user.id] = user.name;
            });
        });
    }

}
