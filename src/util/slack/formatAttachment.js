import {COLOR, ICON} from '../../constants';

export default formatAttachment;

function formatAttachment({thumb_url = ICON.BROTHER_VANCE, title = '', title_link, text = '', fields = [], fallback, color = COLOR.BROTHER_VANCE, footer}) {
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