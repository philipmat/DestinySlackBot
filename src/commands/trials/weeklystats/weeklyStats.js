import api from '../../../destinytrialsreport-api-module';
import {DestinyTrialsReportApiRequest} from '../../../destinytrialsreport-api-module';
import util from '../../../util';
import {ICON} from '../../../constants';

const WEEK = {
    CURRENT: 0,
    PREVIOUS: -1
};

export default getWeeklyStats;
export {
    WEEK
};

function getWeeklyStats(week, command) {
    let weekNumber = +week,
        request;
    if (isNaN(weekNumber) || weekNumber < -1 /* || weekNumber > MAX_WEEK_NUMBER*/) {
        return `${week} is not a valid number for week`;
    }
    if(command.gamerTag) {
        request = util.getPlayerId(command.gamerTag, command.membershipType, command);
    } else {
        request = Promise.resolve(command.destiny_store);
    }

    return request
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
        thumb_url: ICON.FLAWLESS_YEAR_3,
        fields: aggregateFields.fields,
        fallback: aggregateFields.fallback
    });

    let response = util.destiny.helpers.trialsSlackResponse('', attachment);

    return response;
}