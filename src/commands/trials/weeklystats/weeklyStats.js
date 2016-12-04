import api from '../../../destinytrialsreport-api-module';
import {DestinyTrialsReportApiRequest} from '../../../destinytrialsreport-api-module';
import util from '../../../util';

const WEEK = {
    CURRENT: 0,
    PREVIOUS: -1
};

export default getWeeklyStats;
export {
    WEEK
};

function getWeeklyStats(week, command) {
    let weekNumber = +week;
    if (isNaN(weekNumber) || weekNumber < -1 /* || weekNumber > MAX_WEEK_NUMBER*/) {
        return `${week} is not a valid number for week`;
    }

    return util.getPlayerId(command.gamerTag, command.membershipType, command.command)
        .then(player => _getSpecificWeeklyStats(weekNumber, player))
        .then(_processWeeklyStats);
}

function _getSpecificWeeklyStats(weekNumber, player) {
    return api.slack.trialsWeek({
        membershipId: player.membershipId,
        weekNumber
    })
        .then(DestinyTrialsReportApiRequest.unwrap)
        .then(response => {
            return {
                stats: response,
                player
            }
        });
}

function _processWeeklyStats(results) {
    let {stats, player} = results;

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