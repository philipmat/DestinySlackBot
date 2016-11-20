import api from '../destinytrialsreport-api-module';
import util from '../util';
import BotAction from '../bot/BotAction';

let command = ['trials archnemesis', 'trials arch nemesis'],
    respondsTo = ['direct_message', 'direct_mention', 'mention'],
    description = 'returns top 5 enemies played against more than once',
    requiresGamerTag = true;

function action(bot, message) {
    // TODO: Use this when playerId works for this call
    // util.getPlayerId('mr dandandan')
    //     .then(_getArchNemesis)

    _getArchNemesis({displayName: 'dandandan1503', membershipType: 1})
        .then(_processArchNemesis)
        .catch(error => console.log(error.message));
}

function _getArchNemesis(player) {
    return api.general.archnemesis({
        gamerTag: player.displayName
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

    let title = `${player.displayName}'s top ${nemeses.length} nemeses`;

    if (!results.nemeses || !results.nemeses.length) {
        attachments = [util.formatSlackAttachment({
            text: `No archnemeses found`
        })];
    } else {
        attachments = nemeses.map(nemesis => util.formatSlackAttachment({
            title: `${nemesis.displayName}`,
            title_link: `http://my.trials.report/${util.membershipTypeToPlatform(nemesis.membershipType)}/${nemesis.displayName}`,
            text:  `${nemesis.count} match${nemesis.count !== 1 ? 'es' : ''}`,
            fallback: title
        }));
    }

    response = util.formatSlackResponse({
        attachments
    });

    console.log(response)
}

export default new BotAction(
    command,
    respondsTo,
    action,
    description,
    requiresGamerTag
)