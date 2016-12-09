import BotAction from '../../bot/BotAction';
import CommandParamRegex from '../../bot/CommandParamRegex';
import util from '../../util';
import {COMMAND_GROUPING, CALLOUT_MAPS, ACTIVITIES, REGEX, PERSONA, SYSTEM_STRINGS} from '../../constants';

let command     = ['callouts', 'callout map'],
    respondsTo  = ['direct_message', 'direct_mention', 'mention'],
    description = 'Returns the callout map',
    paramRegex  = {
        mapId: new CommandParamRegex(REGEX.NUMBER, false)
    };

function action(bot, message, command) {
    if (!command.mapId) {
        return _buildInteractiveMapSelector(Object.keys(CALLOUT_MAPS))
            .then(response => bot[command.replyFunctionName](message, response));
    }

    return Promise.resolve(
        util.slack.personaResponse(
            `*Callout Map*`,
            PERSONA.LORD_SHAXX,
            {
                title: ACTIVITIES[command.mapId],
                title_link: CALLOUT_MAPS[command.mapId],
                image_url: CALLOUT_MAPS[command.mapId]
            }
        )
    )
        .then(response => bot[command.replyFunctionName](message, response));
}

function _buildInteractiveMapSelector(mapIds) {
    let actions = util.Convert.arrayToChunksOf(mapIds, 5).map(chunk => {
            return chunk.map(id => {
                return {
                    name: ACTIVITIES[id],
                    text: ACTIVITIES[id],
                    callback_id: `crucible callout map`,
                    value: `crucible callout map ${ACTIVITIES[id]}`,
                    type: 'button'
                }
            })
        }),
        attachments;

    let firstRow = true;
    attachments = actions.map(chunk => {
        let attachment = util.slack.formatAttachment({
            text: firstRow ? '*Select a map for callouts*' : SYSTEM_STRINGS.EMPTY,
            actions: chunk,
            fallback: `Interactions not supported`
        });
        firstRow = false;

        return attachment;
    });

    return Promise.resolve(util.slack.personaResponse(SYSTEM_STRINGS.EMPTY, PERSONA.LORD_SHAXX, attachments));
}

export default new BotAction({
    command,
    respondsTo,
    action,
    description,
    grouping: COMMAND_GROUPING.CRUCIBLE,
    paramRegex
})