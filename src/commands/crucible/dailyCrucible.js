import BotAction from '../../bot/BotAction';
import util from '../../util';
import {COMMAND_GROUPING, ADVISOR} from '../../constants';

let command = ['daily crucible', 'daily pvp', 'daily'],
    respondsTo = ['direct_message', 'direct_mention', 'mention'],
    description = 'Returns the daily pvp';

function action(bot, message, command) {
    return util.destiny.getAdvisor(ADVISOR.DAILY_CRUCIBLE)
        .then(advisor => util.destiny.getActivity(advisor.activityHash))
        .then(_processActivity)
        .then(response => bot[command.replyFunctionName](message, response));
}

function _processActivity(activity) {
    let attachments = [util.destiny.helpers.basicActivityAttachment(activity)];

    if (activity.skulls) {
        attachments = attachments.concat(activity.skulls.map(util.destiny.helpers.skullToAttachment));
    }

    return util.destiny.helpers.crucibleSlackResponse('*Daily Crucible*', attachments);
}
export default new BotAction({
    command,
    respondsTo,
    action,
    description,
    grouping: COMMAND_GROUPING.CRUCIBLE
})