import BotAction from '../../../bot/BotAction';
import CommandParamRegex from '../../../bot/CommandParamRegex';
import {COMMAND_GROUPING, REGEX, TRIALS_MAPS} from '../../../constants';
import util from '../../../util';

let command = ['on map', 'onmap'],
    respondsTo = ['direct_message', 'direct_mention', 'mention'],
    description = 'returns trials stats for current map.',
    paramRegex = {
        gamerTag: new CommandParamRegex(REGEX.ANY_TEXT)
    };

function action(bot, message, command) {
    return bot.reply(message, {attachments: _buildTrialsWeekInteractiveResponse(command)});
}

function _buildTrialsWeekInteractiveResponse(command) {
    return util.Convert.inChunksOf(Object.keys(TRIALS_MAPS), 5).map(chunk => {
        return {
            title: `Match for found for multiple platforms`,
            callback_id: `trials map`,
            attachment_type: 'default',
            actions: chunk.map(id => {
                return {
                    "name": TRIALS_MAPS[id],
                    "text": TRIALS_MAPS[id],
                    "value": `trials map ${TRIALS_MAPS[id]} ${command.gamerTag}`,
                    "type": "button"
                }
            })
        }
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