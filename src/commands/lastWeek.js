import api from '../destinytrialsreport-api-module';
import {DestinyTrialsReportApiRequest} from '../destinytrialsreport-api-module';
import util from '../util';
import BotAction from '../bot/BotAction';

let command          = ['trials last week', 'trials lastweek'],
    respondsTo       = ['direct_message', 'direct_mention', 'mention'],
    description      = 'returns trials stats for previous week. [ORIGINAL GT]',
    requiresGamerTag = true;

function action(bot, message) {
    util.getName(message)
    //.then(util.getPlayerId)
        .then(_getLastWeek)
        .then(_processLastWeek)
        .then(response => bot.reply(message, response))
        .catch(error => console.log(error.message));
}

function _getLastWeek(player) {
    return api.slack.lastWeek({
        //membershipId: player.membershipId
        gamerTag: player
    })
        .then(DestinyTrialsReportApiRequest.unwrap)
        .then(response => {
            return {
                lastWeek: response,
                player
            }
        });
}

function _processLastWeek(results) {
    let {lastWeek, player} = results;

    if (!lastWeek || !+lastWeek.matches) {
        return `No matches found for ${player.displayName}`;
    }
    let platform  = util.Convert.membershipTypeToPlatform(lastWeek.membershipType),
        title     = `${lastWeek.displayName} on DestinyTrialsReport`,
        titleLink = `http://my.trials.report/${platform}/${lastWeek.displayName}`;

    let aggregateFields = util.aggregateMatchStatsToSlackFields(`Map`, lastWeek.map, +lastWeek.matches, +lastWeek.losses, +lastWeek.kd);

    let attachment = util.formatSlackAttachment({
        title,
        title_link: titleLink,
        fields: aggregateFields.fields,
        fallback: aggregateFields.fallback
    });

    let response = util.formatSlackResponse({
        attachments: attachment
    });

    return response;
}

export default new BotAction(
    command,
    respondsTo,
    action,
    description,
    requiresGamerTag
)