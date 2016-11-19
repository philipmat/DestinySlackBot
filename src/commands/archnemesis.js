import api from '../destinytrialsreport-api-module';
import util from '../util';

let command     = ['trials archnemesis', 'trials arch nemesis'],
    respondsTo  = ['direct_message', 'direct_mention', 'mention'],
    description = 'returns top 5 enemies played against more than once';

function action(bot, message) {
    util.getPlayerId('mr dandandan')
        .then(_getArchNemesis)
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

export default {
    command,
    respondsTo,
    action,
    description
}