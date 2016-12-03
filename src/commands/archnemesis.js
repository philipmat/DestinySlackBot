import api from '../destinytrialsreport-api-module';
import util from '../util';
import BotAction from '../bot/BotAction';
import {COMMAND_GROUPING, REGEX} from '../constants';

let command = ['trials archnemesis', 'trials arch nemesis'],
    respondsTo = ['direct_message', 'direct_mention', 'mention'],
    description = 'returns top 5 enemies played against more than once.',
    paramRegex = {
        gamerTag: REGEX.GAMER_TAG
    };

function action(bot, message, command) {
    util.getName(message)
        .then(util.getPlayerId)
        .then(_getArchNemesis)
        .then(_processArchNemesis)
        .then(response => bot.reply(message, response))
        .catch(error => console.log(error.message));
}

function _getArchNemesis(player) {
    return api.general.archnemesis({
        membershipId: player.membershipId
    }).then(results => {
        return {
            nemeses: results,
            player
        }
    });
}

function _processArchNemesis(results) {
    let {nemeses, player} = results,
        response,
        attachments;

    let title = `*<http://opponents.trials.report/${util.Convert.membershipTypeToPlatform(player.membershipType)}/${player.displayName}|${player.displayName}'s top ${nemeses.length} nemeses>*`;

    if (!results.nemeses || !results.nemeses.length) {
        attachments = [util.slack.formatAttachment({
            text: `No archnemeses found for ${player.displayName}`
        })];
    } else {
        attachments = nemeses.map(nemesis => util.slack.formatAttachment({
            title: `${nemesis.displayName}`,
            title_link: `http://my.trials.report/${util.Convert.membershipTypeToPlatform(nemesis.membershipType)}/${nemesis.displayName}`,
            text: `${nemesis.count} match${nemesis.count !== 1 ? 'es' : ''}`,
            fallback: `${nemesis.displayName}: ${nemesis.count} match${nemesis.count !== 1 ? 'es' : ''}`
        }));
    }

    response = util.slack.formatResponse({
        text: title,
        attachments
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