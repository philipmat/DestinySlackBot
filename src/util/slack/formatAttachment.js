export default formatAttachment;

function formatAttachment({actions, thumb_url, title = '', title_link, text = '', fields = [], fallback, color, footer, mrkdwn_in = ["text", "pretext", "title"]}) {
    let attachment = {
        title,
        text,
        fields,
        mrkdwn_in
    };

    if(color) {
        attachment['color'] = color;
    }
    if(actions) {
        attachment['actions'] = actions;
    }
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