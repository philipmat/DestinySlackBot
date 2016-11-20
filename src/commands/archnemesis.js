import api from '../destinytrialsreport-api-module';
import util from '../util';
import BotAction from '../bot/BotAction';

let command     = ['trials archnemesis', 'trials arch nemesis'],
    respondsTo  = ['direct_message', 'direct_mention', 'mention'],
    description = 'returns top 5 enemies played against more than once',
    requiresGamerTag = true;

function action(bot, message) {
    // TODO: Use this when playerId works for this call
    // util.getPlayerId('mr dandandan')
    //     .then(_getArchNemesis)

    _getArchNemesis({displayName: 'dandandan1503'})
        .then(_processArchNemesis)
        .catch(error => console.log(error.message));
}

function _getArchNemesis(player) {
    return api.general.archnemesis({
        gamerTag: player.displayName
    });
}

function _processArchNemesis(results) {
    console.log(results)
}

export default new BotAction(
    command,
    respondsTo,
    action,
    description,
    requiresGamerTag
)