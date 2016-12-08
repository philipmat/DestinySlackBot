import api from '../../destinytrialsreport-api-module';
import util from '../../util';
import BotAction from '../../bot/BotAction';
import CommandParamRegex from '../../bot/CommandParamRegex';
import {COMMAND_GROUPING, REGEX} from '../../constants';

let command = ['archnemesis', 'arch nemesis'],
    respondsTo = ['direct_message', 'direct_mention', 'mention'],
    description = 'returns top 5 enemies played against more than once.',
    paramRegex = {
        gamerTag: new CommandParamRegex(REGEX.ANY_TEXT)
    };

function action(bot, message, command) {
    return util.getPlayerId(command.gamerTag, command.membershipType, command)
        .then(_getArchNemesis)
        .then(_processArchNemesis)
        .then(response => bot[command.replyFunctionName](message, response));
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

    response = util.destiny.helpers.trialsSlackResponse(title, attachments);

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