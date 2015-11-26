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
        this.slack.findUserById(id).then(userName => {
            return this.findBySlack(userName);
        });
    }
}
