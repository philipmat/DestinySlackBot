import api from '../../destinytrialsreport-api-module';
import {DestinyTrialsReportApiRequest} from '../../destinytrialsreport-api-module';
import BotAction from '../../bot/BotAction';
import DestinySlackBotError from '../../bot/DestinySlackBotError';
import {COMMAND_GROUPING, ERROR_TYPE, PERSONA, CALLOUT_MAPS, ACTIVITIES} from '../../constants';
import util from '../../util';

let command     = ['callouts', 'callout map'],
    respondsTo  = ['direct_message', 'direct_mention', 'mention'],
    description = 'Returns callouts for current Trials map';

function action(bot, message, command) {
    return _getCurrentMap()
        .then(DestinyTrialsReportApiRequest.unwrap)
        .then(map => {
            if (!map) {
                return Promise.reject(
                    new DestinySlackBotError(`Invalid response for currentMap request`, ERROR_TYPE.BAD_RESPONSE)
                );
            }

            return util.slack.personaResponse(
                `*This Week's Trials Callout Map*`,
                PERSONA.BROTHER_VANCE,
                {
                    title: ACTIVITIES[map.referenceId],
                    title_link: CALLOUT_MAPS[map.referenceId],
                    image_url: CALLOUT_MAPS[map.referenceId]
                }
            );
        })
        .then(response => bot.reply(message, response));
}

function _getCurrentMap() {
    return api.general.currentMap();
}

export default new BotAction({
    command,
    respondsTo,
    action,
    description,
    grouping: COMMAND_GROUPING.TRIALS
})