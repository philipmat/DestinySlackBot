import BotAction from '../../../bot/BotAction';
import CommandParamRegex from '../../../bot/CommandParamRegex';
import mapStats from './mapStats';
import {COMMAND_GROUPING, REGEX} from '../../../constants';

let command = ['map'],
    respondsTo = ['direct_message', 'direct_mention', 'mention'],
    description = 'returns trials stats for specified map.',
    paramRegex = {
        mapId: new CommandParamRegex(REGEX.NUMBER),
        gamerTag: new CommandParamRegex(REGEX.ANY_TEXT)
    };

function action(bot, message, command) {
    console.log(command)
    return mapStats(command.mapId, command)
        .then(response => {
            console.log(response)
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