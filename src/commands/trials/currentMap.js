import api from '../../destinytrialsreport-api-module';
import {DestinyTrialsReportApiRequest} from '../../destinytrialsreport-api-module';
import BotAction from '../../bot/BotAction';
import {COMMAND_GROUPING} from '../../constants';
import util from '../../util';

let command     = ['current map'],
    respondsTo  = ['direct_message', 'direct_mention', 'mention'],
    description = 'returns the most recent trials map';

function action(bot, message, command) {
    return _getCurrentMap()
        .then(DestinyTrialsReportApiRequest.unwrap)
        .then(_processCurrentMapResponse)
        .then(response => bot.reply(message, response));
}

function _getCurrentMap() {
    return api.general.currentMap();
}

function _processCurrentMapResponse(result) {
    if(!result) {
        return Promise.reject(`Invalid response for currentMap request`);
    }

    let mapName = result['activityName'],
        pgcrImage = result['pgcrImage'];

    let text = `This week's map is...`,
        attachments = [
            {
                fallback: mapName,
                text: mapName,
                image_url: `http://www.bungie.net${pgcrImage}`
            }
        ];


    return util.destiny.helpers.trialsSlackResponse(text, attachments);
}

export default new BotAction({
    command,
    respondsTo,
    action,
    description,
    grouping: COMMAND_GROUPING.TRIALS
})