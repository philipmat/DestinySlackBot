import util from '../../util';
import BotAction from '../../bot/BotAction';
import weeklyStats from './weeklyStats';

let command = ['trials week', 'trialsweek'],
    respondsTo = ['direct_message', 'direct_mention', 'mention'],
    description = 'returns trials stats for specified week.',
    requiresGamerTag = true;

let regexMap = {
    weekNumber: new RegExp(/(^\d+\s)|(\s\d+\s)|(\s\d+$)/g),
    gamerTag: new RegExp(/.*/g)
};

function action(bot, message) {
    let command = util.parseMessage(message, regexMap),
        promise;


    if (!command.weekNumber && !command.gamerTag) {
        promise = Promise.resolve(`Command: \`trials week\` requires a valid \`week number\` and \`gamer tag\` be specified`);
    } else {
        promise = weeklyStats(command.weekNumber, command);
    }

    return promise
        .then(response => {
            return bot[command.replyFunctionName](message, response);
        })
        .catch(error => {
            if (error.type === 'interactive') {
                return bot.reply(message, error.payload);
            }
            console.log(error.message);
        });
}

export default new BotAction(
    command,
    respondsTo,
    action,
    description,
    requiresGamerTag
)