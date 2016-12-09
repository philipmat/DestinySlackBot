import BotAction from '../../../bot/BotAction';
import CommandParamRegex from '../../../bot/CommandParamRegex';
import mapStats from './mapStats';
import {COMMAND_GROUPING, REGEX, TRIALS_MAPS, ACTIVITIES} from '../../../constants';
import util from '../../../util';

let command = ['map'],
    respondsTo = ['direct_message', 'direct_mention', 'mention'],
    description = 'returns trials stats for specified map.',
    paramRegex = {
        mapId: new CommandParamRegex(REGEX.NUMBER, false),
        gamerTag: new CommandParamRegex(REGEX.ANY_TEXT)
    };

function action(bot, message, command) {
    if (!command.mapId) {
        bot.reply(message, {attachments: _buildTrialsWeekInteractiveResponse(command)});
        return;
    }

    return mapStats(command.mapId, command)
        .then(response => {
            return bot[command.replyFunctionName](message, response);
        });
}

function _buildTrialsWeekInteractiveResponse(command) {
    return util.Convert.arrayToChunksOf(Object.keys(TRIALS_MAPS), 5).map(chunk => {
        return {
            title: ``,
            callback_id: "trials map",
            attachment_type: 'default',
            actions: chunk.map(id => {
                return {
                    "name": TRIALS_MAPS[id],
                    "text": ACTIVITIES[TRIALS_MAPS[id]],
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