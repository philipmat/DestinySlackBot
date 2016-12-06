import {BOT_NAME, ICON} from '../../../constants';
import formatSlackResponse from '../../../util/slack/formatResponse';

export default twitchSlackResponse;

function twitchSlackResponse(text, attachments = []) {
    return formatSlackResponse({text, attachments, userName: BOT_NAME.TWITCH, iconUrl: ICON.TWITCH});
}