import {BOT_NAME, ICON} from '../../../constants';
import formatSlackResponse from '../../../util/slack/formatResponse';

export default directorSlackResponse;

function directorSlackResponse(text, attachments = []) {
    return formatSlackResponse({text, attachments, userName: BOT_NAME.CAYDE_6, iconUrl: ICON.CAYDE_6});
}