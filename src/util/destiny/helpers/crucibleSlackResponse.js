import {BOT_NAME, ICON} from '../../../constants';
import formatSlackResponse from '../../../util/slack/formatResponse';

export default crucibleSlackResponse;

function crucibleSlackResponse(text, attachments = []) {
    return formatSlackResponse({text, attachments, userName: BOT_NAME.LORD_SHAXX, iconUrl: ICON.LORD_SHAXX});
}