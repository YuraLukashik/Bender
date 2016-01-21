import q from 'q';
import moment from 'moment';

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
                    }
                });
        });
    };
    PullsCommand.getName = function getName() {
        return "pulls(show pulls)";
    };

    PullsCommand.getDescription = function getDescription() {
        return "lists PRs you have to review";
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
            }
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
                var prsPromises = [];
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


                    prsPromises.push(
                        Promise.resolve(
                            "-".repeat(80) + "\n" +
                            `[${project.name}]: ${pr.title} ${pr.html_url} by <!${pr.user.login}>` +
                            " | " + moment(pr.created_at).fromNow()
                        )
                    );

                    prsPromises.push(new Promise(function(res, rej){
                        github.pullRequests.get({
                            state: "open",
                            user: project.user,
                            repo: project.repo,
                            number: pr.number
                        }, function(err, pull) {
                            res(
                                "@jenkins deploy staging " +
                                project.name + " " +
                                pull.head.label.split(":").slice(1).join('')
                            );
                        });
                    }));
                });
                Promise.all(prsPromises).then(function(messages) {
                    defered.resolve(messages.filter(function(message){
                            return message != ''
                        }).join('\n'));
                });
            });
        });
        return q.allSettled(promises)
            .then(function(results) {
                var resultMessage = '';
                results.forEach(function(res) {
                    if(res.state == 'fulfilled') {
                        if(resultMessage !== '') {
                            resultMessage += '\n';
                        }
                        resultMessage += res.value;
                    }
                });
                return resultMessage;
            });
    }
}
