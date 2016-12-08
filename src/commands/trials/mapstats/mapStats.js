import BotAction from '../../../bot/BotAction';
import api from '../../../destinytrialsreport-api-module';
import {DestinyTrialsReportApiRequest} from '../../../destinytrialsreport-api-module';
import CommandParamRegex from '../../../bot/CommandParamRegex';
import {COMMAND_GROUPING, REGEX} from '../../../constants';
import util from '../../../util';

let command = ['map stats', 'mapstats'],
    respondsTo = ['direct_message', 'direct_mention', 'mention'],
    description = 'returns trials stats for specified map.',
    paramRegex = {
        mapId: new CommandParamRegex(REGEX.NUMBER),
        gamerTag: new CommandParamRegex(REGEX.ANY_TEXT)
    };

function action(bot, message, command) {
    console.log(command)
    return getMapStats(command.mapId, command)
        .then(response => bot[command.replyFunctionName](message, response));
}

function getMapStats(map, command) {
    if (isNaN(map) || map < -1) {
        return `${map} is not a valid number for week`;
    }

    return util.getPlayerId(command.gamerTag, command.membershipType, command.command)
        .then(player => _getSpecificMapStats(map, player))
        .then(_processMapStats);
}

function _getSpecificMapStats(map, player) {
    console.log(map);
    console.log(player);

    return api.slack.thisMap({
        membershipId: player.membershipId,
        mapId: map
    })
        .then(DestinyTrialsReportApiRequest.unwrap)
        .then(response => {
            return {
                stats: response,
                player
            }
        });
}

function _processMapStats(results) {
    let {stats, player} = results;

    console.log(results)

    if (!stats || !+stats.matches) {
        return `No matches found for ${player.displayName || player}`;
    }
    let platform  = util.Convert.membershipTypeToPlatform(stats.membershipType),
        title     = `${player.displayName} on DestinyTrialsReport`,
        titleLink = `http://my.trials.report/${platform}/${player.displayName}`;

    let aggregateFields = util.slack.aggregateMatchStatsToFields(`Map`, stats.map, +stats.matches, +stats.losses, +stats.kd);

    let attachment = util.slack.formatAttachment({
        title,
        title_link: titleLink,
        fields: aggregateFields.fields,
        fallback: aggregateFields.fallback
    });

    let response = util.slack.formatResponse({
        attachments: attachment
    });

    return response;
}

export default new BotAction({
    command,
    respondsTo,
    action,
    description,
    grouping: COMMAND_GROUPING.TRIALS,
    paramRegex
})