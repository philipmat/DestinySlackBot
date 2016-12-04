import BotAction from '../../../bot/BotAction';
import CommandParamRegex from '../../../bot/CommandParamRegex';
import weeklyStats from './weeklyStats';
import {WEEK} from './weeklyStats';
import {COMMAND_GROUPING, REGEX} from '../../../constants';

let command = ['last week', 'lastweek'],
    respondsTo = ['direct_message', 'direct_mention', 'mention'],
    description = 'returns trials stats for previous week.',
    paramRegex = {
        gamerTag: new CommandParamRegex(REGEX.ANY_TEXT)
    };

function action(bot, message, command) {
    return weeklyStats(WEEK.PREVIOUS, command)
        .then(response => {
            return bot[command.replyFunctionName](message, response)
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