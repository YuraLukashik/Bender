import config from "../../app/config_prod.json";

export default ReposCommandConstructor;
function ReposCommandConstructor() {

    function Repos(bot, message) {
        let repoMessage = '';
        config.projects.forEach(project => {
            repoMessage += project.repo + " - " + "https://github.com/" + project.user + "/" + project.repo + "\n";
        });
        bot.replyToMessage(message, repoMessage);
    }

    Repos.canHandle = function can(bot, message) {
        return message.text.indexOf('repos') !== -1;
    };

    Repos.getName = function getName() {
        return 'repos';
    };

    Repos.getDescription = function getDescription() {
        return 'show a list of repos github';
    };

    return Repos;
}

