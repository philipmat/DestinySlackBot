export default basicActivityAttachment;

function basicActivityAttachment(activity) {
    let attachment = {
        title: `${activity.activityName}`,
        text: activity.activityDescription.split('\n').map(text => `_${text}_`).join('\n'),
        thumb_url: `http://bungie.net${activity.releaseIcon}`,
        image_url: `http://bungie.net${activity.pgcrImage}`,
        mrkdwn_in: ['text', 'pretext', 'title']
    };

    return attachment;
}