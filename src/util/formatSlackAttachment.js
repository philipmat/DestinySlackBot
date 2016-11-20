const DEFAULT_ATTACHMENT_COLOR = '#d0d15a';
const DEFAULT_THUMB_URL = 'http://bungie.net/common/destiny_content/icons/1b05977e8d0a56538c8a74ce6335ba28.jpg';

export default formatSlackAttachment;

function formatSlackAttachment({thumb_url = DEFAULT_THUMB_URL, title = '', title_link, text = '', fields = [], fallback, color = DEFAULT_ATTACHMENT_COLOR, footer}) {
    let attachment = {
        title,
        thumb_url,
        text,
        color,
        fields
    };

    if(title_link) {
        attachment['title_link'] = title_link;
    }
    if(fallback) {
        attachment['fallback'] = fallback;
    }
    if(footer) {
        attachment['footer'] = footer;
    }

    return attachment;
}