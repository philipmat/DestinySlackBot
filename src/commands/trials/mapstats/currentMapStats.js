import BotAction from '../../../bot/BotAction';
import CommandParamRegex from '../../../bot/CommandParamRegex';
import mapStats from './stats';
import {MAP} from './stats';
import {COMMAND_GROUPING, REGEX} from '../../../constants';

let command = ['current map stats', 'current mapstats'],
    respondsTo = ['direct_message', 'direct_mention', 'mention'],
    description = 'returns trials stats for current map.',
    paramRegex = {
        gamerTag: new CommandParamRegex(REGEX.ANY_TEXT, false)
    };

function action(bot, message, command) {
    return mapStats(MAP.CURRENT, command)
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