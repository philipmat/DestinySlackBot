import util from '../../util';
import BotAction from '../../bot/BotAction';
import weeklyStats from './weeklyStats';
import {WEEK} from './weeklyStats';

let command = ['trials this week', 'trials this week', 'trials this week', 'trials thisweek'],
    respondsTo = ['direct_message', 'direct_mention', 'mention'],
    description = 'returns trials stats for current week.',
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
        promise = weeklyStats(WEEK.CURRENT, command);
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