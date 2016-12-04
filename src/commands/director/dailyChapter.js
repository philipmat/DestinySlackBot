import BotAction from '../../bot/BotAction';
import util from '../../util';
import {COMMAND_GROUPING, ADVISOR} from '../../constants';

let command = ['daily chapter', 'daily story', 'story', 'chapter'],
    respondsTo = ['direct_message', 'direct_mention', 'mention'],
    description = 'Returns the daily story';

function action(bot, message, command) {
    return util.destiny.getAdvisor(ADVISOR.DAILY_CHAPTER)
        .then(advisor => util.destiny.getActivity(advisor.activityHash))
        .then(_processActivity)
        .then(response => bot[command.replyFunctionName](message, response));
}

function _processActivity(activity) {
    let attachments = [util.destiny.helpers.basicActivityAttachment(activity)];

    if (activity.skulls) {
        attachments = attachments.concat(activity.skulls.map(util.destiny.helpers.skullToAttachment));
    }

    return util.destiny.helpers.directorSlackResponse('*Daily Chapter*', attachments);
}
export default new BotAction({
    command,
    respondsTo,
    action,
    description,
    grouping: COMMAND_GROUPING.DIRECTOR
})