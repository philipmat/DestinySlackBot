const DEFAULT_USER_NAME = 'Brother Vance [Bot]';
const DEFAULT_USER_ICON = 'https://avatars.slack-edge.com/2016-03-04/24531630918_f9aaff1dc98d0c43d827_192.png';

export default formatSlackResponse;

function formatSlackResponse({text = '', userName = DEFAULT_USER_NAME, iconUrl = DEFAULT_USER_ICON, attachments = []}) {
    return {
        username: userName,
        icon_url: iconUrl,
        attachments: attachments,
        text
    }
}