var config = require('./config');
var SlackBot = require('slackbots');

var bot = new SlackBot({
    token: config.slack.token,
    name: 'Bender'
});

module.exports = bot;