var config = require('../app/config_prod.json');
var GitHubApi = require("github");

var github = new GitHubApi({
    version: "3.0.0"
});

github.authenticate({
    type: "token",
    token: config.github.token
});

module.exports = github;
