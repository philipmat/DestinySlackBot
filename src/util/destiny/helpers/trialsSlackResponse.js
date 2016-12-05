import {BOT_NAME, ICON} from '../../../constants';
import formatSlackResponse from '../../../util/slack/formatResponse';

export default trialsSlackResponse;

function trialsSlackResponse(text, attachments = []) {
    return formatSlackResponse({text, attachments, userName: BOT_NAME.BROTHER_VANCE, iconUrl: ICON.BROTHER_VANCE});
}