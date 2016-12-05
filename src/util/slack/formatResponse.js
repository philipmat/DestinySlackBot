export default formatResponse;

function formatResponse({text = '', userName, iconUrl, attachments = []}) {
    return {
        username: userName,
        icon_url: iconUrl,
        attachments: attachments instanceof Array ? attachments : [attachments],
        text
    }
}