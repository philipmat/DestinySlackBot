import util from '../../util';
import BotAction from '../../bot/BotAction';
import weeklyStats from './weeklyStats';
import {WEEK} from './weeklyStats';

let command = ['trials last week', 'trials lastweek'],
    respondsTo = ['direct_message', 'direct_mention', 'mention'],
    description = 'returns trials stats for previous week.',
    requiresGamerTag = true;

let regexMap = {
    gamerTag: new RegExp(/.*/g)
};

function action(bot, message) {
    let command = util.parseMessage(message, regexMap),
        promise;

    if (!command.gamerTag) {
        promise = Promise.resolve(`Command: \`trials last week\` requires a valid \`gamer tag\` be specified`);
    } else {
        promise = weeklyStats(WEEK.PREVIOUS, command);
    }

    return promise
        .then(response => {
            return bot[command.replyFunctionName](message, response)
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