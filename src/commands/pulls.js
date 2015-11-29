import q from 'q';

export default PullsCommandConstructor;
function PullsCommandConstructor(github) {
    function PullsCommand(bot, message, user, projects) {
        bot.replyToMessage(message, "Shit! You ask me again!").then(() => {
            return getNotifications(projects, user)
                .then(function(message) {
                    if(message !== '') {
                        bot.replyToUser(user, message);
                    } else {
                        bot.replyToUser(user, 'Go away! There is nothing to review and I hate you!');
                    }
                });
        });
    }

    PullsCommand.canHandle = function can(bot, message) {
        return message.text == 'pulls' || message.text.indexOf("show pulls") !== -1;
    };

    PullsCommand.notifyUsers = function notifyUsers(bot, projects, users) {
        users.forEach(function(user) {
            getNotifications(projects, user)
                .then(function(message) {
                    if(message !== '') {
                        bot.replyToUser(user, 'Get your ass up and Do Review These PRs!').then(function(){
                            bot.replyToUser(user, message);
                        });
                    };
                });
        });
    };
    return PullsCommand;


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

    function getNotifications(projects, user) {
        var promises = [];
        projects.forEach(function(project) {
            if (project.users.indexOf(user.github) === -1) {
                return;
            };
            var defered = q.defer();
            promises.push(defered.promise);
            github.issues.repoIssues({
                state: "open",
                user: project.user,
                repo: project.repo,
                labels: project.include_labels.join(' ')
            },
            function (err, prs) {
                var messagesForProject = '';
                prs.forEach(function (pr) {
                    if(pr.user.login.toLowerCase() == user.github.toLowerCase()) {
                        return;
                    }
                    const pr_labels = pr.labels.map(function(glabel) {
                        return glabel.name;
                    });
                    if(
                            array_intersect(pr_labels, project.exclude_labels)
                            || array_intersect(pr_labels, [user.checked_label])
                      ) {
                        return;
                    }
                    messagesForProject += `[${project.name}]: ${pr.title} ${pr.html_url} by ${pr.user.login} \n`;
                });
                defered.resolve(messagesForProject);
            });
        });
        return q.allSettled(promises)
            .then(function(results) {
                var resultMessage = '';
                results.forEach(function(res) {
                    if(res.state == 'fulfilled') {
                        resultMessage += res.value;
                    }
                });
                return resultMessage;
            });
    }
}
