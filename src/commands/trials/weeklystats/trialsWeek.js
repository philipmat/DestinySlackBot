import BotAction from '../../../bot/BotAction';
import CommandParamRegex from '../../../bot/CommandParamRegex';
import weeklyStats from './weeklyStats';
import {COMMAND_GROUPING, REGEX} from '../../../constants';

let command = ['week'],
    respondsTo = ['direct_message', 'direct_mention', 'mention'],
    description = 'returns trials stats for specified week.',
    paramRegex = {
        weekNumber: new CommandParamRegex(REGEX.NUMBER),
        gamerTag: new CommandParamRegex(REGEX.ANY_TEXT, false)
    };

function action(bot, message, command) {
    return weeklyStats(command.weekNumber, command)
        .then(response => {
            return bot[command.replyFunctionName](message, response);
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