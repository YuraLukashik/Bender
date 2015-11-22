var config = require(__dirname+'/../app/config.json');

var bot = require('./slack_bot');
var github = require('./github_api');

var projects = config.projects;
var users = config.users;
var usersMap = {};

users.forEach(function(user) {
    usersMap[user.github] = user;
});

projects.forEach(function(project) {
    github.issues.repoIssues(
        {
            state: "open",
            user: project.user,
            repo: project.repo,
            labels: ""
        },
        function(err, prs) {
            project.users.forEach(function(user) {
                var user = usersMap[user];
                prs.forEach(function(pr) {
                    bot.postMessageToUser(user.slack, pr.url);
                });
            });
        }
    );
});


