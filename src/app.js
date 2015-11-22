var config = require(__dirname+'/../app/config.json');

var bot = require('./slack_bot');
var github = require('./github_api');
var users_service = require('./users_service');
var schedule = require('node-schedule');

var projects = config.projects;

function arrayToLower(arr) {
    return arr.map(function(str) {
        return str && str.toLowerCase();
    });
}

function array_intersect(arr1, arr2) {
    arr1 = arrayToLower(arr1);
    arr2 = arrayToLower(arr2);

    var r = arr1.filter(function(n) {
        return arr2.indexOf(n) != -1
    });
    return r.length !== 0;
}

function notifyUser(user) {
    projects.forEach(function(project) {
            if (project.users.indexOf(user.github) === -1) {
                return;
            }
            github.issues.repoIssues(
                {
                    state: "open",
                    user: project.user,
                    repo: project.repo,
                    labels: project.include_labels.join(' ')
                },
                function (err, prs) {
                    prs.forEach(function (pr) {
                        if(pr.user.login.toLowerCase() == user.github.toLowerCase()) {
                            return;
                        }
                        pr_labels = pr.labels.map(function(glabel) {
                            return glabel.name;
                        });
                        if(array_intersect(pr_labels, project.exclude_labels) ||
                           array_intersect(pr_labels, [user.checked_label])) {
                            return;
                        }
                        bot.postMessageToUser(user.slack, "["+project.name+"]: "+pr.title+" "+pr.html_url+" by "+pr.user.login);
                    });
                }
            );
        }
    );
}

function notifyUsers() {
    config.users.forEach(function(user) {
        bot.postMessageToUser(user.slack, 'Hi, please, review few Pull Requests :)')
            .then(function() {
                notifyUser(user);
            });
    });
}

schedule.scheduleJob(config.notifications_time, function() {
    notifyUsers();
});

bot.on('message', function(data) {
    if(data.type == 'message' && data.text == 'pulls') {
        users_service.findBySlackId(data.user)
            .then(function(user) {
                bot.postMessageToUser(user.slack, 'Ok, let me check :)');
                notifyUser(user);
            });
    }
});