import api from '../destinytrialsreport-api-module';
import {DestinyTrialsReportApiRequest} from '../destinytrialsreport-api-module';
import util from '../util';

const WEEK = {
    CURRENT: 'current',
    PREVIOUS: 'previous'
};

export default getWeeklyStats;
export {
    WEEK
};

function getWeeklyStats(week, gamerTag) {
    //util.getPlayerId(gamerTag)
    let request;
    switch(week) {
        case WEEK.CURRENT:
            request = _getWeeklyStats('thisWeek', gamerTag);
            break;
        case WEEK.PREVIOUS:
            request = _getWeeklyStats('lastWeek', gamerTag);
            break;
        default:
            let weekNumber = +week;
            if(!weekNumber) {
                return `${week} is not a valid number for week`;
            }
            request = _getSpecificWeeklyStats(weekNumber, gamerTag);
            break;
    }

    return request
        .then(_processWeeklyStats)
        .catch(error => console.log(error.message));
}

function _getSpecificWeeklyStats(weekNumber, gamerTag) {
    return Promise.resolve();
}

function _getWeeklyStats(endpoint, player) {
    return api.slack[endpoint]({
        //membershipId: player.membershipId
        gamerTag: player
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
        title     = `${stats.displayName} on DestinyTrialsReport`,
        titleLink = `http://my.trials.report/${platform}/${stats.displayName}`;

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