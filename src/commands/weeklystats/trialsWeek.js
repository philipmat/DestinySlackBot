import util from '../../util';
import BotAction from '../../bot/BotAction';
import weeklyStats from './weeklyStats';
import {COMMAND_GROUPING, REGEX} from '../../constants';

let command = ['trials week', 'trialsweek'],
    respondsTo = ['direct_message', 'direct_mention', 'mention'],
    description = 'returns trials stats for specified week.',
    paramRegex = {
        weekNumber: REGEX.NUMBER,
        gamerTag: REGEX.GAMER_TAG
    };

function action(bot, message, command) {
    return weeklyStats(command.weekNumber, command)
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

export default new BotAction({
    command,
    respondsTo,
    action,
    description,
    grouping: COMMAND_GROUPING.TRIALS,
    paramRegex
})