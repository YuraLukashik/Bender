var bot = require('./slack_bot');
var config = require('./config');
var q = require('q');

var githubToUserMap = {};
var slackToUserMap = {};
var slackMap = {};

for(var id in config.users) {
    var user = config.users[id];
    githubToUserMap[user.github] = user;
    slackToUserMap[user.slack] = user;
}

var service = {

    findByGithub: function(username) {
        return githubToUserMap[username];
    },

    findBySlack: function(username) {
        return slackToUserMap[username];
    },

    findBySlackId: function(id) {
        if(slackMap[id]) {
            return q.fcall(function() {
                return service.findBySlack(slackMap[id]);
            });
        } else {
            return service.__updateSlackMap()
                .then(function() {
                    return service.findBySlack(slackMap[id]);
                });
        }
    },

    __updateSlackMap: function() {
        return bot.getUsers()
            .then(function(resp) {
                resp.members.forEach(function(user) {
                    slackMap[user.id] = user.name;
                });
            });
    }

};

module.exports = service;