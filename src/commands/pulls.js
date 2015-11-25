export default PullsCommandConstructor;
function PullsCommandConstructor(github) {
    function PullsCommand(user, bot, projects) {
        bot.replyToUser(user, "Ok, wait...").then(() => {
            return notifyUser(bot, projects, user);
        });
    }

    PullsCommand.canHandle = function can(bot, message) {
        return message.text == 'pulls' || message.text.indexOf("show pulls") !== -1;
    };

    PullsCommand.notifyUsers = function notifyUsers(bot, projects, users) {
        users.forEach(function(user) {
            bot.replyToUser(user, 'Ok, man. Now I\'ll try to find a work for you...').then(function(){
                notifyUser(bot, projects, user);
            });
        });
    }
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

    function notifyUser(bot, projects, user) {
        projects.forEach(function(project) {
            if (project.users.indexOf(user.github) === -1) {
                return;
            }
            github.issues.repoIssues({
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
                    const pr_labels = pr.labels.map(function(glabel) {
                        return glabel.name;
                    });
                    if(array_intersect(pr_labels, project.exclude_labels) ||
                       array_intersect(pr_labels, [user.checked_label])) {
                           return;
                       }
                       bot.replyToUser(user, `[${project.name}]: ${pr.title} ${pr.html_url} by ${pr.user.login}`);
                });
            }
                                    );
        });
    }

}
