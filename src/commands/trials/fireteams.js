import api from '../../destinytrialsreport-api-module';
import util from '../../util';
import BotAction from '../../bot/BotAction';
import CommandParamRegex from '../../bot/CommandParamRegex';
import {COMMAND_GROUPING, REGEX, PERSONA} from '../../constants';

let command = ['fireteams'],
    respondsTo = ['direct_message', 'direct_mention', 'mention'],
    description = 'returns top 5 fireteams.',
    paramRegex = {
        gamerTag: new CommandParamRegex(REGEX.ANY_TEXT, false)
    };

function action(bot, message, command) {
    let request;
    if (command.gamerTag) {
        request = util.getPlayerId(command.gamerTag, command.membershipType, command);
    } else {
        request = Promise.resolve(command.destiny_store);
    }

    return request
        .then(_getFireTeams)
        .then(_processFireTeams)
        .then(response => bot[command.replyFunctionName](message, response));
}

function _getFireTeams(player) {
    return api.slack.fireteams({
        membershipId: player.membershipId
    }).then(results => {
        return {
            fireteams: results,
            player
        }
    });
}

function _processFireTeams(results) {
    let {fireteams, player} = results,
        response,
        attachments,
        title;

    if (!results.fireteams || !results.fireteams.length) {
        attachments = [util.slack.formatAttachment({
            text: `No fireteams found for ${player.displayName}`
        })];
    } else {
        title = `*${player.displayName}'s top ${fireteams.length} fireteams*`;
        attachments = fireteams.map(fireteam => util.slack.formatAttachment({
            title: `${player.displayName} - ${fireteam.teammates.split(',').join(' - ')}`,
            title_link: `http://trials.report/${player.platform}/${player.displayName}/${fireteam.teammates.split(',').join('/')}`,
            text: `*Win Rate:* ${(100 * (+fireteam.wins / (+fireteam.wins + +fireteam.losses)).toFixed(2))}%\n*Record:* ${fireteam.wins} - ${fireteam.losses}`,
        }));
    }

    response = util.slack.personaResponse(title, PERSONA.BROTHER_VANCE, attachments);

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