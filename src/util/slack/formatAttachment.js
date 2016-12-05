import {COLOR} from '../../constants';

export default formatAttachment;

function formatAttachment({thumb_url, title = '', title_link, text = '', fields = [], fallback, color = COLOR.BROTHER_VANCE, footer}) {
    let attachment = {
        title,
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
    if(thumb_url) {
        attachment['thumb_url'] = thumb_url;
    }

    return attachment;
}