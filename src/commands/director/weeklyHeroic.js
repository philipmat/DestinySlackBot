import BotAction from '../../bot/BotAction';
import util from '../../util';
import {COMMAND_GROUPING, ADVISOR, PERSONA} from '../../constants';

let command = ['weekly heroic', 'heroic'],
    respondsTo = ['direct_message', 'direct_mention', 'mention'],
    description = 'Returns the weekly heroic strike modifiers';

function action(bot, message, command) {
    let skullIndexes = [];
    return util.destiny.getAdvisor(ADVISOR.HEROIC_STRIKE)
        .then(advisor => {
            skullIndexes = advisor.skulls;
            return util.destiny.getActivity(advisor.activityHash);
        })
        .then(activity => _processActivity(activity, skullIndexes))
        .then(response => bot[command.replyFunctionName](message, response));
}

function _processActivity(activity, skullIndexes) {
    let attachments = [util.destiny.helpers.basicActivityAttachment(activity)];

    if (activity.skulls) {
        activity.skulls = util.destiny.helpers.mapSkulls(skullIndexes, activity.skulls);
        attachments = attachments.concat(activity.skulls.map(util.destiny.helpers.skullToAttachment));
    }

    return util.slack.personaResponse('*Weekly Heroic Strikes*', PERSONA.CAYDE_6, attachments);
}
export default new BotAction({
    command,
    respondsTo,
    action,
    description,
    grouping: COMMAND_GROUPING.DIRECTOR
})