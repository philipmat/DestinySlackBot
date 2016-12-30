import BotAction from '../../bot/BotAction';
import util from '../../util';
import {COMMAND_GROUPING, ADVISOR, ICON, PERSONA} from '../../constants';
import Items from '../../DestinyItemsDefinition.json';

const EXOTIC_CATEGORY = 'Exotic Gear';
let command = ['xur'],
    respondsTo = ['direct_message', 'direct_mention', 'mention'],
    description = 'Return items Xur currently sells';

function action(bot, message, command) {
    return getXur()
        .then(_processActivity)
        .then(response => bot[command.replyFunctionName](message, response));
};

function getXur() {
    if (process.env.DEBUG && process.env.DEBUG.indexOf('xur') != -1) {
        return new Promise(function (fulfill, reject){
            readFile('../../../../showoff-helpers/xur.json', 'utf8').done(function (res){
            try {
                var response = JSON.parse(res);
                fulfill(response.Response.data);
            } catch (ex) {
                reject(ex);
            }
            }, reject);
        });
    }
    return util.destiny.getXur();
}
function _processActivity(xur) {
    // TODO: what if there's no Xur?
    // console.log(xur);
    let exoticGear = xur.saleItemCategories.find(val => val.categoryTitle === EXOTIC_CATEGORY);
    let exoticItems = exoticGear.saleItems
        .map(val => { 
            // console.log(val);
            return Items[val.item.itemHash].n})
        .join(", ");
    let activity = {
       activityName: 'Exotic Gear for Sale',
       activityDescription: exoticItems,
       thumb_url: ICON.XUR,
       image_url: ICON.XUR
    };
    let attachments = [util.destiny.helpers.basicActivityAttachment(activity)];
    return util.slack.personaResponse('Agent of The Nine', PERSONA.XUR, attachments);
}
export default new BotAction({
    command,
    respondsTo,
    action,
    description,
    grouping: COMMAND_GROUPING.VENDORS
})